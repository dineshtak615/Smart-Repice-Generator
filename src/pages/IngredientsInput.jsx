// src/pages/IngredientsInput.jsx
import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Type, 
  ArrowRight, 
  Loader2, 
  Sparkles, 
  ChefHat, 
  Search,
  Plus,
  X,
  BookOpen
} from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import SmartTextParser from '../components/SmartTextParser';

const IngredientsInput = ({ onIngredientsSubmit, navigateTo }) => {
  const [method, setMethod] = useState('photo'); // 'photo' or 'text'
  const [ingredients, setIngredients] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const [customIngredient, setCustomIngredient] = useState('');

  // Sample ingredients for quick selection
  const commonIngredients = [
    'tomato', 'onion', 'garlic', 'carrot', 'bell pepper', 'broccoli',
    'chicken', 'beef', 'eggs', 'rice', 'pasta', 'cheese', 'milk',
    'butter', 'oil', 'salt', 'pepper', 'flour', 'sugar'
  ];

  useEffect(() => {
    // Hide tips after 5 seconds
    const timer = setTimeout(() => {
      setShowTips(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleIngredients = (detected) => {
    console.log('Ingredients detected:', detected);
    setIngredients(detected);
  };

  const handleSubmit = () => {
    if (ingredients.length === 0) {
      alert('Please add some ingredients first!');
      return;
    }
    
    console.log('Submitting ingredients:', ingredients);
    setIsProcessing(true);
    
    // Simulate processing time
    setTimeout(() => {
      console.log('Calling onIngredientsSubmit with:', ingredients);
      onIngredientsSubmit(ingredients);
      setIsProcessing(false);
    }, 1200);
  };

  const addCommonIngredient = (ingredient) => {
    if (!ingredients.includes(ingredient)) {
      const updated = [...ingredients, ingredient];
      setIngredients(updated);
    }
  };

  const removeIngredient = (index) => {
    const updated = ingredients.filter((_, i) => i !== index);
    setIngredients(updated);
  };

  const addCustomIngredient = () => {
    if (customIngredient.trim() && !ingredients.includes(customIngredient.toLowerCase())) {
      const updated = [...ingredients, customIngredient.toLowerCase().trim()];
      setIngredients(updated);
      setCustomIngredient('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addCustomIngredient();
    }
  };

  const clearAllIngredients = () => {
    setIngredients([]);
  };

  const getIngredientCountText = () => {
    const count = ingredients.length;
    if (count === 0) return 'No ingredients added';
    if (count === 1) return '1 ingredient';
    return `${count} ingredients`;
  };

  return (
    <main style={styles.main}>
      <div style={styles.content}>
        {/* Header Section */}
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.titleSection}>
              <ChefHat size={48} color="var(--primary)" style={styles.chefIcon} />
              <div>
                <h1 style={styles.title}>What's Cooking Today?</h1>
                <p style={styles.subtitle}>
                  Tell us what ingredients you have, and we'll find the perfect recipes
                </p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div style={styles.stats}>
              <div style={styles.stat}>
                <span style={styles.statNumber}>1000+</span>
                <span style={styles.statLabel}>Recipes</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statNumber}>50+</span>
                <span style={styles.statLabel}>Cuisines</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statNumber}>95%</span>
                <span style={styles.statLabel}>Match Rate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Method Selection */}
        <div style={styles.methodSection}>
          <h2 style={styles.sectionTitle}>Choose Your Input Method</h2>
          
          <div style={styles.toggleContainer}>
            <button
              className="toggle-btn"
              style={{ 
                ...styles.toggleBtn, 
                ...(method === 'photo' && styles.toggleBtnActive),
                ...styles.toggleBtnPhoto
              }}
              onClick={() => setMethod('photo')}
            >
              <div style={styles.toggleIcon}>
                <Camera size={24} />
              </div>
              <div style={styles.toggleContent}>
                <span style={styles.toggleTitle}>Take a Photo</span>
                <span style={styles.toggleDescription}>
                  Snap a picture of your ingredients
                </span>
              </div>
              <div style={styles.toggleBadge}>
                <Sparkles size={16} />
                AI Powered
              </div>
            </button>

            <button
              className="toggle-btn"
              style={{ 
                ...styles.toggleBtn, 
                ...(method === 'text' && styles.toggleBtnActive),
                ...styles.toggleBtnText
              }}
              onClick={() => setMethod('text')}
            >
              <div style={styles.toggleIcon}>
                <Type size={24} />
              </div>
              <div style={styles.toggleContent}>
                <span style={styles.toggleTitle}>Type or Paste</span>
                <span style={styles.toggleDescription}>
                  Enter ingredients manually
                </span>
              </div>
              <div style={styles.toggleBadge}>
                <BookOpen size={16} />
                Smart Parser
              </div>
            </button>
          </div>
        </div>

        {/* Input Area */}
        <div style={styles.inputArea}>
          {method === 'photo' ? (
            <ImageUploader onIngredientsDetected={handleIngredients} />
          ) : (
            <SmartTextParser onIngredientsDetected={handleIngredients} />
          )}
        </div>

        {/* Quick Add Section */}
        <div style={styles.quickAddSection}>
          <div style={styles.quickAddHeader}>
            <h3 style={styles.quickAddTitle}>Quick Add Common Ingredients</h3>
            <span style={styles.quickAddHint}>
              Click to add ingredients instantly
            </span>
          </div>
          <div style={styles.commonIngredients}>
            {commonIngredients.map((ingredient, index) => (
              <button
                key={index}
                className="common-ingredient-btn"
                style={{
                  ...styles.commonIngredientBtn,
                  ...(ingredients.includes(ingredient) && styles.commonIngredientActive)
                }}
                onClick={() => addCommonIngredient(ingredient)}
                disabled={ingredients.includes(ingredient)}
              >
                {ingredient}
                {ingredients.includes(ingredient) && (
                  <div style={styles.checkmark}>✓</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Ingredient Input */}
        <div style={styles.customSection}>
          <div style={styles.customInputContainer}>
            <input
              type="text"
              className="custom-input"
              placeholder="Add a custom ingredient..."
              value={customIngredient}
              onChange={(e) => setCustomIngredient(e.target.value)}
              onKeyPress={handleKeyPress}
              style={styles.customInput}
            />
            <button 
              className="add-custom-btn"
              style={styles.addCustomBtn}
              onClick={addCustomIngredient}
              disabled={!customIngredient.trim()}
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Detected Ingredients Panel */}
        {ingredients.length > 0 && (
          <div style={styles.detectedPanel}>
            <div style={styles.panelHeader}>
              <div style={styles.panelTitle}>
                <Search size={20} color="var(--success)" />
                <div>
                  <h3 style={styles.panelTitleText}>Ready to Cook!</h3>
                  <p style={styles.panelSubtitle}>
                    {getIngredientCountText()} • {Math.min(ingredients.length * 15, 100)}+ recipes possible
                  </p>
                </div>
              </div>
              
              <button 
                className="clear-all-btn"
                style={styles.clearAllBtn}
                onClick={clearAllIngredients}
              >
                <X size={16} />
                Clear All
              </button>
            </div>

            <div style={styles.ingredientsDisplay}>
              {ingredients.map((ingredient, index) => (
                <div key={index} style={styles.ingredientChip}>
                  <span style={styles.ingredientText}>{ingredient}</span>
                  <button 
                    className="remove-chip-btn"
                    style={styles.removeChipBtn}
                    onClick={() => removeIngredient(index)}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div style={styles.actionSection}>
              <button 
                className="submit-btn"
                style={{
                  ...styles.submitBtn,
                  ...(isProcessing && styles.submitBtnLoading)
                }}
                onClick={handleSubmit}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={20} style={styles.spinner} />
                    Finding Recipes...
                  </>
                ) : (
                  <>
                    <ArrowRight size={20} />
                    Find Matching Recipes
                  </>
                )}
              </button>
              
              {!isProcessing && (
                <div style={styles.recipeEstimate}>
                  <Sparkles size={16} />
                  Estimated: {Math.min(ingredients.length * 12, 85)} recipe matches
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tips Section */}
        {showTips && ingredients.length === 0 && (
          <div style={styles.tipsSection}>
            <div style={styles.tipsContent}>
              <Sparkles size={20} color="var(--warning)" />
              <div>
                <strong>Pro Tip:</strong> Add 5+ ingredients for better recipe matches
              </div>
            </div>
            <button 
              className="close-tips-btn"
              style={styles.closeTipsBtn}
              onClick={() => setShowTips(false)}
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Debug Info */}
      <div style={styles.debugInfo}>
        <p><strong>Debug Info:</strong></p>
        <p>Ingredients: {ingredients.join(', ') || 'None'}</p>
        <p>Processing: {isProcessing ? 'Yes' : 'No'}</p>
        <p>Method: {method}</p>
      </div>

      {/* Add CSS styles directly to the component */}
      <style>{`
        .toggle-btn:hover {
          transform: translateY(-2px);
          border-color: var(--primary) !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important;
        }
        
        .common-ingredient-btn:hover:not(:disabled) {
          background: var(--primary-light) !important;
          border-color: var(--primary) !important;
          transform: translateY(-1px) !important;
        }
        
        .add-custom-btn:hover:not(:disabled) {
          background: var(--primary-dark) !important;
          transform: scale(1.05) !important;
        }
        
        .clear-all-btn:hover {
          background: white !important;
          transform: translateY(-1px) !important;
        }
        
        .remove-chip-btn:hover {
          background: var(--error-light) !important;
          color: var(--error) !important;
        }
        
        .submit-btn:hover:not(:disabled) {
          background: var(--success-dark) !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2) !important;
        }
        
        .close-tips-btn:hover {
          background: rgba(0,0,0,0.1) !important;
        }
        
        .custom-input:focus {
          outline: none;
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1) !important;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
};

const styles = {
  main: { 
    flex: 1, 
    padding: '1rem',
    background: 'linear-gradient(135deg, var(--gray-50) 0%, white 100%)',
    minHeight: '100vh'
  },
  content: { 
    maxWidth: '1000px', 
    margin: '0 auto',
    padding: '0 1rem'
  },
  header: {
    marginBottom: '3rem',
    textAlign: 'center'
  },
  headerContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem'
  },
  titleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  chefIcon: {
    filter: 'drop-shadow(0 4px 8px rgba(74, 144, 226, 0.3))'
  },
  title: {
    fontSize: '3rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '0 0 0.5rem',
    lineHeight: '1.1'
  },
  subtitle: {
    fontSize: '1.2rem',
    color: 'var(--gray-600)',
    margin: 0,
    fontWeight: '400'
  },
  stats: {
    display: 'flex',
    gap: '2rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1rem 1.5rem',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    minWidth: '100px'
  },
  statNumber: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--primary)'
  },
  statLabel: {
    fontSize: '0.9rem',
    color: 'var(--gray-600)',
    marginTop: '0.25rem'
  },
  methodSection: {
    marginBottom: '2rem'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    textAlign: 'center',
    margin: '0 0 1.5rem',
    color: 'var(--gray-800)'
  },
  toggleContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1rem',
    maxWidth: '700px',
    margin: '0 auto'
  },
  toggleBtn: {
    padding: '1.5rem',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: 'var(--gray-200)',
    borderRadius: '16px',
    background: 'white',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    transition: 'all 0.3s ease',
    textAlign: 'left',
    position: 'relative'
  },
  toggleBtnActive: {
    borderColor: 'var(--primary)',
    background: 'var(--primary-light)',
    boxShadow: '0 8px 24px rgba(74, 144, 226, 0.15)'
  },
  toggleBtnPhoto: {
    borderLeftWidth: '4px',
    borderLeftStyle: 'solid',
    borderLeftColor: 'var(--success)'
  },
  toggleBtnText: {
    borderLeftWidth: '4px',
    borderLeftStyle: 'solid',
    borderLeftColor: 'var(--warning)'
  },
  toggleIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'var(--gray-100)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  toggleContent: {
    flex: 1
  },
  toggleTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: 'var(--gray-900)',
    display: 'block',
    marginBottom: '0.25rem'
  },
  toggleDescription: {
    fontSize: '0.9rem',
    color: 'var(--gray-600)',
    display: 'block'
  },
  toggleBadge: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'var(--primary)',
    color: 'white',
    padding: '0.4rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem'
  },
  inputArea: {
    minHeight: '400px',
    marginBottom: '2rem'
  },
  quickAddSection: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    marginBottom: '1.5rem'
  },
  quickAddHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  quickAddTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    margin: 0,
    color: 'var(--gray-800)'
  },
  quickAddHint: {
    fontSize: '0.85rem',
    color: 'var(--gray-500)'
  },
  commonIngredients: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  commonIngredientBtn: {
    padding: '0.6rem 1rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--gray-300)',
    background: 'var(--gray-50)',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s ease',
    position: 'relative'
  },
  commonIngredientActive: {
    background: 'var(--primary)',
    color: 'white',
    borderColor: 'var(--primary)'
  },
  checkmark: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    background: 'var(--success)',
    color: 'white',
    borderRadius: '50%',
    width: '16px',
    height: '16px',
    fontSize: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  customSection: {
    marginBottom: '2rem'
  },
  customInputContainer: {
    display: 'flex',
    gap: '0.5rem',
    maxWidth: '400px',
    margin: '0 auto'
  },
  customInput: {
    flex: 1,
    padding: '0.75rem 1rem',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: 'var(--gray-300)',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'all 0.2s ease'
  },
  addCustomBtn: {
    padding: '0.75rem',
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  },
  detectedPanel: {
    background: 'linear-gradient(135deg, var(--success-light) 0%, var(--primary-light) 100%)',
    padding: '2rem',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--success)',
    marginTop: '2rem'
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  panelTitle: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem'
  },
  panelTitleText: {
    margin: '0 0 0.25rem',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--success-dark)'
  },
  panelSubtitle: {
    margin: 0,
    fontSize: '1rem',
    color: 'var(--gray-700)'
  },
  clearAllBtn: {
    background: 'rgba(255,255,255,0.8)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--gray-300)',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.9rem',
    transition: 'all 0.2s ease'
  },
  ingredientsDisplay: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    marginBottom: '2rem'
  },
  ingredientChip: {
    background: 'white',
    padding: '0.75rem 1rem',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'all 0.2s ease'
  },
  ingredientText: {
    fontSize: '0.9rem',
    fontWeight: '500',
    textTransform: 'capitalize'
  },
  removeChipBtn: {
    background: 'var(--gray-200)',
    border: 'none',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.7rem',
    transition: 'all 0.2s ease'
  },
  actionSection: {
    textAlign: 'center'
  },
  submitBtn: {
    width: '100%',
    maxWidth: '400px',
    padding: '1.25rem 2rem',
    background: 'var(--success)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    fontSize: '1.1rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
  },
  submitBtnLoading: {
    opacity: 0.7,
    cursor: 'not-allowed'
  },
  spinner: {
    animation: 'spin 1s linear infinite'
  },
  recipeEstimate: {
    marginTop: '1rem',
    fontSize: '0.9rem',
    color: 'var(--gray-700)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  tipsSection: {
    background: 'var(--warning-light)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--warning)',
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '2rem'
  },
  tipsContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.9rem',
    color: 'var(--warning-dark)'
  },
  closeTipsBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--warning-dark)',
    padding: '0.25rem',
    borderRadius: '4px'
  },
  debugInfo: {
    marginTop: '2rem',
    padding: '1rem',
    background: 'var(--gray-100)',
    borderRadius: '8px',
    fontSize: '0.8rem',
    color: 'var(--gray-600)',
    maxWidth: '1000px',
    margin: '2rem auto 0'
  }
};

export default IngredientsInput;