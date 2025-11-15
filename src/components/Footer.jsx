// src/components/Footer.jsx
import React from 'react';
import { 
  Heart, 
  Github, 
  Twitter, 
  Mail, 
  ExternalLink,
  ChefHat,
  Users,
  Star,
  Coffee
} from 'lucide-react';

const Footer = ({ savedRecipesCount = 0, totalRecipes = 1000 }) => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Browse Recipes', href: '#', icon: ChefHat },
    { label: 'How It Works', href: '#', icon: Users },
    { label: 'Featured Recipes', href: '#', icon: Star },
    { label: 'Cooking Tips', href: '#', icon: Coffee }
  ];

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Mail, href: '#', label: 'Email' }
  ];

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        
        {/* Main Footer Content */}
        <div style={styles.mainContent}>
          
          {/* Brand Section */}
          <div style={styles.brandSection}>
            <div style={styles.logo}>
              <ChefHat size={32} color="var(--primary)" />
              <span style={styles.logoText}>SmartRecipes</span>
            </div>
            <p style={styles.tagline}>
              AI-powered recipe recommendations for every kitchen
            </p>
            <div style={styles.stats}>
              <div style={styles.stat}>
                <span style={styles.statNumber}>{totalRecipes.toLocaleString()}+</span>
                <span style={styles.statLabel}>Recipes</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statNumber}>{savedRecipesCount}</span>
                <span style={styles.statLabel}>Your Saved</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div style={styles.linksSection}>
            <h4 style={styles.sectionTitle}>Quick Links</h4>
            <div style={styles.linksGrid}>
              {quickLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  style={styles.link}
                  className="footer-link"
                >
                  <link.icon size={16} />
                  {link.label}
                  <ExternalLink size={12} style={styles.externalIcon} />
                </a>
              ))}
            </div>
          </div>

          {/* Community */}
          <div style={styles.communitySection}>
            <h4 style={styles.sectionTitle}>Join Our Community</h4>
            <p style={styles.communityText}>
              Share your creations and get inspired by home cooks worldwide
            </p>
            <div style={styles.socialLinks}>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  style={styles.socialLink}
                  className="social-link"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div style={styles.footerBottom}>
          <div style={styles.copyright}>
            <p style={styles.copyrightText}>
              © {currentYear} SmartRecipes. Made with{' '}
              <Heart 
                size={16} 
                fill="var(--error)" 
                style={{ 
                  display: 'inline', 
                  margin: '0 4px',
                  animation: 'heartbeat 1.5s ease-in-out infinite'
                }} 
              />{' '}
              for food lovers everywhere
            </p>
          </div>
          
          <div style={styles.legalLinks}>
            <a href="#" style={styles.legalLink}>Privacy Policy</a>
            <a href="#" style={styles.legalLink}>Terms of Service</a>
            <a href="#" style={styles.legalLink}>Contact</a>
          </div>
        </div>

      </div>

      {/* Add CSS animations */}
      <style>{`
        .footer-link:hover {
          transform: translateX(4px);
          color: var(--primary) !important;
        }
        
        .social-link:hover {
          transform: translateY(-2px);
          background: var(--primary) !important;
          color: white !important;
        }
        
        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.1);
          }
          50% {
            transform: scale(1);
          }
          75% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </footer>
  );
};

const styles = {
  footer: {
    background: 'linear-gradient(135deg, var(--gray-900) 0%, var(--gray-800) 100%)',
    color: 'white',
    marginTop: 'auto',
    position: 'relative',
    overflow: 'hidden'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '3rem 2rem 1.5rem'
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    gap: '3rem',
    marginBottom: '2rem',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '2rem'
    }
  },
  brandSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.5rem'
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #fff, var(--gray-300))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  tagline: {
    fontSize: '1rem',
    color: 'var(--gray-300)',
    lineHeight: '1.5',
    maxWidth: '300px'
  },
  stats: {
    display: 'flex',
    gap: '2rem',
    marginTop: '1rem'
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  statNumber: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--primary)'
  },
  statLabel: {
    fontSize: '0.8rem',
    color: 'var(--gray-400)',
    marginTop: '0.25rem'
  },
  linksSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: 'white'
  },
  linksGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'var(--gray-300)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    padding: '0.25rem 0'
  },
  externalIcon: {
    marginLeft: 'auto',
    opacity: 0.7
  },
  communitySection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  communityText: {
    fontSize: '0.9rem',
    color: 'var(--gray-300)',
    lineHeight: '1.5',
    marginBottom: '1rem'
  },
  socialLinks: {
    display: 'flex',
    gap: '0.75rem'
  },
  socialLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: 'var(--gray-300)',
    textDecoration: 'none',
    transition: 'all 0.3s ease'
  },
  footerBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '1.5rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: '1rem',
      textAlign: 'center'
    }
  },
  copyright: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  copyrightText: {
    fontSize: '0.9rem',
    color: 'var(--gray-400)',
    margin: 0,
    display: 'flex',
    alignItems: 'center'
  },
  legalLinks: {
    display: 'flex',
    gap: '1.5rem',
    '@media (max-width: 768px)': {
      gap: '1rem'
    }
  },
  legalLink: {
    color: 'var(--gray-400)',
    textDecoration: 'none',
    fontSize: '0.8rem',
    transition: 'color 0.2s ease'
  }
};

// Add hover effects
Object.assign(styles.link, {
  ':hover': {
    color: 'var(--primary)'
  }
});

Object.assign(styles.socialLink, {
  ':hover': {
    background: 'var(--primary)',
    color: 'white'
  }
});

Object.assign(styles.legalLink, {
  ':hover': {
    color: 'white'
  }
});

export default Footer;