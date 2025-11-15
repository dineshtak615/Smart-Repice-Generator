// src/components/SmartTextParser.jsx
import React, { useState, useRef, useCallback } from 'react';
import { 
  Type, 
  Plus, 
  X, 
  Wand2, 
  Clipboard,
  ClipboardCheck,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { parseIngredients, parseIngredientsWithDetails, validateIngredient } from '../utils/ingredientParser';

const SmartTextParser = ({ onIngredientsDetected, className = '' }) => {
  const [text, setText] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [detailedIngredients, setDetailedIngredients] = useState([]);
  const [isParsing, setIsParsing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [showExamples, setShowExamples] = useState(false);
  const textareaRef = useRef(null);

  const exampleText = `2 cups all-purpose flour
1 large onion, chopped
3 cloves garlic, minced
2 tbsp olive oil
1 lb ground beef
1 can (14.5 oz) diced tomatoes
Salt and pepper to taste
1/2 cup grated parmesan cheese`;

  const handleParse = useCallback(async () => {
    if (!text.trim()) {
      setError('Please enter some ingredients to parse');
      return;
    }

    setIsParsing(true);
    setError(null);

    try {
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const parsed = parseIngredients(text);
      const detailed = parseIngredientsWithDetails(text);
      
      setIngredients(parsed);
      setDetailedIngredients(detailed);
      onIngredientsDetected(parsed);
      
      if (parsed.length === 0) {
        setError('No ingredients detected. Try using common food names.');
      }
    } catch (err) {
      console.error('Parsing error:', err);
      setError('Failed to parse ingredients. Please check your input.');
    } finally {
      setIsParsing(false);
    }
  }, [text, onIngredientsDetected]);

  const handleClear = () => {
    setText('');
    setIngredients([]);
    setDetailedIngredients([]);
    setError(null);
    onIngredientsDetected([]);
    textareaRef.current?.focus();
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
      setError(null);
    } catch (err) {
      setError('Unable to access clipboard. Please paste manually.');
    }
  };

  const handleCopyExample = () => {
    setText(exampleText);
    setError(null);
    textareaRef.current?.focus();
  };

  const handleCopyIngredients = async () => {
    const ingredientList = ingredients.join(', ');
    try {
      await navigator.clipboard.writeText(ingredientList);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const removeIngredient = (index) => {
    const updated = ingredients.filter((_, i) => i !== index);
    const updatedDetailed = detailedIngredients.filter((_, i) => i !== index);
    
    setIngredients(updated);
    setDetailedIngredients(updatedDetailed);
    onIngredientsDetected(updated);
  };

  const addCustomIngredient = () => {
    const customIngredient = prompt('Enter a custom ingredient:');
    if (customIngredient && validateIngredient(customIngredient)) {
      const updated = [...ingredients, customIngredient.toLowerCase()];
      setIngredients(updated);
      onIngredientsDetected(updated);
    } else if (customIngredient) {
      setError('Please enter a valid ingredient name');
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      vegetables: 'var(--success)',
      fruits: 'var(--warning)',
      proteins: 'var(--error)',
      grains: 'var(--info)',
      dairy: 'var(--primary)',
      herbs: 'var(--secondary)',
      other: 'var(--gray-600)'
    };
    return colors[category] || colors.other;
  };

  return (
    <div style={{ ...styles.container, ...className }}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <Wand2 size={24} color="var(--primary)" />
          <div>
            <h3 style={styles.title}>Smart Ingredient Parser</h3>
            <p style={styles.subtitle}>Paste your recipe or type ingredients to automatically detect them</p>
          </div>
        </div>
        
        <div style={styles.headerActions}>
          <button 
            style={styles.exampleButton}
            onClick={() => setShowExamples(!showExamples)}
          >
            <Sparkles size={16} />
            Examples
          </button>
        </div>
      </div>

      {/* Examples */}
      {showExamples && (
        <div style={styles.examplesSection}>
          <p style={styles.examplesText}>
            Try formats like:<br />
            "2 cups flour, 1 onion chopped, 3 eggs"<br />
            Or paste from any recipe website
          </p>
          <button 
            style={styles.exampleCopyButton}
            onClick={handleCopyExample}
          >
            Load Example
          </button>
        </div>
      )}

      {/* Text Input Area */}
      <div style={styles.inputSection}>
        <div style={styles.textareaContainer}>
          <textarea
            ref={textareaRef}
            style={styles.textarea}
            placeholder={`Paste your ingredient list here...\n\nExamples:\n• 2 cups flour\n• 1 onion, chopped\n• 3 large eggs\n• Salt and pepper to taste\n• 1/2 cup grated cheese`}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setError(null);
            }}
            rows={6}
          />
          
          <div style={styles.textareaActions}>
            <button 
              style={styles.pasteButton}
              onClick={handlePaste}
              title="Paste from clipboard"
            >
              <Clipboard size={16} />
              Paste
            </button>
            
            <div style={styles.charCount}>
              {text.length} characters
            </div>
          </div>
        </div>

        <div style={styles.actionButtons}>
          <button 
            style={{
              ...styles.parseButton,
              ...(isParsing && styles.parseButtonLoading)
            }}
            onClick={handleParse}
            disabled={isParsing || !text.trim()}
          >
            {isParsing ? (
              <>
                <div style={styles.spinner}></div>
                Parsing...
              </>
            ) : (
              <>
                <Type size={18} />
                Parse Ingredients
              </>
            )}
          </button>

          <button 
            style={styles.clearButton}
            onClick={handleClear}
            disabled={!text && ingredients.length === 0}
          >
            <RotateCcw size={18} />
            Clear
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div style={styles.errorBanner}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Results Section */}
      {ingredients.length > 0 && (
        <div style={styles.resultsSection}>
          <div style={styles.resultsHeader}>
            <div style={styles.resultsTitle}>
              <CheckCircle size={20} color="var(--success)" />
              <h4 style={styles.resultsTitleText}>
                Detected Ingredients ({ingredients.length})
              </h4>
            </div>
            
            <button 
              style={styles.copyButton}
              onClick={handleCopyIngredients}
              title="Copy ingredient list"
            >
              {copied ? <ClipboardCheck size={16} /> : <Clipboard size={16} />}
              {copied ? 'Copied!' : 'Copy List'}
            </button>
          </div>

          {/* Ingredients Grid */}
          <div style={styles.ingredientsGrid}>
            {detailedIngredients.map((ingredient, index) => (
              <div 
                key={index} 
                style={{
                  ...styles.ingredientCard,
                  borderLeft: `4px solid ${getCategoryColor(ingredient.category)}`
                }}
              >
                <div style={styles.ingredientHeader}>
                  <span style={styles.ingredientName}>{ingredient.name}</span>
                  <button 
                    style={styles.removeButton}
                    onClick={() => removeIngredient(index)}
                    title="Remove ingredient"
                  >
                    <X size={14} />
                  </button>
                </div>
                
                <div style={styles.ingredientMeta}>
                  <span 
                    style={{
                      ...styles.categoryTag,
                      background: getCategoryColor(ingredient.category)
                    }}
                  >
                    {ingredient.category}
                  </span>
                  {ingredient.isCommon && (
                    <span style={styles.commonBadge}>Common</span>
                  )}
                </div>
                
                {ingredient.alternatives.length > 0 && (
                  <div style={styles.alternatives}>
                    <span style={styles.alternativesLabel}>Similar: </span>
                    {ingredient.alternatives.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Custom Ingredient */}
          <div style={styles.customSection}>
            <button 
              style={styles.addButton}
              onClick={addCustomIngredient}
            >
              <Plus size={16} />
              Add Missing Ingredient
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!ingredients.length && !isParsing && text.length > 0 && (
        <div style={styles.emptyState}>
          <Type size={48} color="var(--gray-400)" />
          <p style={styles.emptyText}>Click "Parse Ingredients" to detect ingredients</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    background: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem'
  },
  headerContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem'
  },
  title: {
    margin: '0 0 0.25rem',
    fontSize: '1.25rem',
    fontWeight: '600',
    color: 'var(--gray-900)'
  },
  subtitle: {
    margin: 0,
    fontSize: '0.9rem',
    color: 'var(--gray-600)'
  },
  headerActions: {
    display: 'flex',
    gap: '0.5rem'
  },
  exampleButton: {
    background: 'var(--gray-100)',
    border: '1px solid var(--gray-300)',
    padding: '0.5rem 0.75rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    transition: 'all 0.2s ease'
  },
  examplesSection: {
    background: 'var(--primary-light)',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    textAlign: 'center'
  },
  examplesText: {
    margin: '0 0 0.75rem',
    fontSize: '0.9rem',
    color: 'var(--primary-dark)',
    lineHeight: '1.4'
  },
  exampleCopyButton: {
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  inputSection: {
    marginBottom: '1.5rem'
  },
  textareaContainer: {
    position: 'relative',
    marginBottom: '1rem'
  },
  textarea: {
    width: '100%',
    minHeight: '150px',
    padding: '1rem',
    borderRadius: '8px',
    border: '2px solid var(--gray-300)',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical',
    transition: 'all 0.2s ease',
    ':focus': {
      outline: 'none',
      borderColor: 'var(--primary)',
      boxShadow: '0 0 0 3px rgba(74, 144, 226, 0.1)'
    }
  },
  textareaActions: {
    position: 'absolute',
    bottom: '0.75rem',
    right: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  pasteButton: {
    background: 'var(--gray-100)',
    border: '1px solid var(--gray-300)',
    padding: '0.4rem 0.75rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    transition: 'all 0.2s ease'
  },
  charCount: {
    fontSize: '0.75rem',
    color: 'var(--gray-500)',
    background: 'rgba(255,255,255,0.9)',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px'
  },
  actionButtons: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap'
  },
  parseButton: {
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'all 0.2s ease',
    ':hover:not(:disabled)': {
      background: 'var(--primary-dark)',
      transform: 'translateY(-1px)'
    },
    ':disabled': {
      opacity: 0.6,
      cursor: 'not-allowed'
    }
  },
  parseButtonLoading: {
    background: 'var(--gray-500)'
  },
  clearButton: {
    background: 'var(--gray-100)',
    border: '1px solid var(--gray-300)',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    transition: 'all 0.2s ease',
    ':hover:not(:disabled)': {
      background: 'var(--gray-200)'
    },
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed'
    }
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid transparent',
    borderTop: '2px solid currentColor',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  errorBanner: {
    background: 'var(--error-light)',
    border: '1px solid var(--error)',
    color: 'var(--error-dark)',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    marginBottom: '1rem'
  },
  resultsSection: {
    background: 'var(--gray-50)',
    borderRadius: '8px',
    padding: '1.5rem',
    border: '1px solid var(--gray-200)'
  },
  resultsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  resultsTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  resultsTitleText: {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: '600',
    color: 'var(--gray-900)'
  },
  copyButton: {
    background: 'var(--gray-200)',
    border: 'none',
    padding: '0.5rem 0.75rem',
    borderRadius: '6px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    transition: 'all 0.2s ease'
  },
  ingredientsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '0.75rem',
    marginBottom: '1rem'
  },
  ingredientCard: {
    background: 'white',
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid var(--gray-200)'
  },
  ingredientHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.5rem'
  },
  ingredientName: {
    fontWeight: '500',
    fontSize: '0.9rem',
    textTransform: 'capitalize'
  },
  removeButton: {
    background: 'var(--gray-200)',
    border: 'none',
    borderRadius: '4px',
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.7rem',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'var(--error-light)',
      color: 'var(--error)'
    }
  },
  ingredientMeta: {
    display: 'flex',
    gap: '0.4rem',
    marginBottom: '0.5rem',
    flexWrap: 'wrap'
  },
  categoryTag: {
    color: 'white',
    padding: '0.2rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.7rem',
    fontWeight: '500'
  },
  commonBadge: {
    background: 'var(--success)',
    color: 'white',
    padding: '0.2rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.7rem',
    fontWeight: '500'
  },
  alternatives: {
    fontSize: '0.75rem',
    color: 'var(--gray-600)',
    lineHeight: '1.3'
  },
  alternativesLabel: {
    fontWeight: '500',
    color: 'var(--gray-700)'
  },
  customSection: {
    textAlign: 'center',
    paddingTop: '1rem',
    borderTop: '1px solid var(--gray-200)'
  },
  addButton: {
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.85rem',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'var(--primary-dark)'
    }
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem 2rem',
    color: 'var(--gray-500)'
  },
  emptyText: {
    margin: '1rem 0 0',
    fontSize: '0.9rem'
  }
};

export default SmartTextParser;