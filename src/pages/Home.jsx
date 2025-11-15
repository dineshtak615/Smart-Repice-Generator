// src/pages/Home.jsx
import React from 'react';
import { ChefHat, Camera, Search, Heart, Filter, Zap, ArrowRight, Clock, Users, Star } from 'lucide-react';

const Home = ({ navigateTo }) => {
  const features = [
    { 
      icon: Zap, 
      title: "Instant Matching", 
      desc: "AI-powered recipe suggestions based on your ingredients",
      color: "var(--primary)"
    },
    { 
      icon: Filter, 
      title: "Smart Filters", 
      desc: "Dietary preferences, cooking time, difficulty level & more",
      color: "var(--success)"
    },
    { 
      icon: Heart, 
      title: "Save & Rate", 
      desc: "Build your personal cookbook and share your favorites",
      color: "var(--error)"
    },
    { 
      icon: Clock, 
      title: "Quick Recipes", 
      desc: "Find meals you can make in 30 minutes or less",
      color: "var(--warning)"
    }
  ];

  const stats = [
    { number: "500+", label: "Recipes Available", icon: ChefHat },
    { number: "15min", label: "Average Cooking Time", icon: Clock },
    { number: "4.8★", label: "User Rating", icon: Star },
    { number: "10K+", label: "Happy Cooks", icon: Users }
  ];

  return (
    <main style={styles.main}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroBackground} />
        <div style={styles.heroContent}>
          <div style={styles.heroText}>
            <div style={styles.badge}>
              <Zap size={16} />
              AI-Powered Recipe Finder
            </div>
            <h1 style={styles.heroTitle}>
              Turn Ingredients into
              <span style={styles.highlight}> Delicious Meals</span>
            </h1>
            <p style={styles.heroSubtitle}>
              Snap a photo of your ingredients or type them in. Our AI will suggest 
              perfect recipes tailored just for you in seconds.
            </p>
            <div style={styles.ctaButtons}>
              <button 
                style={styles.primaryBtn} 
                onClick={() => navigateTo('ingredients')}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 25px rgba(79, 70, 229, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                }}
              >
                <Camera size={20} /> 
                <div>
                  <div style={styles.btnMainText}>Start with Photo</div>
                  <div style={styles.btnSubText}>AI-powered recognition</div>
                </div>
                <ArrowRight size={16} style={styles.btnArrow} />
              </button>
              <button 
                style={styles.secondaryBtn} 
                onClick={() => navigateTo('ingredients')}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                }}
              >
                <Search size={20} />
                <div>
                  <div style={styles.btnMainText}>Type Ingredients</div>
                  <div style={styles.btnSubText}>Manual input</div>
                </div>
                <ArrowRight size={16} style={styles.btnArrow} />
              </button>
            </div>
          </div>
          <div style={styles.heroVisual}>
            <div style={styles.heroImageContainer}>
              <ChefHat size={140} color="var(--primary)" style={styles.chefIcon} />
              <div style={styles.floatingElement1}>
                <div style={styles.floatingIcon}>
                  <Camera size={20} color="var(--primary)" />
                </div>
                <span>Photo Scan</span>
              </div>
              <div style={styles.floatingElement2}>
                <div style={styles.floatingIcon}>
                  <Search size={20} color="var(--success)" />
                </div>
                <span>Smart Search</span>
              </div>
              <div style={styles.floatingElement3}>
                <div style={styles.floatingIcon}>
                  <Heart size={20} color="var(--error)" />
                </div>
                <span>Save Recipes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div 
              key={index} 
              style={styles.statCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
              }}
            >
              <div style={styles.statIcon}>
                <stat.icon size={24} color="var(--primary)" />
              </div>
              <div style={styles.statNumber}>{stat.number}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Why Choose SmartRecipes?</h2>
          <p style={styles.sectionSubtitle}>
            Everything you need to cook amazing meals with what you have
          </p>
        </div>
        <div style={styles.featureGrid}>
          {features.map((feature, index) => (
            <div 
              key={index} 
              style={{
                ...styles.featureCard,
                '--feature-color': feature.color
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.08)';
              }}
            >
              <div style={styles.featureIconContainer}>
                <feature.icon size={32} color={feature.color} />
              </div>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDesc}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={styles.howItWorks}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <p style={styles.sectionSubtitle}>
            Get personalized recipes in three simple steps
          </p>
        </div>
        <div style={styles.stepsContainer}>
          <div style={styles.step}>
            <div style={styles.stepNumber}>1</div>
            <div style={styles.stepContent}>
              <h3 style={styles.stepTitle}>Input Ingredients</h3>
              <p style={styles.stepDesc}>
                Take a photo or type in the ingredients you have available
              </p>
            </div>
          </div>
          <div style={styles.stepConnector} />
          <div style={styles.step}>
            <div style={styles.stepNumber}>2</div>
            <div style={styles.stepContent}>
              <h3 style={styles.stepTitle}>AI Matching</h3>
              <p style={styles.stepDesc}>
                Our AI finds perfect recipes based on your ingredients and preferences
              </p>
            </div>
          </div>
          <div style={styles.stepConnector} />
          <div style={styles.step}>
            <div style={styles.stepNumber}>3</div>
            <div style={styles.stepContent}>
              <h3 style={styles.stepTitle}>Cook & Enjoy</h3>
              <p style={styles.stepDesc}>
                Follow step-by-step instructions and enjoy your delicious meal
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={styles.finalCTA}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Ready to Start Cooking?</h2>
          <p style={styles.ctaSubtitle}>
            Join thousands of home cooks who are creating amazing meals with SmartRecipes
          </p>
          <button 
            style={styles.ctaLarge} 
            onClick={() => navigateTo('ingredients')}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 20px 40px rgba(79, 70, 229, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 12px 30px rgba(79, 70, 229, 0.3)';
            }}
          >
            <ChefHat size={24} />
            Get Started Now 
            <ArrowRight size={24} />
          </button>
        </div>
      </section>
    </main>
  );
};

