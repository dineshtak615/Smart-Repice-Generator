// src/components/RecipeModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Clock, Users, Printer, Bookmark, Share2, ChefHat, 
  ShoppingCart, Plus, Minus, Heart, Star, Timer, 
  TrendingUp, Leaf, Wheat, AlertCircle,
  MessageCircle
} from 'lucide-react';
import NutritionInfo from './NutritionInfo';
import RatingStars from './RatingStars';

const RecipeModal = ({ 
  isOpen, 
  onClose, 
  recipe, 
  userIngredients = [],
  isSaved = false, 
  onToggleSave,
  onAddToShoppingList,
  showNutrition = true,
  showReviews = true
}) => {
  const [servings, setServings] = useState(recipe.servings || 1);
  const [activeTab, setActiveTab] = useState('ingredients');
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [cookingTimer, setCookingTimer] = useState(null);
  const [timerActive, setTimerActive] = useState(false);
  const modalRef = useRef(null);

  // Reset servings when recipe changes
  useEffect(() => {
    setServings(recipe.servings || 1);
  }, [recipe]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const scaledIngredients = recipe.ingredients.map(ingredient => {
    // Simple scaling logic - in a real app, you'd want more sophisticated parsing
    return ingredient;
  });

  const scaledNutrition = recipe.nutrition ? {
    calories: Math.round(recipe.nutrition.calories * (servings / recipe.servings)),
    protein: Math.round(recipe.nutrition.protein * (servings / recipe.servings)),
    carbs: Math.round(recipe.nutrition.carbs * (servings / recipe.servings)),
    fat: Math.round(recipe.nutrition.fat * (servings / recipe.servings)),
    fiber: recipe.nutrition.fiber ? Math.round(recipe.nutrition.fiber * (servings / recipe.servings)) : 0,
    sugar: recipe.nutrition.sugar ? Math.round(recipe.nutrition.sugar * (servings / recipe.servings)) : 0,
    sodium: recipe.nutrition.sodium ? Math.round(recipe.nutrition.sodium * (servings / recipe.servings)) : 0
  } : null;

  const missingIngredients = recipe.ingredients.filter(
    ing => !userIngredients.includes(ing.toLowerCase())
  );

  const hasUserIngredients = userIngredients.length > 0;

  const startCookingTimer = () => {
    if (timerActive) {
      setTimerActive(false);
      setCookingTimer(null);
    } else {
      setTimerActive(true);
      setCookingTimer(recipe.cookingTime * 60); // Convert to seconds
    }
  };

  // Timer countdown effect
  useEffect(() => {
    let interval;
    if (timerActive && cookingTimer > 0) {
      interval = setInterval(() => {
        setCookingTimer(prev => prev - 1);
      }, 1000);
    } else if (cookingTimer === 0) {
      setTimerActive(false);
      // You could add a notification here
    }
    return () => clearInterval(interval);
  }, [timerActive, cookingTimer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
  };

  const handleShare = async (platform) => {
    const shareUrl = window.location.href;
    const shareText = `Check out this recipe: ${recipe.name}`;

    switch (platform) {
      case 'copy':
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
        break;
      default:
        break;
    }
    setShowShareOptions(false);
  };

  const getDietaryIcon = (dietary) => {
    const icons = {
      vegetarian: <Leaf size={16} />,
      vegan: <Leaf size={16} />,
      'gluten-free': <Wheat size={16} />,
    };
    return icons[dietary] || null;
  };

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

      <ul style={styles.ingredientsList}>
        {scaledIngredients.map((ingredient, index) => {
          const hasIngredient = userIngredients.includes(ingredient.toLowerCase());
          return (
            <li 
              key={index} 
              style={{
                ...styles.ingredientItem,
                color: hasIngredient ? 'var(--success)' : 'var(--gray-700)'
              }}
            >
              <div style={styles.ingredientContent}>
                <span style={styles.ingredientText}>{ingredient}</span>
                {hasUserIngredients && (
                  <span style={styles.ingredientStatus}>
                    {hasIngredient ? '✓' : '✗'}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {missingIngredients.length > 0 && hasUserIngredients && (
        <div style={styles.missingSection}>
          <div style={styles.missingHeader}>
            <AlertCircle size={18} />
            <span>Missing {missingIngredients.length} ingredients</span>
          </div>
          {onAddToShoppingList && (
            <button 
              style={styles.shoppingListButton}
              onClick={() => onAddToShoppingList(missingIngredients)}
            >
              <ShoppingCart size={16} />
              Add to Shopping List
            </button>
          )}
        </div>
      )}
    </div>
  );

  const renderInstructions = () => (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Instructions</h2>
      <ol style={styles.instructionsList}>
        {recipe.instructions.map((step, index) => (
          <li key={index} style={styles.instructionStep}>
            <div style={styles.stepNumber}>{index + 1}</div>
            <div style={styles.stepContent}>{step}</div>
          </li>
        ))}
      </ol>
      
      {recipe.cookingTime > 0 && (
        <div style={styles.timerSection}>
          <button 
            style={{
              ...styles.timerButton,
              background: timerActive ? 'var(--error)' : 'var(--primary)'
            }}
            onClick={startCookingTimer}
          >
            <Timer size={18} />
            {timerActive ? `Stop Timer (${formatTime(cookingTimer)})` : `Start ${recipe.cookingTime}min Timer`}
          </button>
        </div>
      )}
    </div>
  );

  const renderNutrition = () => (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Nutrition Facts</h2>
      {scaledNutrition ? (
        <NutritionInfo 
          nutrition={scaledNutrition} 
          servingSize={servings}
          variant="bars"
          showDailyValues={true}
        />
      ) : (
        <p style={styles.noNutrition}>Nutrition information not available</p>
      )}
    </div>
  );

  const renderReviews = () => (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Reviews & Ratings</h2>
      <div style={styles.ratingOverview}>
        <div style={styles.ratingScore}>
          <span style={styles.ratingNumber}>4.5</span>
          <RatingStars rating={4.5} size={24} />
          <span style={styles.ratingCount}>(128 reviews)</span>
        </div>
      </div>
      <div style={styles.addReview}>
        <h3>Rate this recipe</h3>
        <RatingStars interactive={true} size={32} />
        <button style={styles.reviewButton}>
          <MessageCircle size={16} />
          Write a Review
        </button>
      </div>
    </div>
  );

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div 
        style={{
          ...styles.modal,
          ...(isPrinting && styles.printModal)
        }} 
        onClick={e => e.stopPropagation()}
        ref={modalRef}
      >
        {/* Close Button */}
        <button style={styles.closeButton} onClick={onClose}>
          <X size={24} />
        </button>

        {/* Header with Image */}
        <div style={styles.header}>
          <img 
            src={recipe.image} 
            alt={recipe.name}
            style={styles.heroImage}
          />
          <div style={styles.headerOverlay}>
            <div style={styles.headerContent}>
              <div style={styles.recipeMeta}>
                {recipe.dietary?.map(diet => (
                  <div key={diet} style={styles.dietaryTag}>
                    {getDietaryIcon(diet)}
                    <span>{diet}</span>
                  </div>
                ))}
              </div>
              
              <h1 style={styles.title}>{recipe.name}</h1>
              <p style={styles.cuisine}>{recipe.cuisine} • {recipe.difficulty}</p>

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
              </div>

              <div style={styles.actions}>
                <button style={styles.actionButton} onClick={handlePrint}>
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
                  <Bookmark 
                    size={18} 
                    fill={isSaved ? 'currentColor' : 'none'} 
                  />
                  {isSaved ? 'Saved' : 'Save'}
                </button>
                <div style={styles.shareContainer}>
                  <button 
                    style={styles.actionButton}
                    onClick={() => setShowShareOptions(!showShareOptions)}
                  >
                    <Share2 size={18} />
                    Share
                  </button>
                  {showShareOptions && (
                    <div style={styles.shareDropdown}>
                      <button onClick={() => handleShare('copy')}>Copy Link</button>
                      <button onClick={() => handleShare('twitter')}>Twitter</button>
                      <button onClick={() => handleShare('facebook')}>Facebook</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={styles.tabs}>
          {['ingredients', 'instructions', 'nutrition', 'reviews'].map(tab => (
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

        {/* Content Area */}
        <div style={styles.body}>
          {activeTab === 'ingredients' && renderIngredients()}
          {activeTab === 'instructions' && renderInstructions()}
          {activeTab === 'nutrition' && renderNutrition()}
          {activeTab === 'reviews' && renderReviews()}
        </div>

        {/* Tips Section */}
        {recipe.tips && recipe.tips.length > 0 && (
          <div style={styles.tipsSection}>
            <h3 style={styles.tipsTitle}>Chef's Tips</h3>
            <ul style={styles.tipsList}>
              {recipe.tips.map((tip, index) => (
                <li key={index} style={styles.tipItem}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.8)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    backdropFilter: 'blur(4px)'
  },
  modal: {
    background: 'white',
    borderRadius: '20px',
    maxWidth: '900px',
    width: '100%',
    maxHeight: '95vh',
    overflowY: 'auto',
    position: 'relative',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  printModal: {
    maxWidth: 'none',
    maxHeight: 'none',
    borderRadius: 0,
    boxShadow: 'none'
  },
  closeButton: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'rgba(255,255,255,0.9)',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    backdropFilter: 'blur(10px)',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'white',
      transform: 'scale(1.1)'
    }
  },
  header: {
    position: 'relative',
    height: '300px'
  },
  heroImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '20px 20px 0 0'
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7))',
    borderRadius: '20px 20px 0 0',
    display: 'flex',
    alignItems: 'flex-end'
  },
  headerContent: {
    padding: '2rem',
    color: 'white',
    width: '100%'
  },
  recipeMeta: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.5rem',
    flexWrap: 'wrap'
  },
  dietaryTag: {
    background: 'rgba(255,255,255,0.2)',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '0.8rem',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backdropFilter: 'blur(10px)'
  },
  title: {
    margin: '0 0 0.5rem',
    fontSize: '2rem',
    fontWeight: '700',
    lineHeight: '1.2'
  },
  cuisine: {
    margin: '0 0 1rem',
    fontSize: '1.1rem',
    opacity: 0.9
  },
  stats: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '1.5rem'
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.9rem'
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap'
  },
  actionButton: {
    background: 'rgba(255,255,255,0.9)',
    border: 'none',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(10px)',
    ':hover': {
      background: 'white',
      transform: 'translateY(-2px)'
    }
  },
  savedButton: {
    background: 'var(--primary)',
    color: 'white'
  },
  shareContainer: {
    position: 'relative'
  },
  shareDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    background: 'white',
    border: '1px solid var(--gray-200)',
    borderRadius: '8px',
    padding: '0.5rem',
    marginTop: '0.25rem',
    minWidth: '120px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    zIndex: 20
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
  body: {
    padding: '2rem'
  },
  section: {
    marginBottom: '2rem'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
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
  ingredientsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  ingredientItem: {
    padding: '0.75rem 0',
    borderBottom: '1px solid var(--gray-100)',
    ':last-child': {
      borderBottom: 'none'
    }
  },
  ingredientContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  ingredientText: {
    fontSize: '1rem'
  },
  ingredientStatus: {
    fontWeight: 'bold',
    fontSize: '1.1rem'
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
  shoppingListButton: {
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'var(--primary-dark)'
    }
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
  timerSection: {
    marginTop: '1.5rem',
    textAlign: 'center'
  },
  timerButton: {
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
    }
  },
  noNutrition: {
    textAlign: 'center',
    color: 'var(--gray-500)',
    fontStyle: 'italic',
    padding: '2rem'
  },
  ratingOverview: {
    textAlign: 'center',
    marginBottom: '2rem'
  },
  ratingScore: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem'
  },
  ratingNumber: {
    fontSize: '3rem',
    fontWeight: '700',
    color: 'var(--gray-900)'
  },
  ratingCount: {
    color: 'var(--gray-500)'
  },
  addReview: {
    background: 'var(--gray-50)',
    padding: '1.5rem',
    borderRadius: '12px',
    textAlign: 'center'
  },
  reviewButton: {
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '1rem',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'var(--primary-dark)'
    }
  },
  tipsSection: {
    background: 'var(--success-light)',
    border: '1px solid var(--success)',
    borderRadius: '12px',
    padding: '1.5rem',
    margin: '2rem'
  },
  tipsTitle: {
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
  }
};

// Add CSS for print media
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @media print {
    .recipe-modal * {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .recipe-modal {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: auto;
    }
  }
`, styleSheet.cssRules.length);

export default RecipeModal;