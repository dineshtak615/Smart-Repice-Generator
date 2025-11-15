// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { 
  ChefHat, 
  Home, 
  Search, 
  Heart, 
  Menu, 
  X,
  Sparkles,
  User,
  Bell,
  BookOpen,
  TrendingUp
} from 'lucide-react';

const Header = ({ currentPage, navigateTo, savedRecipesCount = 0 }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const links = [
    { id: 'home', label: 'Home', icon: Home, description: 'Discover recipes' },
    { id: 'ingredients', label: 'Find Recipes', icon: Search, description: 'Search by ingredients' },
    { id: 'saved', label: 'Saved Recipes', icon: Heart, description: 'Your collection', badge: savedRecipesCount },
    { id: 'results', label: 'Browse', icon: BookOpen, description: 'All recipes' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header style={{
        ...styles.header,
        ...(isScrolled && styles.headerScrolled)
      }}>
        <div style={styles.container}>
          {/* Logo */}
          <div 
            style={styles.logo} 
            onClick={() => {
              navigateTo('home');
              closeMobileMenu();
            }}
            className="logo-hover"
          >
            <div style={styles.logoIcon}>
              <ChefHat size={32} color="var(--primary)" />
              <div style={styles.sparkle}>
                <Sparkles size={12} fill="var(--primary)" color="var(--primary)" />
              </div>
            </div>
            <div>
              <span style={styles.logoText}>SmartRecipes</span>
              <span style={styles.logoSubtitle}>AI-Powered Cooking</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav style={styles.nav}>
            {links.map(link => (
              <button
                key={link.id}
                style={{
                  ...styles.navLink,
                  ...(currentPage === link.id && styles.activeLink)
                }}
                onClick={() => navigateTo(link.id)}
                className="nav-link-hover"
                title={link.description}
              >
                <link.icon size={20} />
                <span>{link.label}</span>
                {link.badge > 0 && (
                  <span style={styles.badge}>{link.badge}</span>
                )}
              </button>
            ))}
          </nav>

          {/* User Actions */}
          <div style={styles.actions}>
            <button 
              style={styles.actionButton}
              onClick={() => navigateTo('saved')}
              title="Saved Recipes"
            >
              <Heart size={20} />
              {savedRecipesCount > 0 && (
                <span style={styles.actionBadge}>{savedRecipesCount}</span>
              )}
            </button>
            
            <button 
              style={styles.actionButton}
              onClick={() => navigateTo('ingredients')}
              title="Find Recipes"
            >
              <Search size={20} />
            </button>

            <button 
              style={styles.userButton}
              onClick={() => navigateTo('home')}
              title="Profile"
            >
              <User size={20} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            style={styles.mobileMenuButton}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div style={styles.mobileOverlay}>
          <div style={styles.mobileMenu}>
            <div style={styles.mobileHeader}>
              <div style={styles.mobileLogo}>
                <ChefHat size={28} color="var(--primary)" />
                <span style={styles.mobileLogoText}>SmartRecipes</span>
              </div>
            </div>

            <nav style={styles.mobileNav}>
              {links.map(link => (
                <button
                  key={link.id}
                  style={{
                    ...styles.mobileNavLink,
                    ...(currentPage === link.id && styles.mobileActiveLink)
                  }}
                  onClick={() => {
                    navigateTo(link.id);
                    closeMobileMenu();
                  }}
                >
                  <link.icon size={22} />
                  <div style={styles.mobileNavText}>
                    <span style={styles.mobileNavLabel}>{link.label}</span>
                    <span style={styles.mobileNavDescription}>{link.description}</span>
                  </div>
                  {link.badge > 0 && (
                    <span style={styles.mobileBadge}>{link.badge}</span>
                  )}
                </button>
              ))}
            </nav>

            <div style={styles.mobileFooter}>
              <div style={styles.userInfo}>
                <div style={styles.userAvatar}>
                  <User size={20} />
                </div>
                <div>
                  <div style={styles.userName}>Food Explorer</div>
                  <div style={styles.userStats}>{savedRecipesCount} saved recipes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS animations */}
      <style>{`
        .logo-hover:hover {
          transform: translateY(-1px);
        }
        
        .nav-link-hover:hover:not(.active) {
          background: var(--primary-light);
          color: var(--primary);
          transform: translateY(-1px);
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .header-scrolled {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

const styles = {
  header: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    transition: 'all 0.3s ease'
  },
  headerScrolled: {
    background: 'rgba(255, 255, 255, 0.98)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1rem 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    flexShrink: 0
  },
  logoIcon: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sparkle: {
    position: 'absolute',
    top: -2,
    right: -2,
    background: 'white',
    borderRadius: '50%',
    padding: '2px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  logoText: {
    background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: '800',
    fontSize: '1.4rem',
    lineHeight: '1.2'
  },
  logoSubtitle: {
    display: 'block',
    fontSize: '0.7rem',
    color: 'var(--gray-500)',
    fontWeight: '500',
    marginTop: '2px'
  },
  nav: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      display: 'none'
    }
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    borderRadius: '12px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    position: 'relative'
  },
  activeLink: {
    background: 'var(--primary)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)'
  },
  badge: {
    background: 'var(--error)',
    color: 'white',
    borderRadius: '10px',
    padding: '2px 6px',
    fontSize: '0.7rem',
    fontWeight: '700',
    minWidth: '18px',
    textAlign: 'center'
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    '@media (max-width: 768px)': {
      display: 'none'
    }
  },
  actionButton: {
    position: 'relative',
    padding: '0.75rem',
    background: 'var(--gray-100)',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    color: 'var(--gray-700)',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionBadge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    background: 'var(--error)',
    color: 'white',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    fontSize: '0.7rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  userButton: {
    padding: '0.75rem',
    background: 'var(--primary-light)',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    color: 'var(--primary)',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  mobileMenuButton: {
    display: 'none',
    background: 'var(--gray-100)',
    border: 'none',
    borderRadius: '8px',
    padding: '0.75rem',
    cursor: 'pointer',
    color: 'var(--gray-700)',
    '@media (max-width: 768px)': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  },
  mobileOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
    '@media (min-width: 769px)': {
      display: 'none'
    }
  },
  mobileMenu: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: '320px',
    maxWidth: '90vw',
    background: 'white',
    boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideInRight 0.3s ease-out'
  },
  mobileHeader: {
    padding: '1.5rem',
    borderBottom: '1px solid var(--gray-200)'
  },
  mobileLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontWeight: '700',
    fontSize: '1.2rem'
  },
  mobileLogoText: {
    background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  mobileNav: {
    flex: 1,
    padding: '1rem 0'
  },
  mobileNavLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 1.5rem',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
    transition: 'all 0.2s ease'
  },
  mobileActiveLink: {
    background: 'var(--primary-light)',
    color: 'var(--primary)'
  },
  mobileNavText: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  mobileNavLabel: {
    fontWeight: '600',
    fontSize: '1rem'
  },
  mobileNavDescription: {
    fontSize: '0.8rem',
    color: 'var(--gray-500)',
    marginTop: '2px'
  },
  mobileBadge: {
    background: 'var(--error)',
    color: 'white',
    borderRadius: '10px',
    padding: '4px 8px',
    fontSize: '0.75rem',
    fontWeight: '700',
    minWidth: '20px',
    textAlign: 'center'
  },
  mobileFooter: {
    padding: '1.5rem',
    borderTop: '1px solid var(--gray-200)'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    background: 'var(--primary-light)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--primary)'
  },
  userName: {
    fontWeight: '600',
    fontSize: '0.9rem'
  },
  userStats: {
    fontSize: '0.8rem',
    color: 'var(--gray-500)',
    marginTop: '2px'
  }
};

// Add mobile responsive styles
const mediaQuery = window.matchMedia('(max-width: 768px)');
if (mediaQuery.matches) {
  Object.assign(styles.nav, { display: 'none' });
  Object.assign(styles.actions, { display: 'none' });
  Object.assign(styles.mobileMenuButton, { display: 'flex' });
}

export default Header;