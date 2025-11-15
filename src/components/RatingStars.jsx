// src/components/RatingStars.jsx
import React, { useState, useEffect } from 'react';
import { Star, StarHalf } from 'lucide-react';

const RatingStars = ({ 
  rating = 0, 
  interactive = false, 
  size = 24, 
  variant = 'full',
  showNumber = true,
  showCount = false,
  ratingCount = 0,
  onRate,
  maxStars = 5,
  color = 'var(--warning)',
  emptyColor = 'var(--gray-300)',
  className = ''
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setCurrentRating(rating);
  }, [rating]);

  const handleStarClick = (star) => {
    if (!interactive) return;
    
    setIsAnimating(true);
    setCurrentRating(star);
    setHoverRating(0);
    
    if (onRate) {
      onRate(star);
    }
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleStarHover = (star) => {
    if (!interactive) return;
    setHoverRating(star);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setHoverRating(0);
  };

  const renderStars = () => {
    const stars = [];
    const displayRating = interactive ? hoverRating || currentRating : currentRating;
    const fullStars = Math.floor(displayRating);
    const hasHalfStar = displayRating % 1 >= 0.25 && displayRating % 1 <= 0.75;
    const partialStar = displayRating % 1;

    for (let i = 1; i <= maxStars; i++) {
      const isFull = i <= fullStars;
      const isPartial = hasHalfStar && i === fullStars + 1;
      const isHovered = interactive && i <= hoverRating;
      const isActive = interactive && i <= currentRating;

      let fillPercentage = 0;
      if (isFull) fillPercentage = 100;
      else if (isPartial) fillPercentage = partialStar * 100;

      const starStyle = {
        cursor: interactive ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        transform: isAnimating && isActive ? 'scale(1.2)' : 'scale(1)',
        filter: isHovered ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none'
      };

      if (variant === 'precision') {
        // Precision mode with gradient fills
        stars.push(
          <div
            key={i}
            style={starStyle}
            onClick={() => handleStarClick(i)}
            onMouseEnter={() => handleStarHover(i)}
            onMouseLeave={handleMouseLeave}
            aria-label={`Rate ${i} out of ${maxStars}`}
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill="none"
              stroke={emptyColor}
              strokeWidth="1.5"
            >
              {/* Background star */}
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              
              {/* Fill overlay */}
              {fillPercentage > 0 && (
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  fill={color}
                  fillOpacity={fillPercentage / 100}
                />
              )}
            </svg>
          </div>
        );
      } else {
        // Standard mode with full/half/empty stars
        stars.push(
          <div
            key={i}
            style={starStyle}
            onClick={() => handleStarClick(i)}
            onMouseEnter={() => handleStarHover(i)}
            onMouseLeave={handleMouseLeave}
            aria-label={`Rate ${i} out of ${maxStars}`}
          >
            {isFull ? (
              <Star
                size={size}
                fill={color}
                stroke={color}
              />
            ) : isPartial ? (
              <div style={{ position: 'relative' }}>
                <Star
                  size={size}
                  fill={emptyColor}
                  stroke={emptyColor}
                />
                <div style={{ position: 'absolute', top: 0, left: 0, width: '50%', overflow: 'hidden' }}>
                  <Star
                    size={size}
                    fill={color}
                    stroke={color}
                  />
                </div>
              </div>
            ) : (
              <Star
                size={size}
                fill={i <= (hoverRating || 0) ? color : 'none'}
                stroke={i <= (hoverRating || 0) ? color : emptyColor}
                opacity={i <= (hoverRating || 0) ? 0.6 : 1}
              />
            )}
          </div>
        );
      }
    }

    return stars;
  };

  const getRatingText = () => {
    if (variant === 'minimal' && !showNumber) return null;
    
    const formattedRating = currentRating % 1 === 0 ? currentRating.toFixed(0) : currentRating.toFixed(1);
    
    return (
      <span style={styles.text}>
        {showNumber && (
          <>
            <strong style={{ color: 'var(--gray-900)' }}>{formattedRating}</strong>
            <span style={{ color: 'var(--gray-500)' }}>/{maxStars}</span>
          </>
        )}
        {showCount && ratingCount > 0 && (
          <span style={styles.count}>({ratingCount})</span>
        )}
      </span>
    );
  };

  const getSizeStyles = () => {
    const baseSize = {
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    };

    switch (variant) {
      case 'compact':
        return { ...baseSize, gap: '2px' };
      case 'minimal':
        return { ...baseSize, gap: '1px' };
      case 'large':
        return { ...baseSize, gap: '8px' };
      default:
        return baseSize;
    }
  };

  return (
    <div 
      style={getSizeStyles()} 
      className={`rating-stars ${className}`}
      role={interactive ? 'radiogroup' : 'img'}
      aria-label={`Rating: ${currentRating} out of ${maxStars} stars`}
    >
      {renderStars()}
      {getRatingText()}
    </div>
  );
};

const styles = {
  text: {
    marginLeft: '8px',
    fontSize: '0.9em',
    color: 'var(--gray-700)'
  },
  count: {
    marginLeft: '4px',
    fontSize: '0.8em',
    color: 'var(--gray-500)'
  }
};

// Add CSS animations
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  .rating-stars div {
    transition: all 0.2s ease;
  }
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
  .rating-stars:hover div {
    transform: scale(1.05);
  }
`, styleSheet.cssRules.length);

export default RatingStars;