const styles = {
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'linear-gradient(135deg, var(--gray-50) 0%, white 50%, var(--primary-light) 100%)',
    minHeight: '100vh'
  },
  
  // Hero Section
  hero: {
    position: 'relative',
    padding: '6rem 2rem 4rem',
    maxWidth: '1400px',
    width: '100%',
    overflow: 'hidden'
  },
  heroBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.03) 0%, rgba(99, 102, 241, 0.05) 100%)',
    zIndex: 0
  },
  heroContent: {
    position: 'relative',
    zIndex: 1,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4rem',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  heroText: {
    maxWidth: '600px'
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(79, 70, 229, 0.1)',
    color: 'var(--primary)',
    padding: '0.5rem 1rem',
    borderRadius: '50px',
    fontSize: '0.875rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
    border: '1px solid rgba(79, 70, 229, 0.2)'
  },
  heroTitle: {
    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
    fontWeight: '800',
    lineHeight: '1.1',
    margin: '0 0 1.5rem',
    color: 'var(--gray-900)'
  },
  highlight: {
    background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'block'
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    color: 'var(--gray-600)',
    margin: '0 0 3rem',
    lineHeight: '1.6'
  },
  ctaButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: '400px'
  },
  primaryBtn: {
    padding: '1.5rem 2rem',
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    borderRadius: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
    textAlign: 'left'
  },
  secondaryBtn: {
    padding: '1.5rem 2rem',
    background: 'white',
    color: 'var(--gray-800)',
    border: '2px solid var(--gray-200)',
    borderRadius: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    textAlign: 'left'
  },
  btnMainText: {
    fontSize: '1.125rem',
    fontWeight: '600'
  },
  btnSubText: {
    fontSize: '0.875rem',
    color: 'var(--gray-500)',
    marginTop: '0.25rem'
  },
  btnArrow: {
    marginLeft: 'auto',
    opacity: 0.7
  },
  heroVisual: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  heroImageContainer: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  chefIcon: {
    filter: 'drop-shadow(0 20px 40px rgba(79, 70, 229, 0.3))'
  },
  floatingElement1: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    background: 'white',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    animation: 'float 3s ease-in-out infinite'
  },
  floatingElement2: {
    position: 'absolute',
    top: '60%',
    right: '10%',
    background: 'white',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    animation: 'float 3s ease-in-out infinite 1s'
  },
  floatingElement3: {
    position: 'absolute',
    bottom: '20%',
    left: '20%',
    background: 'white',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    animation: 'float 3s ease-in-out infinite 2s'
  },
  floatingIcon: {
    padding: '0.5rem',
    background: 'var(--gray-50)',
    borderRadius: '8px'
  },

  // Stats Section
  statsSection: {
    padding: '4rem 2rem',
    width: '100%',
    maxWidth: '1200px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem'
  },
  statCard: {
    background: 'white',
    padding: '2.5rem 2rem',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    border: '1px solid var(--gray-200)',
    transition: 'all 0.3s ease'
  },
  statIcon: {
    width: '60px',
    height: '60px',
    background: 'var(--primary-light)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem'
  },
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: 'var(--gray-900)',
    marginBottom: '0.5rem'
  },
  statLabel: {
    color: 'var(--gray-600)',
    fontSize: '1rem',
    fontWeight: '500'
  },

  // Features Section
  features: {
    padding: '6rem 2rem',
    background: 'var(--gray-50)',
    width: '100%'
  },
  sectionHeader: {
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto 4rem'
  },
  sectionTitle: {
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    fontWeight: '800',
    color: 'var(--gray-900)',
    margin: '0 0 1rem'
  },
  sectionSubtitle: {
    fontSize: '1.25rem',
    color: 'var(--gray-600)',
    lineHeight: '1.6'
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  featureCard: {
    background: 'white',
    padding: '3rem 2rem',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: '0 12px 25px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
    transform: 'translateY(-2px)',
    border: '1px solid var(--gray-200)'
  },
  featureIconContainer: {
    width: '80px',
    height: '80px',
    background: 'var(--gray-50)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 2rem',
    border: '2px solid var(--gray-200)'
  },
  featureTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--gray-900)',
    margin: '0 0 1rem'
  },
  featureDesc: {
    color: 'var(--gray-600)',
    fontSize: '1rem',
    lineHeight: '1.6'
  },

  // How It Works
  howItWorks: {
    padding: '6rem 2rem',
    background: 'white',
    width: '100%'
  },
  stepsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2rem',
    maxWidth: '1000px',
    margin: '0 auto',
    flexWrap: 'wrap'
  },
  step: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    flex: 1,
    minWidth: '250px'
  },
  stepNumber: {
    width: '60px',
    height: '60px',
    background: 'var(--primary)',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: '700',
    flexShrink: 0
  },
  stepContent: {
    flex: 1
  },
  stepTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'var(--gray-900)',
    margin: '0 0 0.5rem'
  },
  stepDesc: {
    color: 'var(--gray-600)',
    lineHeight: '1.5'
  },
  stepConnector: {
    width: '40px',
    height: '2px',
    background: 'var(--gray-300)',
    flexShrink: 0
  },

  // Final CTA
  finalCTA: {
    padding: '6rem 2rem',
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
    width: '100%',
    textAlign: 'center'
  },
  ctaContent: {
    maxWidth: '600px',
    margin: '0 auto'
  },
  ctaTitle: {
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    fontWeight: '800',
    color: 'white',
    margin: '0 0 1rem'
  },
  ctaSubtitle: {
    fontSize: '1.25rem',
    color: 'rgba(255,255,255,0.9)',
    margin: '0 0 3rem',
    lineHeight: '1.6'
  },
  ctaLarge: {
    padding: '1.5rem 3rem',
    background: 'white',
    color: 'var(--primary)',
    border: 'none',
    borderRadius: '16px',
    fontSize: '1.25rem',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '1rem',
    boxShadow: '0 12px 30px rgba(79, 70, 229, 0.3)',
    transition: 'all 0.3s ease'
  }
};

// Add CSS animations
const styleSheet = document.styleSheets[0];
if (styleSheet) {
  const animations = `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
  `;
  styleSheet.insertRule(animations, styleSheet.cssRules.length);
}

export default Home;