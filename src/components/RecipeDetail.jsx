// src/components/RecipeDetail.jsx
import React, { useState } from 'react';
import { 
  Clock, 
  Users, 
  ChefHat, 
  Star, 
  Bookmark, 
  Share2, 
  Printer,
  Plus,
  Minus,
  Heart,
  Leaf,
  Wheat,
  AlertCircle,
  Timer,
  TrendingUp
} from 'lucide-react';
import NutritionInfo from './NutritionInfo';
import RatingStars from './RatingStars';

const RecipeDetail = ({ 
  recipe, 
  userIngredients = [], 
  servings: initialServings, 
  isSaved = false,
  onToggleSave,
  onPrint,
  onShare,
  className = ''
}) => {
  const [servings, setServings] = useState(initialServings || recipe.servings || 1);
  const [activeTab, setActiveTab] = useState('instructions');
  const [cookingTimer, setCookingTimer] = useState(null);
  const [timerActive, setTimerActive] = useState(false);

  // Calculate scaled nutrition
  const scaledNutrition = recipe.nutrition ? {
    calories: Math.round(recipe.nutrition.calories * (servings / recipe.servings)),
    protein: Math.round(recipe.nutrition.protein * (servings / recipe.servings)),
    carbs: Math.round(recipe.nutrition.carbs * (servings / recipe.servings)),
    fat: Math.round(recipe.nutrition.fat * (servings / recipe.servings)),
    fiber: recipe.nutrition.fiber ? Math.round(recipe.nutrition.fiber * (servings / recipe.servings)) : null,
    sugar: recipe.nutrition.sugar ? Math.round(recipe.nutrition.sugar * (servings / recipe.servings)) : null,
    sodium: recipe.nutrition.sodium ? Math.round(recipe.nutrition.sodium * (servings / recipe.servings)) : null
  } : null;

  // Calculate ingredient match status
  const ingredientStats = {
    total: recipe.ingredients.length,
    matched: recipe.ingredients.filter(ing => 
      userIngredients.includes(ing.toLowerCase())
    ).length,
    missing: recipe.ingredients.filter(ing => 
      !userIngredients.includes(ing.toLowerCase())
    )
  };

  const matchPercentage = Math.round((ingredientStats.matched / ingredientStats.total) * 100);

  // Cooking timer functions
  const startCookingTimer = () => {
    if (timerActive) {
      setTimerActive(false);
      setCookingTimer(null);
    } else {
      setTimerActive(true);
      setCookingTimer(recipe.cookingTime * 60); // Convert to seconds
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get dietary icon
  const getDietaryIcon = (dietary) => {
    const icons = {
      vegetarian: <Leaf size={16} />,
      vegan: <Leaf size={16} />,
      'gluten-free': <Wheat size={16} />,
    };
    return icons[dietary] || null;
  };

  // Render header section
  const renderHeader = () => (
    <div style={styles.header}>
      <div style={styles.headerContent}>
        <div style={styles.recipeMeta}>
          {recipe.dietary?.map(diet => (
            <span key={diet} style={styles.dietaryTag}>
              {getDietaryIcon(diet)}
              {diet}
            </span>
          ))}
          <span style={styles.cuisine}>{recipe.cuisine}</span>
        </div>
        
        <h1 style={styles.title}>{recipe.name}</h1>
        
        <div style={styles.stats}>
          <div style={styles.stat}>
            <Clock size={18} />
            <span>{recipe.cookingTime} min</span>
          </div>
          <div style={styles.stat}>
            <Users size={18} />
            <span>{servings} servings</span>
          </div>
          <div style={styles.stat}>
            <ChefHat size={18} />
            <span style={{ textTransform: 'capitalize' }}>{recipe.difficulty}</span>
          </div>
          {recipe.rating && (
            <div style={styles.stat}>
              <Star size={18} fill="currentColor" />
              <span>{recipe.rating}</span>
            </div>
          )}
        </div>

        <div style={styles.actions}>
          <button style={styles.actionButton} onClick={onPrint}>
            <Printer size={18} />
            Print
          </button>
          <button 
            style={{
              ...styles.actionButton,
              ...(isSaved && styles.savedButton)
            }}
            onClick={() => onToggleSave?.(recipe.id)}
          >
            <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
            {isSaved ? 'Saved' : 'Save'}
          </button>
          <button style={styles.actionButton} onClick={onShare}>
            <Share2 size={18} />
            Share
          </button>
        </div>
      </div>
      
      {recipe.image && (
        <img 
          src={recipe.image} 
          alt={recipe.name}
          style={styles.heroImage}
        />
      )}
    </div>
  );

  // Render ingredients section
  const renderIngredients = () => (
    <div style={styles.section}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>Ingredients</h2>
        <div style={styles.servingsControls}>
          <span style={styles.servingsLabel}>Servings:</span>
          <button 
            style={styles.servingsButton}
            onClick={() => setServings(Math.max(1, servings - 1))}
            disabled={servings <= 1}
          >
            <Minus size={16} />
          </button>
          <span style={styles.servingsCount}>{servings}</span>
          <button 
            style={styles.servingsButton}
            onClick={() => setServings(servings + 1)}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Ingredient match status */}
      {userIngredients.length > 0 && (
        <div style={styles.matchStatus}>
          <div style={styles.matchProgress}>
            <div style={styles.progressBar}>
              <div 
                style={{
                  ...styles.progressFill,
                  width: `${matchPercentage}%`
                }}
              />
            </div>
            <span style={styles.matchText}>
              {matchPercentage}% match ({ingredientStats.matched}/{ingredientStats.total} ingredients)
            </span>
          </div>
        </div>
      )}

      <div style={styles.ingredientsGrid}>
        {recipe.ingredients.map((ingredient, index) => {
          const hasIngredient = userIngredients.includes(ingredient.toLowerCase());
          return (
            <div 
              key={index} 
              style={{
                ...styles.ingredientItem,
                ...(hasIngredient && styles.ingredientMatched)
              }}
            >
              <div style={styles.ingredientContent}>
                <span style={styles.ingredientText}>{ingredient}</span>
                {userIngredients.length > 0 && (
                  <span style={styles.ingredientStatus}>
                    {hasIngredient ? '✓' : '✗'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Missing ingredients warning */}
      {ingredientStats.missing.length > 0 && userIngredients.length > 0 && (
        <div style={styles.missingSection}>
          <div style={styles.missingHeader}>
            <AlertCircle size={18} />
            <span>Missing {ingredientStats.missing.length} ingredients</span>
          </div>
          <div style={styles.missingList}>
            {ingredientStats.missing.map((ingredient, index) => (
              <span key={index} style={styles.missingItem}>{ingredient}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Render instructions section
  const renderInstructions = () => (
    <div style={styles.section}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>Instructions</h2>
        {recipe.cookingTime > 0 && (
          <button 
            style={{
              ...styles.timerButton,
              ...(timerActive && styles.timerActive)
            }}
            onClick={startCookingTimer}
          >
            <Timer size={18} />
            {timerActive ? `Stop Timer (${formatTime(cookingTimer)})` : `Start ${recipe.cookingTime}min Timer`}
          </button>
        )}
      </div>

      <ol style={styles.instructionsList}>
        {recipe.instructions.map((step, index) => (
          <li key={index} style={styles.instructionStep}>
            <div style={styles.stepNumber}>{index + 1}</div>
            <div style={styles.stepContent}>{step}</div>
          </li>
        ))}
      </ol>
    </div>
  );

  // Render nutrition section
  const renderNutrition = () => (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Nutrition Facts</h2>
      {scaledNutrition ? (
        <NutritionInfo 
          nutrition={scaledNutrition} 
          servingSize={servings}
          variant="full"
          showDailyValues={true}
        />
      ) : (
        <p style={styles.noData}>Nutrition information not available</p>
      )}
    </div>
  );

  // Render tips section
  const renderTips = () => (
    recipe.tips && recipe.tips.length > 0 && (
      <div style={styles.tipsSection}>
        <h3 style={styles.tipsTitle}>
          <TrendingUp size={20} />
          Chef's Tips
        </h3>
        <ul style={styles.tipsList}>
          {recipe.tips.map((tip, index) => (
            <li key={index} style={styles.tipItem}>{tip}</li>
          ))}
        </ul>
      </div>
    )
  );

  return (
    <div style={{ ...styles.container, ...className }}>
      {renderHeader()}
      
      <div style={styles.tabs}>
        {['ingredients', 'instructions', 'nutrition'].map(tab => (
          <button
            key={tab}
            style={{
              ...styles.tab,
              ...(activeTab === tab && styles.activeTab)
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div style={styles.content}>
        {activeTab === 'ingredients' && renderIngredients()}
        {activeTab === 'instructions' && renderInstructions()}
        {activeTab === 'nutrition' && renderNutrition()}
      </div>

      {renderTips()}

      {/* Rating Section */}
      <div style={styles.ratingSection}>
        <h3 style={styles.ratingTitle}>Rate this recipe</h3>
        <RatingStars interactive={true} size={32} />
        <p style={styles.ratingHint}>Share your experience with this recipe</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  header: {
    position: 'relative',
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: '2rem',
    padding: '2rem',
    background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--gray-50) 100%)'
  },
  headerContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  recipeMeta: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  dietaryTag: {
    background: 'rgba(255,255,255,0.8)',
    padding: '0.4rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    textTransform: 'capitalize',
    backdropFilter: 'blur(10px)'
  },
  cuisine: {
    background: 'var(--primary)',
    color: 'white',
    padding: '0.4rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    textTransform: 'capitalize'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    margin: '0',
    lineHeight: '1.2',
    color: 'var(--gray-900)'
  },
  stats: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center'
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.9rem',
    color: 'var(--gray-700)'
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap'
  },
  actionButton: {
    background: 'white',
    border: '1px solid var(--gray-300)',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'var(--gray-50)',
      transform: 'translateY(-1px)'
    }
  },
  savedButton: {
    background: 'var(--primary)',
    color: 'white',
    borderColor: 'var(--primary)'
  },
  heroImage: {
    width: '100%',
    height: '250px',
    objectFit: 'cover',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid var(--gray-200)',
    background: 'var(--gray-50)'
  },
  tab: {
    flex: 1,
    padding: '1rem 1.5rem',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: 'var(--gray-600)',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'var(--gray-100)'
    }
  },
  activeTab: {
    color: 'var(--primary)',
    borderBottom: '2px solid var(--primary)',
    background: 'white'
  },
  content: {
    padding: '2rem'
  },
  section: {
    marginBottom: '2rem'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  sectionTitle: {
    margin: '0',
    fontSize: '1.5rem',
    fontWeight: '600',
    color: 'var(--gray-900)'
  },
  servingsControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  servingsLabel: {
    fontSize: '0.9rem',
    color: 'var(--gray-600)'
  },
  servingsButton: {
    background: 'var(--gray-100)',
    border: 'none',
    borderRadius: '6px',
    width: '32px',
    height: '32px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'var(--gray-200)'
    },
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed'
    }
  },
  servingsCount: {
    fontWeight: '600',
    minWidth: '30px',
    textAlign: 'center'
  },
  matchStatus: {
    marginBottom: '1.5rem'
  },
  matchProgress: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  progressBar: {
    flex: 1,
    height: '8px',
    background: 'var(--gray-200)',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: 'var(--success)',
    transition: 'width 0.3s ease'
  },
  matchText: {
    fontSize: '0.9rem',
    color: 'var(--gray-600)',
    minWidth: '200px'
  },
  ingredientsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '0.75rem'
  },
  ingredientItem: {
    padding: '0.75rem',
    border: '1px solid var(--gray-200)',
    borderRadius: '8px',
    transition: 'all 0.2s ease'
  },
  ingredientMatched: {
    background: 'var(--success-light)',
    borderColor: 'var(--success)'
  },
  ingredientContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  ingredientText: {
    fontSize: '0.95rem'
  },
  ingredientStatus: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
    color: 'var(--success)'
  },
  missingSection: {
    background: 'var(--warning-light)',
    border: '1px solid var(--warning)',
    borderRadius: '8px',
    padding: '1rem',
    marginTop: '1rem'
  },
  missingHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.75rem',
    fontWeight: '500',
    color: 'var(--warning-dark)'
  },
  missingList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  missingItem: {
    background: 'var(--warning)',
    color: 'white',
    padding: '0.4rem 0.8rem',
    borderRadius: '16px',
    fontSize: '0.8rem'
  },
  timerButton: {
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  },
  timerActive: {
    background: 'var(--error)'
  },
  instructionsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    counterReset: 'step-counter'
  },
  instructionStep: {
    display: 'flex',
    gap: '1rem',
    padding: '1.5rem 0',
    borderBottom: '1px solid var(--gray-100)',
    ':last-child': {
      borderBottom: 'none'
    }
  },
  stepNumber: {
    background: 'var(--primary)',
    color: 'white',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    flexShrink: 0
  },
  stepContent: {
    flex: 1,
    fontSize: '1rem',
    lineHeight: '1.6'
  },
  noData: {
    textAlign: 'center',
    color: 'var(--gray-500)',
    fontStyle: 'italic',
    padding: '2rem'
  },
  tipsSection: {
    background: 'var(--success-light)',
    border: '1px solid var(--success)',
    borderRadius: '12px',
    padding: '1.5rem',
    margin: '0 2rem 2rem'
  },
  tipsTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    margin: '0 0 1rem',
    fontSize: '1.2rem',
    fontWeight: '600',
    color: 'var(--success-dark)'
  },
  tipsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  tipItem: {
    padding: '0.5rem 0',
    borderBottom: '1px solid rgba(0,0,0,0.1)',
    ':last-child': {
      borderBottom: 'none'
    }
  },
  ratingSection: {
    background: 'var(--gray-50)',
    padding: '2rem',
    textAlign: 'center',
    borderTop: '1px solid var(--gray-200)'
  },
  ratingTitle: {
    margin: '0 0 1rem',
    fontSize: '1.2rem',
    fontWeight: '600'
  },
  ratingHint: {
    margin: '1rem 0 0',
    fontSize: '0.9rem',
    color: 'var(--gray-600)'
  }
};

export default RecipeDetail;