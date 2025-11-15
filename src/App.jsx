// src/App.jsx
import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import IngredientsInput from './pages/IngredientsInput';
import RecipeResults from './pages/RecipeResults';
import SavedRecipes from './pages/SavedRecipes';
import { useRecipeMatcher } from './hooks/useRecipeMatcher';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import Footer from './components/Footer';
import './styles/animations.css';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main style={styles.errorContainer}>
          <div style={styles.errorContent}>
            <h2 style={styles.errorTitle}>🍳 Recipe App Error</h2>
            <p style={styles.errorMessage}>
              We're having trouble cooking up your experience...
            </p>
            <p style={styles.errorDetails}>
              {this.state.error?.message || 'Something went wrong in the kitchen'}
            </p>
            <div style={styles.errorActions}>
              <button 
                style={styles.errorBtn} 
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
              <button 
                style={styles.secondaryErrorBtn}
                onClick={() => this.setState({ hasError: false, error: null })}
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [userIngredients, setUserIngredients] = useState([]);
  const [savedRecipes, setSavedRecipes] = useLocalStorage('savedRecipes', []);
  const [isLoading, setIsLoading] = useState(false);
  const [appReady, setAppReady] = useState(false);

  const matchedRecipes = useRecipeMatcher(userIngredients);

  // Initialize app with a slight delay for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppReady(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const navigateTo = (page) => {
    setIsLoading(true);
    setCurrentPage(page);
    window.scrollTo(0, 0);
    
    // Simulate loading for better UX
    setTimeout(() => setIsLoading(false), 400);
  };

  const handleIngredientsSubmit = (ingredients) => {
    console.log('Ingredients submitted:', ingredients);
    const cleanedIngredients = ingredients.map(i => i.toLowerCase().trim());
    setUserIngredients(cleanedIngredients);
    navigateTo('results');
  };

  const toggleSaveRecipe = (recipe) => {
    const exists = savedRecipes.some(r => r.id === recipe.id);
    if (exists) {
      setSavedRecipes(savedRecipes.filter(r => r.id !== recipe.id));
    } else {
      const recipeToSave = {
        ...recipe,
        savedAt: new Date().toISOString(),
        isSaved: true
      };
      setSavedRecipes([...savedRecipes, recipeToSave]);
    }
  };

  const clearUserIngredients = () => {
    setUserIngredients([]);
  };

  // App loading state
  if (!appReady) {
    return (
      <div style={styles.appLoading}>
        <div style={styles.loadingContent}>
          <div style={styles.logoAnimation}>
            <div style={styles.chefIcon}>👨‍🍳</div>
            <div style={styles.loadingPulse}></div>
          </div>
          <h1 style={styles.loadingTitle}>SmartRecipes</h1>
          <p style={styles.loadingSubtitle}>Preparing your cooking experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <Header 
        currentPage={currentPage} 
        navigateTo={navigateTo}
        savedRecipesCount={savedRecipes.length}
      />

      <main style={styles.main}>
        <ErrorBoundary>
          {isLoading ? (
            <div style={styles.pageLoader}>
              <div style={styles.pageSpinner}></div>
              <p style={styles.loadingText}>
                {currentPage === 'results' 
                  ? 'Finding perfect recipes...' 
                  : 'Loading...'
                }
              </p>
            </div>
          ) : (
            <>
              {currentPage === 'home' && (
                <Home 
                  navigateTo={navigateTo}
                  setSelectedRecipe={() => {}} // Add if needed
                  savedRecipes={savedRecipes}
                  setSavedRecipes={setSavedRecipes}
                />
              )}
              {currentPage === 'ingredients' && (
                <IngredientsInput
                  onIngredientsSubmit={handleIngredientsSubmit}
                  navigateTo={navigateTo}
                  clearIngredients={clearUserIngredients}
                />
              )}
              {currentPage === 'results' && (
                <RecipeResults
                  userIngredients={userIngredients}
                  matchedRecipes={matchedRecipes}
                  savedRecipes={savedRecipes}
                  toggleSaveRecipe={toggleSaveRecipe}
                  navigateTo={navigateTo}
                  clearIngredients={clearUserIngredients}
                />
              )}
              {currentPage === 'saved' && (
                <SavedRecipes
                  savedRecipes={savedRecipes}
                  setSavedRecipes={setSavedRecipes}
                  navigateTo={navigateTo}
                />
              )}
            </>
          )}
        </ErrorBoundary>
      </main>

      <Footer savedRecipesCount={savedRecipes.length} />
    </div>
  );
};

