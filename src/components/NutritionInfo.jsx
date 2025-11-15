// src/components/NutritionInfo.jsx
import React, { useState } from 'react';
import { Info, TrendingUp, Apple, Drumstick, Carrot, Zap } from 'lucide-react';

const NutritionInfo = ({ 
  nutrition, 
  servingSize = 1,
  variant = 'full',
  showDailyValues = false,
  compact = false,
  interactive = false,
  className = ''
}) => {
  const [expanded, setExpanded] = useState(false);
  const [activeNutrient, setActiveNutrient] = useState(null);

  // Daily Value percentages based on 2000 calorie diet
  const dailyValues = {
    calories: 2000,
    protein: 50, // grams
    carbs: 300, // grams
    fat: 65, // grams
    fiber: 28, // grams
    sugar: 50, // grams
    sodium: 2300, // milligrams
    saturatedFat: 20, // grams
    cholesterol: 300 // milligrams
  };

  const getNutrientIcon = (nutrient) => {
    const icons = {
      calories: <Zap size={14} />,
      protein: <Drumstick size={14} />,
      carbs: <Apple size={14} />,
      fat: <Carrot size={14} />,
      fiber: <TrendingUp size={14} />,
      sugar: <Apple size={14} />,
      sodium: <Info size={14} />,
      saturatedFat: <Carrot size={14} />,
      cholesterol: <Info size={14} />
    };
    return icons[nutrient] || <Info size={14} />;
  };

  const getNutrientColor = (nutrient, value) => {
    const colors = {
      calories: 'var(--error)',
      protein: 'var(--success)',
      carbs: 'var(--warning)',
      fat: 'var(--info)',
      fiber: 'var(--success)',
      sugar: 'var(--error)',
      sodium: 'var(--warning)',
      saturatedFat: 'var(--error)',
      cholesterol: 'var(--warning)'
    };

    // Adjust color intensity based on daily value percentage
    if (showDailyValues && dailyValues[nutrient]) {
      const percentage = (value / dailyValues[nutrient]) * 100;
      if (percentage > 100) return 'var(--error)';
      if (percentage > 80) return 'var(--warning)';
    }

    return colors[nutrient] || 'var(--gray-600)';
  };

  const getNutrientDescription = (nutrient) => {
    const descriptions = {
      calories: 'Energy provided by food',
      protein: 'Builds and repairs tissues',
      carbs: 'Primary energy source',
      fat: 'Energy storage and hormone production',
      fiber: 'Supports digestion and heart health',
      sugar: 'Simple carbohydrates for quick energy',
      sodium: 'Essential electrolyte for fluid balance',
      saturatedFat: 'Solid fat that may raise cholesterol',
      cholesterol: 'Fat-like substance in blood'
    };
    return descriptions[nutrient] || '';
  };

  const calculateDailyValue = (nutrient, value) => {
    if (!dailyValues[nutrient] || !showDailyValues) return null;
    return Math.round((value / dailyValues[nutrient]) * 100);
  };

  const mainNutrients = [
    { 
      key: 'calories', 
      label: 'Calories', 
      value: nutrition.calories, 
      unit: 'kcal',
      priority: 1
    },
    { 
      key: 'protein', 
      label: 'Protein', 
      value: nutrition.protein, 
      unit: 'g',
      priority: 2
    },
    { 
      key: 'carbs', 
      label: 'Carbs', 
      value: nutrition.carbs, 
      unit: 'g',
      priority: 3
    },
    { 
      key: 'fat', 
      label: 'Fat', 
      value: nutrition.fat, 
      unit: 'g',
      priority: 4
    }
  ];

  const secondaryNutrients = [
    { 
      key: 'fiber', 
      label: 'Fiber', 
      value: nutrition.fiber, 
      unit: 'g',
      priority: 5
    },
    { 
      key: 'sugar', 
      label: 'Sugar', 
      value: nutrition.sugar, 
      unit: 'g',
      priority: 6
    },
    { 
      key: 'sodium', 
      label: 'Sodium', 
      value: nutrition.sodium, 
      unit: 'mg',
      priority: 7
    },
    { 
      key: 'saturatedFat', 
      label: 'Sat. Fat', 
      value: nutrition.saturatedFat, 
      unit: 'g',
      priority: 8
    },
    { 
      key: 'cholesterol', 
      label: 'Cholesterol', 
      value: nutrition.cholesterol, 
      unit: 'mg',
      priority: 9
    }
  ].filter(nutrient => nutrition[nutrient.key] !== undefined);

  const scaledNutrition = Object.keys(nutrition).reduce((acc, key) => {
    acc[key] = Math.round(nutrition[key] * (servingSize / 1));
    return acc;
  }, {});

  const renderNutrientItem = (nutrient, isMain = true) => {
    const value = scaledNutrition[nutrient.key];
    const dailyValue = calculateDailyValue(nutrient.key, value);
    const color = getNutrientColor(nutrient.key, value);
    const description = getNutrientDescription(nutrient.key);

    const handleMouseEnter = () => {
      if (interactive) setActiveNutrient(nutrient.key);
    };

    const handleMouseLeave = () => {
      if (interactive) setActiveNutrient(null);
    };

    return (
      <div
        key={nutrient.key}
        style={{
          ...styles.nutrientItem,
          ...(isMain ? styles.mainNutrient : styles.secondaryNutrient),
          ...(interactive && activeNutrient === nutrient.key ? styles.activeNutrient : {}),
          ...(variant === 'bars' ? styles.barItem : {})
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        title={interactive ? description : ''}
      >
        <div style={styles.nutrientHeader}>
          <div style={styles.nutrientLabel}>
            {variant !== 'minimal' && getNutrientIcon(nutrient.key)}
            <span style={styles.labelText}>{nutrient.label}</span>
          </div>
          
          {variant === 'bars' && dailyValue && (
            <div style={styles.dailyValue}>
              {dailyValue}%
            </div>
          )}
        </div>

        <div style={styles.nutrientValue}>
          <strong style={{ color }}>{value}</strong>
          <span style={styles.unit}>{nutrient.unit}</span>
          
          {showDailyValues && dailyValue && variant !== 'bars' && (
            <span style={styles.dailyValue}>
              {dailyValue}% DV
            </span>
          )}
        </div>

        {variant === 'bars' && dailyValue && (
          <div style={styles.barContainer}>
            <div 
              style={{
                ...styles.barFill,
                width: `${Math.min(dailyValue, 100)}%`,
                background: color
              }}
            />
          </div>
        )}
      </div>
    );
  };

  const renderCompactView = () => (
    <div style={styles.compact}>
      {mainNutrients.map(nutrient => (
        <div key={nutrient.key} style={styles.compactItem}>
          <div style={styles.compactValue}>
            <strong style={{ color: getNutrientColor(nutrient.key, scaledNutrition[nutrient.key]) }}>
              {scaledNutrition[nutrient.key]}
            </strong>
            <span style={styles.compactUnit}>{nutrient.unit}</span>
          </div>
          <div style={styles.compactLabel}>{nutrient.label}</div>
        </div>
      ))}
    </div>
  );

  const renderStandardView = () => (
    <div style={styles.standard}>
      <div style={styles.mainGrid}>
        {mainNutrients.map(nutrient => renderNutrientItem(nutrient, true))}
      </div>
      
      {secondaryNutrients.length > 0 && (
        <>
          {expanded ? (
            <div style={styles.secondaryGrid}>
              {secondaryNutrients.map(nutrient => renderNutrientItem(nutrient, false))}
            </div>
          ) : (
            <button
              style={styles.expandButton}
              onClick={() => setExpanded(true)}
            >
              + {secondaryNutrients.length} more nutrients
            </button>
          )}
        </>
      )}
    </div>
  );

  const renderBarView = () => (
    <div style={styles.barView}>
      {mainNutrients.concat(secondaryNutrients).map(nutrient => 
        renderNutrientItem(nutrient, true)
      )}
    </div>
  );

  const getContainerStyles = () => {
    const base = {
      background: 'var(--gray-50)',
      borderRadius: '12px',
      padding: '1rem'
    };

    switch (variant) {
      case 'compact':
        return { ...base, padding: '0.75rem' };
      case 'minimal':
        return { ...base, padding: '0.5rem', background: 'transparent' };
      case 'bars':
        return { ...base, background: 'white', border: '1px solid var(--gray-200)' };
      default:
        return base;
    }
  };

  if (variant === 'minimal') {
    return renderCompactView();
  }

  return (
    <div 
      style={getContainerStyles()} 
      className={`nutrition-info ${className}`}
    >
      {servingSize > 1 && (
        <div style={styles.servingInfo}>
          Nutrition for {servingSize} {servingSize === 1 ? 'serving' : 'servings'}
        </div>
      )}
      
      {variant === 'bars' ? renderBarView() : renderStandardView()}
    </div>
  );
};

const styles = {
  compact: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.85rem'
  },
  compactItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px'
  },
  compactValue: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '2px',
    fontWeight: 'bold'
  },
  compactUnit: {
    fontSize: '0.7rem',
    color: 'var(--gray-500)'
  },
  compactLabel: {
    fontSize: '0.75rem',
    color: 'var(--gray-600)',
    textAlign: 'center'
  },
  standard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '1rem'
  },
  secondaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '0.75rem',
    marginTop: '0.75rem',
    paddingTop: '0.75rem',
    borderTop: '1px solid var(--gray-200)'
  },
  barView: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  nutrientItem: {
    padding: '0.5rem',
    borderRadius: '8px',
    transition: 'all 0.2s ease'
  },
  mainNutrient: {
    background: 'white',
    border: '1px solid var(--gray-200)'
  },
  secondaryNutrient: {
    background: 'var(--gray-100)'
  },
  activeNutrient: {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    background: 'var(--gray-100)'
  },
  barItem: {
    background: 'transparent',
    border: 'none',
    padding: '0.25rem 0'
  },
  nutrientHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.25rem'
  },
  nutrientLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.85rem',
    color: 'var(--gray-700)'
  },
  labelText: {
    fontWeight: '500'
  },
  nutrientValue: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
    fontSize: '1.1rem'
  },
  unit: {
    fontSize: '0.8rem',
    color: 'var(--gray-500)'
  },
  dailyValue: {
    fontSize: '0.75rem',
    color: 'var(--gray-500)',
    background: 'var(--gray-200)',
    padding: '2px 6px',
    borderRadius: '4px'
  },
  barContainer: {
    height: '6px',
    background: 'var(--gray-200)',
    borderRadius: '3px',
    overflow: 'hidden',
    marginTop: '4px'
  },
  barFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.3s ease'
  },
  servingInfo: {
    fontSize: '0.8rem',
    color: 'var(--gray-600)',
    marginBottom: '0.75rem',
    textAlign: 'center',
    fontStyle: 'italic'
  },
  expandButton: {
    background: 'none',
    border: '1px solid var(--gray-300)',
    color: 'var(--gray-600)',
    padding: '0.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    marginTop: '0.5rem',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'var(--gray-100)'
    }
  }
};

export default NutritionInfo;