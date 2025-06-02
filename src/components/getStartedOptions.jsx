import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Eye, 
  MapPin, 
  ArrowRight,
  AlertCircle,
  CheckCircle2 // Changed to outline version if available, or force stroke
} from 'lucide-react';

export default function ItemsMenuComponent() {
  const navigate = useNavigate();

  const styles = {
    container: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      lineHeight: '1.6',
      color: '#0f172a',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)',
      minHeight: '100vh',
      padding: '120px 0 80px'
    },
    maxWidth: {
      maxWidth: '1200px', 
      margin: '0 auto',
      padding: '0 40px' 
    },
    header: {
      textAlign: 'center',
      marginBottom: '4rem'
    },
    headerBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
      border: '1px solid rgba(99, 102, 241, 0.2)',
      borderRadius: '50px',
      padding: '10px 20px',
      marginBottom: '1.5rem',
      color: '#6366f1',
      fontSize: '0.9rem',
      fontWeight: '600',
      backdropFilter: 'blur(10px)'
    },
    title: {
      fontSize: '3.5rem',
      fontWeight: '800',
      marginBottom: '1rem',
      lineHeight: '1.1',
      letterSpacing: '-0.02em'
    },
    titleGradient: {
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      display: 'block'
    },
    subtitle: {
      fontSize: '1.3rem',
      color: '#64748b',
      maxWidth: '600px',
      marginLeft: 'auto',
      marginRight: 'auto',
      lineHeight: '1.7'
    },
    cardsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', 
      gap: '2rem',
      maxWidth: 'none', 
      margin: '0 auto'
    },
    card: {
      background: 'rgba(255, 255, 255, 0.9)',
      padding: '2.5rem',
      borderRadius: '24px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.06)',
      transition: 'all 0.4s ease',
      border: '1px solid rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'pointer',
      textAlign: 'center',
      display: 'flex', // Use flexbox for vertical alignment
      flexDirection: 'column',
      justifyContent: 'space-between', // Push button to bottom
    },
    cardHover: {
      transform: 'translateY(-8px)',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12)'
    },
    cardIcon: {
      width: '80px',
      height: '80px',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1.5rem',
      // Removed color from here, now set directly on the icon
      // Removed background gradient, as icons will be stroke and not filled
      fontSize: '28px',
      boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)',
      border: '2px solid transparent', // Add a border for stroke effect with consistent background
      backgroundColor: '#f1f5f9', // A very light background for the icon container
    },
    // Removed specific icon styles (lostIcon, foundIcon, viewIcon)
    // as we want all icons to be the same color (via `lucideColor`)
    
    cardTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      marginBottom: '1rem',
      color: '#0f172a'
    },
    cardDescription: {
      color: '#64748b',
      lineHeight: '1.6',
      fontSize: '1rem',
      marginBottom: '2rem',
      minHeight: '3.2em', // Approximately two lines with line-height 1.6
      display: '-webkit-box',
      WebkitLineClamp: '2', // Limit to two lines
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    cardButton: {
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      color: 'white',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '50px',
      fontWeight: '600',
      fontSize: '0.95rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 6px 20px rgba(99, 102, 241, 0.3)',
      transform: 'translateY(0)',
      // Adjusted width and margin for content-based width
      width: 'fit-content', // Set width to fit content
      justifyContent: 'center',
      margin: '0 auto', // Center the button
    },
    cardButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)'
    },
    lucideColor: '#6366f1', // Common color for all Lucide icons
  };

  const menuItems = [
    {
      id: 'report-lost',
      title: 'Report Lost Item',
      description: 'If you have lost an item, quickly report it here with all relevant details and photos.',
      icon: <AlertCircle size={28} strokeWidth={2} color={styles.lucideColor} />, // Set size, stroke, and color
      route: '/lostItemReportPage',
      buttonText: 'Report Lost'
    },
    {
      id: 'report-found',
      title: 'Report Found Item',
      description: 'Found something? Please report it here with details to help reunite it with its owner.',
      icon: <CheckCircle2 size={28} strokeWidth={2} color={styles.lucideColor} />, // Set size, stroke, and color
      route: '/foundItemReportPage',
      buttonText: 'Report Found'
    },
    {
      id: 'view-lost',
      title: 'View Lost Items',
      description: 'Browse through a comprehensive list of lost items reported by other community members.',
      icon: <Search size={28} strokeWidth={2} color={styles.lucideColor} />, // Set size, stroke, and color
      route: '/lostItemsList',
      buttonText: 'View Lost Items'
    },
    {
      id: 'view-found',
      title: 'View Found Items',
      description: 'Check our listings of found items to see if any of them match your lost belongings.',
      icon: <Eye size={28} strokeWidth={2} color={styles.lucideColor} />, // Set size, stroke, and color
      route: '/FoundItemList',
      buttonText: 'View Found Items'
    }
  ];

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth} className="max-width-container">
        {/* Header Section */}
        <div style={styles.header}>
          <h1 style={styles.title}>
            What would you like to
            <span style={styles.titleGradient}>do today?</span>
          </h1>
          <p style={styles.subtitle}>
            Choose from the options below to report lost items, help others find their belongings, 
            or browse through our community listings.
          </p>
        </div>

        {/* Cards Grid */}
        <div style={styles.cardsGrid} className="cards-grid"> 
          {menuItems.map((item, index) => (
            <div
              key={item.id}
              style={styles.card}
              onClick={() => handleCardClick(item.route)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.06)';
              }}
            >
              <div style={styles.cardIcon}> {/* Removed specific iconStyle here */}
                {item.icon}
              </div>
              <h3 style={styles.cardTitle}>{item.title}</h3>
              <p style={styles.cardDescription}>{item.description}</p>
              <button
                style={styles.cardButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.3)';
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(item.route);
                }}
              >
                {item.buttonText}
                <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add mobile responsive styles */}
      <style jsx>{`
        @media (min-width: 769px) { 
          .cards-grid {
            grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .cards-grid {
            grid-template-columns: 1fr !important; 
            gap: 1.5rem !important;
          }
          
          .title {
            font-size: 2.5rem !important;
          }
          
          .subtitle {
            font-size: 1.1rem !important;
          }
          
          .card {
            padding: 2rem !important;
          }
          
          .max-width-container { /* Use the class name for media query */
            padding: 0 20px !important;
          }
        }
        
        @media (max-width: 480px) {
          .container {
            padding: 100px 0 60px !important;
          }
          
          .title {
            font-size: 2rem !important;
          }
          
          .card-icon {
            width: 60px !important;
            height: 60px !important;
            font-size: 24px !important;
          }
        }
      `}</style>
    </div>
  );
}