// src/components/RecipeCard.jsx
import React, { useState } from 'react';
import { 
  Clock, 
  Users, 
  ChefHat, 
  Heart, 
  Star,
  Leaf,
  Wheat,
  Beef
} from 'lucide-react';
import RatingStars from './RatingStars';
import NutritionInfo from './NutritionInfo';
import RecipeModal from './RecipeModal';

const RecipeCard = ({ 
  recipe, 
  userIngredients = [], 
  isSaved = false, 
  onToggleSave,
  showMatchScore = true,
  variant = 'default'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const matchPercent = Math.round((recipe.matchScore || 0) * 100);
  const hasHighMatch = matchPercent >= 80;
  const hasMediumMatch = matchPercent >= 60;

  // Calculate ingredient match status
  const getIngredientMatchStatus = () => {
    const matchedCount = recipe.matchedIngredients?.length || 0;
    const totalCount = recipe.ingredients.length;
    return { matchedCount, totalCount };
  };

  const { matchedCount, totalCount } = getIngredientMatchStatus();

  const getDietaryIcon = (dietary) => {
    const icons = {
      vegetarian: <Leaf size={14} />,
      vegan: <Leaf size={14} />,
      'gluten-free': <Wheat size={14} />,
    };
    return icons[dietary] || null;
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleSaveClick = (e) => {
    e.stopPropagation();
    onToggleSave?.(recipe.id);
  };

  const getMatchBadgeColor = () => {
    if (hasHighMatch) return 'var(--success)';
    if (hasMediumMatch) return 'var(--warning)';
    return 'var(--error)';
  };

  return (
    <>
      <div 
        style={{
          ...styles.card,
          ...styles[variant],
          transform: variant === 'featured' ? 'scale(1.02)' : 'scale(1)'
        }} 
        onClick={() => setIsModalOpen(true)}
        className="recipe-card"
      >
        <div style={styles.imageContainer}>
          {!imageError ? (
            <img 
              src={recipe.image} 
              alt={recipe.name}
              style={{
                ...styles.image,
                opacity: imageLoaded ? 1 : 0
              }}
              onLoad={() => setImageLoaded(true)}
              onError={handleImageError}
            />
          ) : (
            <div style={styles.imagePlaceholder}>
              <ChefHat size={32} color="var(--gray-400)" />
            </div>
          )}
          
          {showMatchScore && recipe.matchScore && (
            <div 
              style={{
                ...styles.matchBadge,
                background: getMatchBadgeColor()
              }}
            >
              {matchPercent}% Match
            </div>
          )}

          {recipe.dietary?.length > 0 && (
            <div style={styles.dietaryBadges}>
              {recipe.dietary.slice(0, 2).map((diet) => (
                <div key={diet} style={styles.dietaryBadge}>
                  {getDietaryIcon(diet)}
                  <span style={styles.dietaryText}>{diet}</span>
                </div>
              ))}
              {recipe.dietary.length > 2 && (
                <div style={styles.dietaryBadge}>+{recipe.dietary.length - 2}</div>
              )}
            </div>
          )}

          {/* Loading skeleton */}
          {!imageLoaded && !imageError && (
            <div style={styles.imageSkeleton} />
          )}
        </div>

        <div style={styles.content}>
          <div style={styles.header}>
            <h3 style={styles.title}>{recipe.name}</h3>
            <p style={styles.cuisine}>{recipe.cuisine}</p>
          </div>

          {/* Ingredient match progress */}
          {userIngredients.length > 0 && (
            <div style={styles.matchProgress}>
              <div style={styles.progressBar}>
                <div 
                  style={{
                    ...styles.progressFill,
                    width: `${(matchedCount / totalCount) * 100}%`,
                    background: getMatchBadgeColor()
                  }}
                />
              </div>
              <span style={styles.progressText}>
                {matchedCount}/{totalCount} ingredients
              </span>
            </div>
          )}

          <div style={styles.stats}>
            <div style={styles.stat}>
              <Clock size={16} />
              <span>{recipe.cookingTime} min</span>
            </div>
            <div style={styles.stat}>
              <Users size={16} />
              <span>{recipe.servings} {recipe.servings === 1 ? 'serving' : 'servings'}</span>
            </div>
            <div style={styles.stat}>
              <ChefHat size={16} />
              <span style={{ textTransform: 'capitalize' }}>{recipe.difficulty}</span>
            </div>
          </div>

          {recipe.tags && recipe.tags.length > 0 && (
            <div style={styles.tags}>
              {recipe.tags.slice(0, 3).map((tag, index) => (
                <span key={index} style={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div style={styles.nutrition}>
            <NutritionInfo 
              nutrition={recipe.nutrition} 
              variant="compact" 
            />
          </div>

          <div style={styles.footer}>
            <div style={styles.rating}>
              <RatingStars 
                rating={recipe.rating || 4.5} 
                size={16} 
                variant="compact" 
              />
              <span style={styles.ratingCount}>({recipe.ratingCount || '12'})</span>
            </div>
            
            <button
              style={{
                ...styles.saveBtn,
                background: isSaved ? 'var(--primary)' : 'var(--gray-100)',
                color: isSaved ? 'white' : 'var(--gray-700)',
                transform: isSaved ? 'scale(1.1)' : 'scale(1)'
              }}
              onClick={handleSaveClick}
              aria-label={isSaved ? 'Remove from saved' : 'Save recipe'}
              className="save-button"
            >
              <Heart
                size={20}
                fill={isSaved ? 'currentColor' : 'none'}
                stroke={isSaved ? 'currentColor' : 'currentColor'}
              />
            </button>
          </div>
        </div>
      </div>

      <RecipeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recipe={recipe}
        userIngredients={userIngredients}
        isSaved={isSaved}
        onToggleSave={() => onToggleSave?.(recipe.id)}
      />
    </>
  );
};

const styles = {
  card: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative',
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
    }
  },
  featured: {
    border: '2px solid var(--primary)',
    boxShadow: '0 8px 24px rgba(74, 144, 226, 0.15)'
  },
  compact: {
    display: 'flex',
    height: '120px'
  },
  imageContainer: {
    position: 'relative',
    height: '200px',
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'opacity 0.3s ease'
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    background: 'var(--gray-100)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageSkeleton: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, var(--gray-100) 25%, var(--gray-200) 50%, var(--gray-100) 75%)',
    backgroundSize: '200% 100%',
    animation: 'loading 1.5s infinite'
  },
  matchBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    backdropFilter: 'blur(10px)',
    zIndex: 2
  },
  dietaryBadges: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    zIndex: 2
  },
  dietaryBadge: {
    background: 'rgba(255,255,255,0.95)',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '0.7rem',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontWeight: '500',
    backdropFilter: 'blur(10px)'
  },
  dietaryText: {
    textTransform: 'capitalize'
  },
  content: {
    padding: '1rem'
  },
  header: {
    marginBottom: '0.75rem'
  },
  title: {
    margin: '0 0 0.25rem',
    fontSize: '1.1rem',
    fontWeight: '600',
    lineHeight: '1.3',
    color: 'var(--gray-900)'
  },
  cuisine: {
    color: 'var(--primary)',
    fontSize: '0.85rem',
    fontWeight: '500',
    textTransform: 'capitalize'
  },
  matchProgress: {
    marginBottom: '0.75rem'
  },
  progressBar: {
    height: '6px',
    background: 'var(--gray-200)',
    borderRadius: '3px',
    overflow: 'hidden',
    marginBottom: '4px'
  },
  progressFill: {
    height: '100%',
    transition: 'width 0.3s ease'
  },
  progressText: {
    fontSize: '0.75rem',
    color: 'var(--gray-600)'
  },
  stats: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '0.75rem',
    fontSize: '0.85rem',
    color: 'var(--gray-600)'
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  tags: {
    display: 'flex',
    gap: '6px',
    marginBottom: '0.75rem',
    flexWrap: 'wrap'
  },
  tag: {
    background: 'var(--gray-100)',
    color: 'var(--gray-700)',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '0.75rem'
  },
  nutrition: {
    margin: '0.75rem 0'
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '0.75rem'
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  ratingCount: {
    fontSize: '0.8rem',
    color: 'var(--gray-600)'
  },
  saveBtn: {
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    ':hover': {
      transform: 'scale(1.1)'
    }
  }
};

// Add CSS animations
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
  .recipe-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  }
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
  .save-button:hover {
    transform: scale(1.1);
  }
`, styleSheet.cssRules.length);

export default RecipeCard;