const styles = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(135deg, var(--gray-50) 0%, var(--gray-100) 100%)',
    fontFamily: 'var(--font-family)',
    lineHeight: '1.6'
  },
  appLoading: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--gray-50) 100%)',
    fontFamily: 'var(--font-family)'
  },
  loadingContent: {
    textAlign: 'center',
    animation: 'fadeIn 0.8s ease-out'
  },
  logoAnimation: {
    position: 'relative',
    display: 'inline-block',
    marginBottom: '1.5rem'
  },
  chefIcon: {
    fontSize: '4rem',
    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
    animation: 'bounce 2s ease-in-out infinite'
  },
  loadingPulse: {
    position: 'absolute',
    top: '-10px',
    left: '-10px',
    right: '-10px',
    bottom: '-10px',
    border: '3px solid var(--primary)',
    borderRadius: '50%',
    animation: 'pulse 2s ease-in-out infinite'
  },
  loadingTitle: {
    fontSize: '2.5rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '0 0 0.5rem'
  },
  loadingSubtitle: {
    fontSize: '1.1rem',
    color: 'var(--gray-600)',
    margin: 0
  },
  main: {
    flex: 1,
    padding: '0',
    position: 'relative',
    minHeight: 'calc(100vh - 140px)' // Account for header/footer
  },
  pageLoader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',
    color: 'var(--gray-600)',
    animation: 'fadeIn 0.3s ease-out'
  },
  pageSpinner: {
    width: '50px',
    height: '50px',
    border: '4px solid var(--gray-200)',
    borderTop: '4px solid var(--primary)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1.5rem'
  },
  loadingText: {
    fontSize: '1.1rem',
    fontWeight: '500',
    margin: 0,
    color: 'var(--gray-700)'
  },
  errorContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, var(--gray-50) 0%, white 100%)',
    padding: '2rem'
  },
  errorContent: {
    textAlign: 'center',
    maxWidth: '500px',
    animation: 'fadeIn 0.5s ease-out'
  },
  errorTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: 'var(--gray-800)',
    margin: '0 0 1rem'
  },
  errorMessage: {
    fontSize: '1.2rem',
    color: 'var(--gray-600)',
    margin: '0 0 0.5rem',
    lineHeight: '1.5'
  },
  errorDetails: {
    fontSize: '0.9rem',
    color: 'var(--gray-500)',
    margin: '0 0 2rem',
    fontFamily: 'monospace',
    background: 'var(--gray-100)',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid var(--gray-200)'
  },
  errorActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  errorBtn: {
    padding: '0.75rem 1.5rem',
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)',
    ':hover': {
      background: 'var(--primary-dark)',
      transform: 'translateY(-2px)'
    }
  },
  secondaryErrorBtn: {
    padding: '0.75rem 1.5rem',
    background: 'var(--gray-100)',
    color: 'var(--gray-700)',
    border: '2px solid var(--gray-300)',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    ':hover': {
      background: 'var(--gray-200)',
      transform: 'translateY(-2px)'
    }
  }
};

// Add global styles for better consistency
const globalStyles = `
  :root {
    --primary: #4a90e2;
    --primary-dark: #357abd;
    --primary-light: #e3f2fd;
    --secondary: #ff6b6b;
    --success: #51cf66;
    --warning: #ffd43b;
    --error: #ff6b6b;
    --gray-50: #f8f9fa;
    --gray-100: #f1f3f5;
    --gray-200: #e9ecef;
    --gray-300: #dee2e6;
    --gray-400: #ced4da;
    --gray-500: #adb5bd;
    --gray-600: #868e96;
    --gray-700: #495057;
    --gray-800: #343a40;
    --gray-900: #212529;
    --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: var(--font-family);
    line-height: 1.6;
    color: var(--gray-800);
    background-color: var(--gray-50);
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }

  input, textarea, select {
    font-family: inherit;
  }

  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }

  /* Focus styles for accessibility */
  button:focus-visible,
  input:focus-visible,
  a:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }

  /* Selection styles */
  ::selection {
    background-color: var(--primary-light);
    color: var(--primary-dark);
  }
`;

// Inject global styles
const styleSheet = document.createElement("style");
styleSheet.textContent = globalStyles;
document.head.appendChild(styleSheet);

export default App;