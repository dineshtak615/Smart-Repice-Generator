// src/components/Loader.jsx
import React from 'react';
import { Loader as LoaderIcon, Clock, ChefHat, Sparkles } from 'lucide-react';

const Loader = ({ 
  size = 40, 
  text = "Loading...", 
  variant = "spinner",
  color = "var(--primary)",
  background = "var(--gray-200)",
  speed = "1s",
  overlay = false,
  fullScreen = false,
  className = ""
}) => {
  const getVariantStyles = () => {
    const baseSpinner = {
      width: size,
      height: size,
      borderRadius: '50%',
      animation: `spin ${speed} linear infinite`
    };

    const basePulse = {
      width: size,
      height: size,
      borderRadius: '50%',
      animation: `pulse ${speed} ease-in-out infinite`
    };

    const baseBounce = {
      width: size / 2,
      height: size / 2,
      borderRadius: '50%',
      animation: `bounce ${speed} infinite`
    };

    switch (variant) {
      case "dots":
        return (
          <div style={styles.dotsContainer}>
            {[0, 1, 2].map(i => (
              <div
                key={i}
                style={{
                  ...styles.dot,
                  width: size / 3,
                  height: size / 3,
                  background: color,
                  animationDelay: `${i * 0.15}s`
                }}
              />
            ))}
          </div>
        );

      case "pulse":
        return (
          <div style={{
            ...basePulse,
            background: color
          }} />
        );

      case "bounce":
        return (
          <div style={styles.bounceContainer}>
            {[0, 1, 2].map(i => (
              <div
                key={i}
                style={{
                  ...baseBounce,
                  background: color,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        );

      case "progress":
        return (
          <div style={styles.progressContainer}>
            <div style={{
              ...styles.progressBar,
              width: size * 3,
              background: background
            }}>
              <div style={{
                ...styles.progressFill,
                background: color,
                animation: `progress ${speed} ease-in-out infinite`
              }} />
            </div>
          </div>
        );

      case "chef":
        return (
          <div style={styles.chefContainer}>
            <ChefHat 
              size={size} 
              color={color}
              style={{
                animation: `bounce ${speed} infinite`
              }}
            />
          </div>
        );

      case "clock":
        return (
          <div style={styles.clockContainer}>
            <Clock 
              size={size} 
              color={color}
              style={{
                animation: `spin ${speed} linear infinite`
              }}
            />
          </div>
        );

      case "sparkles":
        return (
          <div style={styles.sparklesContainer}>
            <Sparkles 
              size={size} 
              color={color}
              style={{
                animation: `pulse ${speed} ease-in-out infinite`
              }}
            />
          </div>
        );

      default: // spinner
        return (
          <div style={{
            ...baseSpinner,
            border: `${size / 10}px solid ${background}`,
            borderTop: `${size / 10}px solid ${color}`
          }} />
        );
    }
  };

  const getLoadingTexts = () => {
    const cookingTexts = [
      "Preparing your recipes...",
      "Finding perfect matches...",
      "Analyzing ingredients...",
      "Almost ready...",
      "Cooking up something delicious...",
      "Matching your ingredients...",
      "Searching our recipe database...",
      "Getting everything ready..."
    ];

    return Array.isArray(text) ? text : [text || cookingTexts[0]];
  };

  const loadingTexts = getLoadingTexts();
  const [currentTextIndex, setCurrentTextIndex] = React.useState(0);

  React.useEffect(() => {
    if (loadingTexts.length > 1) {
      const interval = setInterval(() => {
        setCurrentTextIndex(prev => (prev + 1) % loadingTexts.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [loadingTexts.length]);

  const containerStyles = {
    ...styles.container,
    ...(overlay && styles.overlay),
    ...(fullScreen && styles.fullScreen),
    ...className
  };

  return (
    <div style={containerStyles}>
      <div style={styles.loaderContent}>
        {getVariantStyles()}
        
        <div style={styles.textContainer}>
          <p style={{
            ...styles.text,
            color: variant === 'progress' ? color : 'var(--gray-600)'
          }}>
            {loadingTexts[currentTextIndex]}
          </p>
          
          {loadingTexts.length > 1 && (
            <div style={styles.textDots}>
              {loadingTexts.map((_, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.textDot,
                    background: index === currentTextIndex ? color : background,
                    opacity: index === currentTextIndex ? 1 : 0.3
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Optional percentage for progress bar */}
        {variant === "progress" && (
          <div style={styles.percentage}>
            <span style={{ color }}>
              {Math.floor((Date.now() % 1000) / 10)}%
            </span>
          </div>
        )}
      </div>

      {/* Optional decorative elements */}
      {variant === "chef" && (
        <div style={styles.cookingElements}>
          <div style={styles.bubble}></div>
          <div style={{...styles.bubble, animationDelay: '0.5s'}}></div>
          <div style={{...styles.bubble, animationDelay: '1s'}}></div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    transition: 'all 0.3s ease'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(8px)',
    zIndex: 1000
  },
  fullScreen: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(12px)',
    zIndex: 9999
  },
  loaderContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem'
  },
  dotsContainer: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center'
  },
  dot: {
    borderRadius: '50%',
    animation: 'bounce 1.4s ease-in-out infinite both'
  },
  bounceContainer: {
    display: 'flex',
    gap: '0.25rem',
    alignItems: 'flex-end'
  },
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem'
  },
  progressBar: {
    height: '6px',
    borderRadius: '3px',
    overflow: 'hidden',
    position: 'relative'
  },
  progressFill: {
    height: '100%',
    borderRadius: '3px',
    position: 'absolute',
    left: 0,
    top: 0
  },
  chefContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  clockContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sparklesContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem'
  },
  text: {
    margin: 0,
    fontWeight: '500',
    fontSize: '1rem',
    textAlign: 'center',
    transition: 'opacity 0.3s ease'
  },
  textDots: {
    display: 'flex',
    gap: '0.25rem'
  },
  textDot: {
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    transition: 'all 0.3s ease'
  },
  percentage: {
    marginTop: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: '600'
  },
  cookingElements: {
    position: 'absolute',
    bottom: '2rem',
    display: 'flex',
    gap: '0.5rem'
  },
  bubble: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'var(--primary)',
    opacity: 0.6,
    animation: 'float 2s ease-in-out infinite'
  }
};

// CSS Animations (to be added to global CSS)
const cssAnimations = `
@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(0.8); opacity: 0.7; }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes progress {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(0%); }
  100% { transform: translateX(100%); }
}

@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
  50% { transform: translateY(-10px) scale(1.1); opacity: 1; }
}

/* Add animations to document */
${() => {
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = cssAnimations;
    document.head.appendChild(style);
  }
}}
`;

// Predefined loader configurations for common use cases
Loader.Presets = {
  RecipeSearch: () => (
    <Loader
      variant="chef"
      text={[
        "Searching for recipes...",
        "Matching your ingredients...",
        "Finding perfect combinations...",
        "Almost there..."
      ]}
      color="var(--primary)"
      size={48}
    />
  ),
  ImageAnalysis: () => (
    <Loader
      variant="sparkles"
      text={[
        "Analyzing your image...",
        "Detecting ingredients...",
        "Identifying food items...",
        "Processing complete soon..."
      ]}
      color="var(--success)"
      size={44}
    />
  ),
  PageLoad: () => (
    <Loader
      variant="dots"
      text="Loading recipe database..."
      color="var(--primary)"
      fullScreen={true}
    />
  ),
  Saving: () => (
    <Loader
      variant="progress"
      text="Saving your changes..."
      color="var(--success)"
      size={30}
    />
  ),
  Processing: () => (
    <Loader
      variant="clock"
      text="Processing your request..."
      color="var(--warning)"
      size={36}
    />
  )
};

export default Loader;