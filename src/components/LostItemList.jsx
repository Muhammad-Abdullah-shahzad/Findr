import React, { useEffect, useState } from 'react';
import { HeartIcon, Heart, MessageCircle, Search, Calendar, MapPin, User, Phone, Clock, Package, Filter, Zap, X, Info, Award, HelpCircle } from 'lucide-react';
import { FaHeart } from "react-icons/fa";

const API_BASE = 'http://localhost:5000/api';

const LostItemsList = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE}/lost-items?search=${encodeURIComponent(search)}&range=${encodeURIComponent(dateRange)}`
        );
        const data = await response.json();
        if (Array.isArray(data)) setItems(data);
        else if (data?.recordset) setItems(data.recordset);
        else setItems([]);
      } catch (err) {
        console.error('Fetch error:', err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [search, dateRange]);

  const handleLike = async (itemId) => {
    try {
      const result = await fetch(`${API_BASE}/likes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, userId: parseInt(localStorage.uID) }),
      });
      const response = await result.json();
      if (response.message === 'Already liked') {
        return;
      }
      setItems(prev =>
        prev.map(i =>
          i.id === itemId ? { ...i, likesCount: (i.likesCount || 0) + 1 } : i
        )
      );
    } catch (error) {
      console.error('Failed to like item:', error);
    }
  };

  const handleComment = async (itemId) => {
    const text = prompt('Share your thoughts or tips to help find this item:');
    if (!text) return;
    try {
      await fetch(`${API_BASE}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, userId: parseInt(localStorage.uID), commentText: text }),
      });
      setItems(prev =>
        prev.map(i =>
          i.id === itemId ? { ...i, noOfComments: (i.noOfComments || 0) + 1 } : i
        )
      );
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const grouped = Array.isArray(items)
    ? items.reduce((acc, item) => {
      const category = item.categoryName || 'Uncategorized';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {})
    : {};

  const styles = {
    container: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      lineHeight: '1.6',
      color: '#0f172a',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)',
      minHeight: '100vh',
      padding: '2rem 0'
    },
    maxWidth: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px'
    },
    header: {
      textAlign: 'center',
      marginBottom: '4rem',
      position: 'relative'
    },
    headerBackground: {
      position: 'absolute',
      top: '-50px',
      left: 0,
      right: 0,
      bottom: 0,
      background: 'radial-gradient(circle at 30% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
      zIndex: -1
    },
    headerIcon: {
      width: '80px',
      height: '80px',
      margin: '0 auto 1.5rem',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      color: 'white',
      boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)'
    },
    headerContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: '3.5rem',
      fontWeight: '800',
      marginBottom: '1rem',
      color: '#0f172a',
      letterSpacing: '-0.02em',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      display: 'block'
    },
    headerSubtitle: {
      fontSize: '1.3rem',
      color: '#64748b',
      marginBottom: '3rem',
      maxWidth: '650px',
      marginLeft: 'auto',
      marginRight: 'auto',
      lineHeight: '1.7'
    },
    statsContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '24px',
      marginBottom: '2rem'
    },
    statItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#fff',
      fontSize: '0.875rem',
      fontWeight: '500',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef)',
      padding: "8px 16px",
      borderRadius: "12px",
      fontWeight: '600',
      boxShadow: '0 4px 15px rgba(99, 102, 241, 0.2)'
    },

    // Search Section
    searchSection: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      padding: '24px 32px',
      borderRadius: '24px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.06)',
      border: '1px solid rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      gap: '16px',
      alignItems: 'center',
      marginBottom: '3rem',
      flexWrap: 'wrap', // Allow wrapping on smaller screens
      justifyContent: 'center' // Center items when wrapped
    },
    searchContainer: {
      flex: 2,
      minWidth: '300px',
      position: 'relative',
    },
    searchInputWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    searchIcon: {
      position: 'absolute',
      left: '16px',
      color: '#94a3b8',
      zIndex: 1,
    },
    searchInput: {
      width: '100%',
      padding: '1rem 1.25rem 1rem 3rem', // Increased left padding for icon
      borderRadius: '12px',
      border: '2px solid rgba(203, 213, 225, 0.5)',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(5px)',
      outline: 'none',
      boxSizing: 'border-box',
      fontWeight: '400',
    },
    clearButton: {
      position: 'absolute',
      right: '12px',
      background: 'none',
      border: 'none',
      color: '#94a3b8',
      cursor: 'pointer',
      padding: '4px',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'color 0.2s ease',
      fontSize: '0.875rem' // Match input font size
    },
    filterContainer: {
      flex: 1,
      minWidth: '200px',
      position: 'relative',
    },
    filterWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    filterIcon: {
      position: 'absolute',
      left: '16px',
      color: '#94a3b8',
      zIndex: 1,
    },
    filterSelect: {
      width: '100%',
      padding: '1rem 1.25rem 1rem 3rem', // Increased left padding for icon
      borderRadius: '12px',
      border: '2px solid rgba(203, 213, 225, 0.5)',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(5px)',
      outline: 'none',
      cursor: 'pointer',
      boxSizing: 'border-box',
      fontWeight: '400',
      appearance: 'none', // Remove default select arrow
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='%2394a3b8' class='w-6 h-6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 1rem center',
      backgroundSize: '1.5em'
    },

    // Main Content
    mainContent: {
      padding: '0 20px', // Adjusted to align with maxWidth padding
      maxWidth: '1200px',
      margin: '0 auto',
    },

    // Loading State
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 20px',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 0.8)',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.06)',
      backdropFilter: 'blur(10px)',
      textAlign: 'center',
      minHeight: '400px'
    },
    loadingSpinner: {
      marginBottom: '24px',
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: '4px solid rgba(99, 102, 241, 0.3)',
      borderTop: '4px solid #6366f1',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    loadingTitle: {
      fontSize: '1.8rem',
      color: '#0f172a',
      margin: '0 0 8px 0',
      fontWeight: '700',
    },
    loadingText: {
      color: '#64748b',
      fontSize: '1.1rem',
      margin: 0,
    },

    // Empty State
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 20px',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 0.8)',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.06)',
      backdropFilter: 'blur(10px)',
      textAlign: 'center',
      minHeight: '400px'
    },
    emptyIcon: {
      color: '#cbd5e1',
      marginBottom: '24px',
      width: '80px',
      height: '80px',
    },
    emptyTitle: {
      fontSize: '1.8rem',
      color: '#0f172a',
      margin: '0 0 8px 0',
      fontWeight: '700',
    },
    emptyText: {
      color: '#64748b',
      fontSize: '1.1rem',
      margin: 0,
      maxWidth: '400px',
      lineHeight: '1.7'
    },

    // Category Section
    categorySection: {
      marginBottom: '40px',
    },
    categoryHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px',
      paddingBottom: '12px',
      borderBottom: '2px solid rgba(203, 213, 225, 0.5)',
      // Added a gradient for a more modern feel
      background: 'linear-gradient(to right, rgba(99, 102, 241, 0.1), transparent)',
      borderRadius: '8px 8px 0 0',
      padding: '1rem 1.5rem',
      border: 'none',
      marginBottom: '1.5rem'
    },
    categoryTitle: {
      fontSize: '1.7rem',
      fontWeight: '700',
      color: '#0f172a',
      margin: 0,
      textTransform: 'capitalize'
    },
    categoryBadge: {
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      color: '#6366f1',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '0.9rem',
      fontWeight: '600',
      border: '1px solid rgba(99, 102, 241, 0.2)'
    },

    // Items Grid
    itemsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '2rem', // Increased gap for better spacing
    },

    // Item Card
    itemCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '24px', // More rounded corners
      border: '1px solid rgba(255, 255, 255, 0.8)',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.06)',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      flexDirection: 'column'
    },
    cardHover: {
      transform: 'translateY(-8px)',
      boxShadow: '0 15px 50px rgba(0, 0, 0, 0.1)',
      borderColor: '#6366f1', // Highlight border on hover
    },
    cardHeader: {
      position: 'relative',
      height: '220px', // Fixed height for image container
      overflow: 'hidden',
    },
    cardImageContainer: {
      width: '100%',
      height: '100%',
    },
    cardImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.5s ease',
    },
    statusBadge: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      backgroundColor: '#ef4444', // Red for lost
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '16px',
      fontSize: '0.8rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '0.3rem',
      boxShadow: '0 4px 10px rgba(239, 68, 68, 0.3)'
    },
    cardBody: {
      padding: '1.5rem',
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    itemTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#0f172a',
      margin: '0 0 0.5rem 0',
      textTransform: 'capitalize',
    },
    itemDescription: {
      fontSize: '0.95rem',
      color: '#64748b',
      margin: '0 0 1.5rem 0',
      lineHeight: '1.6',
      fontStyle: 'italic',
      flexGrow: 1, // Allows description to take available space
    },
    itemDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      marginBottom: '1.5rem'
    },
    detailRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    },
    detailIcon: {
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      color: '#6366f1',
      padding: '0.5rem',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    detailText: {
      fontSize: '0.9rem',
      color: '#374151',
      fontWeight: '500',
    },

    // Card Actions
    cardActions: {
      display: 'flex',
      padding: '1rem 1.5rem',
      gap: '1rem',
      borderTop: '1px solid rgba(203, 213, 225, 0.5)',
      backgroundColor: 'rgba(241, 245, 249, 0.6)', // Lighter background for actions
    },
    actionButton: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1rem',
      border: '2px solid rgba(203, 213, 225, 0.5)',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '600',
      backgroundColor: 'white',
      color: '#374151',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
    },
    actionButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 15px rgba(99, 102, 241, 0.2)',
      borderColor: '#6366f1',
      color: '#6366f1',
    },
    likedButton: {
      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
      color: 'white',
      border: 'none',
      boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
    },
    commentButtonHover: {
      borderColor: '#10b981',
      color: '#10b981',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        {/* Header Section */}
        <div style={styles.header}>
          <div style={styles.headerBackground}></div> {/* Background for gradient effect */}
          <div style={styles.headerContent}>
            {/* <div style={styles.headerIcon}>
              <Package size={36} />
            </div> */}
            <h1 style={styles.headerTitle}>Lost Items Directory</h1>
            <p style={styles.headerSubtitle}>
              Help reunite people with their lost belongings by Browse reported items or adding a new report.
            </p>
            <div style={styles.statsContainer}>
              <div style={styles.statItem}>
                <Zap size={16} />
                <span>{items.length} Items Listed</span>
              </div>
              <div style={styles.statItem}>
                <Clock size={16} />
                <span>Real-time Updates</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div style={{ ...styles.searchSection, margin: '2rem auto' }}>
          <div style={styles.searchContainer}>
            <div style={styles.searchInputWrapper}>
              <Search size={20} style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search by item name, location, or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.searchInput}
                // onFocus={(e) => e.target.style.borderColor = styles.searchInputFocused.borderColor}
                // onBlur={(e) => e.target.style.borderColor = styles.searchInput.borderColor}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  style={styles.clearButton}
                  onMouseEnter={(e) => e.target.style.color = '#dc2626'}
                  onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div style={styles.filterContainer}>
            <div style={styles.filterWrapper}>
              <Filter size={20} style={styles.filterIcon} />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                style={styles.filterSelect}
                // onFocus={(e) => e.target.style.borderColor = styles.searchInputFocused.borderColor}
                // onBlur={(e) => e.target.style.borderColor = styles.searchInput.borderColor}
              >
                <option value="">All Time</option>
                <option value="24h">Last 24 Hours</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.mainContent}>
          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.loadingSpinner}>
                <div style={styles.spinner}></div>
              </div>
              <h3 style={styles.loadingTitle}>Searching for Lost Items...</h3>
              <p style={styles.loadingText}>Please wait while we retrieve the latest listings.</p>
            </div>
          ) : Object.keys(grouped).length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <Package size={64} />
              </div>
              <h3 style={styles.emptyTitle}>No Items Found</h3>
              <p style={styles.emptyText}>
                {search || dateRange
                  ? "Try adjusting your search criteria or date filter, or broaden your search."
                  : "No lost items have been reported yet. Be the first to report if you've lost something!"}
              </p>
            </div>
          ) : (
            Object.entries(grouped).map(([category, itemsInCategory]) => (
              <div key={category} style={styles.categorySection}>
                <div style={styles.categoryHeader}>
                  <h2 style={styles.categoryTitle}>{category}</h2>
                  <div style={styles.categoryBadge}>
                    {itemsInCategory.length} items
                  </div>
                </div>

                <div style={styles.itemsGrid}>
                  {itemsInCategory.map((item) => (
                    <div
                      key={item.id}
                      style={styles.itemCard}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = styles.cardHover.transform;
                        e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
                        e.currentTarget.style.borderColor = styles.cardHover.borderColor;
                        e.currentTarget.querySelector('img').style.transform = styles.cardImage.transition.includes('scale') ? 'scale(1.05)' : 'none'; // Apply scale if transition exists
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = styles.itemCard.boxShadow;
                        e.currentTarget.style.borderColor = styles.itemCard.border;
                        e.currentTarget.querySelector('img').style.transform = 'none';
                      }}
                    >
                      <div style={styles.cardHeader}>
                        <div style={styles.cardImageContainer}>
                          <img
                            src={item.image || '/no-image.png'}
                            alt={item.itemName}
                            style={styles.cardImage}
                            onError={(e) => {
                              e.target.src = '/no-image.png';
                            }}
                          />
                        </div>
                        <div style={styles.statusBadge}>
                          <Package size={12} />
                          <span>Lost</span>
                        </div>
                      </div>

                      <div style={styles.cardBody}>
                        <h3 style={styles.itemTitle}>{item.itemName}</h3>
                        <p style={styles.itemDescription}>{item.description}</p>

                        <div style={styles.itemDetails}>
                          <div style={styles.detailRow}>
                            <div style={styles.detailIcon}>
                              <User size={16} />
                            </div>
                            <span style={styles.detailText}>
                              {item.firstName} {item.lastName}
                            </span>
                          </div>

                          <div style={styles.detailRow}>
                            <div style={styles.detailIcon}>
                              <MapPin size={16} />
                            </div>
                            <span style={styles.detailText}>{item.location}</span>
                          </div>

                          <div style={styles.detailRow}>
                            <div style={styles.detailIcon}>
                              <Phone size={16} />
                            </div>
                            <span style={styles.detailText}>{item.contactInfo}</span>
                          </div>

                          <div style={styles.detailRow}>
                            <div style={styles.detailIcon}>
                              <Calendar size={16} />
                            </div>
                            <span style={styles.detailText}>
                              {new Date(item.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={styles.cardActions}>
                        <button
                          onClick={() => handleLike(item.id)}
                          style={{ ...styles.actionButton, ...(item.likedByUser ? styles.likedButton : {}) }}
                          onMouseEnter={(e) => {
                            if (!item.likedByUser) {
                              e.currentTarget.style.transform = styles.actionButtonHover.transform;
                              e.currentTarget.style.boxShadow = styles.actionButtonHover.boxShadow;
                              e.currentTarget.style.borderColor = '#6366f1';
                              e.currentTarget.style.color = '#6366f1';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!item.likedByUser) {
                              e.currentTarget.style.transform = 'none';
                              e.currentTarget.style.boxShadow = 'none';
                              e.currentTarget.style.borderColor = styles.actionButton.border.split(' ')[2];
                              e.currentTarget.style.color = styles.actionButton.color;
                            }
                          }}
                        >
                          <FaHeart size={16} style={{ color: item.likedByUser ? 'white' : '#ef4444' }} />
                          <span style={{ color: item.likedByUser ? 'white' : styles.actionButton.color, fontWeight: '600' }}>{item.likesCount || 0}</span>
                        </button>

                        <button
                          onClick={() => handleComment(item.id)}
                          style={styles.actionButton}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = styles.actionButtonHover.transform;
                            e.currentTarget.style.boxShadow = styles.actionButtonHover.boxShadow;
                            e.currentTarget.style.borderColor = '#10b981';
                            e.currentTarget.style.color = '#10b981';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'none';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.borderColor = styles.actionButton.border.split(' ')[2];
                            e.currentTarget.style.color = styles.actionButton.color;
                          }}
                        >
                          <MessageCircle size={16} />
                          <span>{item.noOfComments || 0}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LostItemsList;