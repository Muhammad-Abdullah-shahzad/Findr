import React, { useState, useEffect } from 'react';
import {
    MapPin,
    AlertCircle,
    Check,
    Smartphone,
    Shirt,
    Briefcase,
    HelpCircle,
    FileText,
    Award,
    Info,
    BellRing, // For notifications
    Search, // For lost items
    Box, // For found items
    MessageSquareText, // For claim requests
    LayoutDashboard, // For the main dashboard overview
    User, // For profile
    LifeBuoy, // For help & support
    GitCompare, // For match results
    MessageSquare, // For chat
    ArrowRight
} from 'lucide-react';
import ChatComponent from './ChatComponent'; // Import the ChatComponent

const UserDashboard = () => {
    const [lostItems, setLostItems] = useState([]);
    const [foundItems, setFoundItems] = useState([]);
    const [claimRequests, setClaimRequests] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [matchResults, setMatchResults] = useState([]);
    const [fetchingMatches, setFetchingMatches] = useState(false);
    const [showChat, setShowChat] = useState(false); // New state for showing chat
    const [chatWithUser, setChatWithUser] = useState(null); // New state to store chat recipient's data
    const [conversations, setConversations] = useState([]); // New state for list of conversations

    const API_BASE_URL = 'https://findr-api-server.azurewebsites.net'; // Define API base URL here

    const styles = {
        container: {
            fontFamily: "'Inter', sans-serif",
            lineHeight: '1.6',
            color: '#334155',
            background: '#f8fafc',
            minHeight: '100vh',
            padding: '0',
            display: 'flex',
        },
        dashboardWrapper: {
            display: 'flex',
            width: '100%',
            maxWidth: '100%',
            gap: '0',
            '@media (max-width: 1024px)': {
                flexDirection: 'column',
            }
        },
        sidebar: {
            width: '25%',
            minWidth: '250px',
            maxWidth: '300px',
            flexShrink: 0,
            background: '#1e293b',
            borderRadius: '0rem 1rem 1rem 0rem',
            padding: '1.5rem',
            boxShadow: '0 8px 20px 0 rgba(0, 0, 0, 0.15)',
            position: 'sticky',
            top: '0',
            height: '100vh',
            overflowY: 'auto',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            '@media (max-width: 1024px)': {
                width: '100%',
                maxWidth: 'none',
                minWidth: 'unset',
                position: 'static',
                height: 'auto',
                borderRadius: '0.75rem',
                marginBottom: '1rem',
                padding: '1rem',
            }
        },
        sidebarHeader: {
            fontSize: '1.8rem',
            fontWeight: '700',
            marginBottom: '2rem',
            color: '#fff',
            textAlign: 'left',
            paddingBottom: '1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
            width: '100%',
        },
        sidebarNav: {
            listStyle: 'none',
            padding: 0,
            margin: 0,
            width: '100%'
        },
        sidebarNavLink: {
            display: 'flex',
            alignItems: 'center',
            padding: '0.8rem 1.2rem',
            borderRadius: '0.75rem',
            color: 'rgba(255, 255, 255, 0.8)',
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'background 0.3s ease, color 0.3s ease, transform 0.2s ease',
            marginBottom: '0.5rem',
            width: '100%',
            cursor: 'pointer',
            ':hover': {
                background: 'rgba(79, 70, 229, 0.15)',
                color: '#fff',
                transform: 'translateX(5px)',
            }
        },
        sidebarNavLinkActive: {
            background: 'linear-gradient(45deg, #4F46E5, #7C3AED)',
            color: '#fff',
            boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)',
        },
        sidebarNavIcon: {
            marginRight: '0.75rem',
            width: '20px',
            height: '20px',
        },
        mainContent: {
            flexGrow: 1,
            width: '75%',
            padding: '2rem',
            '@media (max-width: 1024px)': {
                width: '100%',
                padding: '1rem',
            }
        },
        header: {
            textAlign: 'left',
            marginBottom: '2rem',
        },
        title: {
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '0.5rem',
            color: '#1e293b',
            letterSpacing: '-0.02em'
        },
        subtitle: {
            fontSize: '1.1rem',
            color: '#64748b',
            lineHeight: '1.7'
        },
        card: {
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '1.8rem',
            borderRadius: '16px',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.04)',
            border: '1px solid #f1f5f9',
            marginBottom: '1.5rem',
            transition: 'all 0.3s ease-out',
            backdropFilter: 'blur(3px)',
            ':hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)',
            }
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
        },
        statCard: {
            background: 'linear-gradient(45deg, #4F46E5, #7C3AED)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: '0 6px 18px rgba(79, 70, 229, 0.2)',
            transition: 'all 0.3s ease-out',
            ':hover': {
                transform: 'translateY(-3px) scale(1.01)',
                boxShadow: '0 10px 25px rgba(79, 70, 229, 0.3)',
            }
        },
        statCardIcon: {
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '0.5rem',
            padding: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50px',
            height: '50px',
            flexShrink: 0
        },
        statCardContent: {
            flexGrow: 1,
            textAlign: 'right'
        },
        statCardTitle: {
            fontSize: '0.9rem',
            opacity: 0.9,
            marginBottom: '0.2rem'
        },
        statCardValue: {
            fontSize: '1.8rem',
            fontWeight: '700'
        },
        sectionTitle: {
            fontSize: '2rem',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '1.5rem',
            marginTop: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid #e2e8f0'
        },
        list: {
            listStyle: 'none',
            padding: '0',
            margin: '0'
        },
        listItem: {
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            marginBottom: '0.75rem',
            padding: '1rem 1.5rem',
            borderRadius: '0.75rem',
            lineHeight: '1.5',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem',
            fontSize: '0.95rem',
            ':hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.06)'
            }
        },
        listItemStrong: {
            color: '#1e293b',
            fontSize: '1.05em',
            fontWeight: '600'
        },
        noDataMessage: {
            color: '#64748b',
            textAlign: 'center',
            padding: '1.5rem',
            background: '#f1f5f9',
            border: '1px dashed #cbd5e1',
            borderRadius: '0.75rem',
            marginTop: '1rem',
            fontSize: '1rem',
            fontStyle: 'italic'
        },
        notificationBox: {
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '1.8rem',
            borderRadius: '16px',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.04)',
            border: '1px solid #f1f5f9',
            marginBottom: '1.5rem',
            backdropFilter: 'blur(3px)',
            transition: 'all 0.3s ease-out',
            ':hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)',
            }
        },
        notificationHeader: {
            color: '#1e293b',
            marginBottom: '1rem',
            fontSize: '1.6rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid #e2e8f0'
        },
        notificationItem: {
            marginBottom: '0.05rem',
            color: '#475569',
            padding: '1rem',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            transition: 'all 0.2s ease-in-out',
            ':hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
            }
        },
        readNotificationItem: {
            backgroundColor: '#e2e8f0',
            color: '#94a3b8',
            textDecoration: 'line-through',
            border: '1px solid #cbd5e1',
            ':hover': {
                backgroundColor: '#e2e8f0',
                boxShadow: 'none',
                transform: 'none',
                cursor: 'not-allowed',
            }
        },
        markAsReadButton: {
            background: 'linear-gradient(45deg, #66bb6a, #43a047)',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.85em',
            marginLeft: '10px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            fontWeight: '500',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            ':hover': {
                transform: 'translateY(-1px) scale(1.02)',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                filter: 'brightness(1.1)',
            }
        },
        markAsReadButtonRead: {
            background: '#cbd5e1',
            cursor: 'not-allowed',
            boxShadow: 'none',
            transform: 'none',
            ':hover': {
                background: '#cbd5e1',
                cursor: 'not-allowed',
                boxShadow: 'none',
                transform: 'none'
            }
        },
        notificationTimestamp: {
            fontSize: '0.75em',
            color: '#94a3b8',
            marginTop: '5px',
            fontStyle: 'italic'
        },
        statusPending: {
            color: '#f97316',
            fontWeight: 'bold',
            backgroundColor: 'rgba(249, 115, 22, 0.1)',
            padding: '0.3em 0.6em',
            borderRadius: '4px',
            fontSize: '0.85em'
        },
        statusApproved: {
            color: '#22c55e',
            fontWeight: 'bold',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            padding: '0.3em 0.6em',
            borderRadius: '4px',
            fontSize: '0.85em'
        },
        statusRejected: {
            color: '#ef4444',
            fontWeight: 'bold',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            padding: '0.3em 0.6em',
            borderRadius: '4px',
            fontSize: '0.85em'
        },
        infoText: {
            color: '#64748b',
            fontSize: '0.9rem',
            lineHeight: '1.5'
        },
        findMatchButton: {
            background: 'linear-gradient(45deg, #4F46E5, #7C3AED)',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.9em',
            marginTop: '10px',
            fontWeight: '500',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            ':hover': {
                transform: 'translateY(-1px) scale(1.02)',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                filter: 'brightness(1.1)',
            }
        },
        matchItemContainer: {
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem', // Increased gap for better spacing
            marginBottom: '1rem',
            padding: '1.5rem', // Increased padding
            border: '1px solid #e2e8f0',
            borderRadius: '0.75rem',
            background: '#fff',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)', // More pronounced shadow
            transition: 'all 0.3s ease-out', // Ensure smooth transition for hover effect
        },
        matchScore: {
            fontSize: '1.1em',
            fontWeight: '600',
            color: '#4F46E5',
        },
        foundItemImage: {
            width: '100%',
            maxWidth: '200px',
            height: 'auto',
            borderRadius: '0.5rem',
            marginBottom: '0.5rem',
            objectFit: 'cover',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', // Added shadow to the image
            transition: 'transform 0.3s ease', // Smooth transition for image hover
            ':hover': {
                transform: 'scale(1.03)', // Slight zoom on hover
            }
        },
        '@media (max-width: 1024px)': {
            sidebar: {
                width: '100%',
                maxWidth: 'none',
                minWidth: 'unset',
                position: 'static',
                height: 'auto',
                borderRadius: '0.75rem',
                marginBottom: '1rem',
                padding: '1rem',
            },
            mainContent: {
                width: '100%',
                padding: '1rem',
            },
            header: {
                textAlign: 'center',
            },
            title: {
                fontSize: '2rem',
            },
            subtitle: {
                fontSize: '1rem',
            },
            statsGrid: {
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '1rem',
            },
            sectionTitle: {
                fontSize: '1.5rem',
            },
            notificationHeader: {
                fontSize: '1.4rem',
            },
            listItem: {
                padding: '1rem',
            },
        },
        '@media (max-width: 768px)': {
            statsGrid: {
                gridTemplateColumns: '1fr',
            },
        },
    };

    useEffect(() => {
        const storedUserId = localStorage.getItem('uID');
        if (storedUserId) {
            const parsedUserId = parseInt(storedUserId, 10);
            setCurrentUserId(parsedUserId);
            console.log("Dashboard: currentUserId set to", parsedUserId);
        } else {
            setError("User ID not found in localStorage. Please log in.");
            setLoading(false);
            console.error("Dashboard: User ID not found in localStorage.");
        }
    }, []);

    const fetchNotifications = async (userId) => {
        if (!userId) {
            console.log("fetchNotifications: userId is null or undefined, skipping fetch.");
            return;
        }

        try {
            console.log(`fetchNotifications: Attempting to fetch notifications for user ${userId}`);
            const response = await fetch(`http://localhost:5000/api/notifications?uID=${userId}`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Unknown server error' }));
                throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message}`);
            }
            const data = await response.json();
            const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setNotifications(sortedData);
            console.log("fetchNotifications: Notifications fetched successfully:", sortedData);
        } catch (err) {
            console.error("fetchNotifications: Error fetching notifications:", err);
        }
    };

    const markNotificationAsRead = async (notificationId) => {
        if (!currentUserId || isNaN(notificationId)) return;

        try {
            console.log(`markNotificationAsRead: Marking notification ${notificationId} as read for user ${currentUserId}`);
            const response = await fetch(`http://localhost:5000/api/notifications/${notificationId}?uID=${currentUserId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message}`);
            }

            setNotifications(prevNotifications => {
                const updatedNotifications = prevNotifications.map(n =>
                    n.id === notificationId ? { ...n, isRead: true } : n
                ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                console.log(`markNotificationAsRead: Notification ${notificationId} marked as read. New state:`, updatedNotifications);
                return updatedNotifications;
            });
        } catch (err) {
            console.error("markNotificationAsRead: Failed to mark notification as read:", err);
        }
    };

    const fetchMatchResults = async (lostItemId) => {
        setFetchingMatches(true);
        setMatchResults([]); // Clear previous results
        try {
            console.log(`fetchMatchResults: Fetching match results for lost item ${lostItemId}`);
            const response = await fetch(`http://localhost:5000/api/matches/best-match?lostItemId=${lostItemId}`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Unknown server error' }));
                throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message}`);
            }
            const data = await response.json();
            setMatchResults(data.matches);
            setActiveSection('matchResults'); // Switch to match results section
            console.log("fetchMatchResults: Match results fetched successfully:", data.matches);
        } catch (err) {
            console.error("fetchMatchResults: Failed to fetch match results:", err);
            setError(`Failed to load match results: ${err.message}`);
        } finally {
            setFetchingMatches(false);
        }
    };

    const fetchDashboardDataAndNotifications = async () => {
        if (!currentUserId) {
            console.log("fetchDashboardDataAndNotifications: currentUserId is null or undefined, skipping fetch.");
            return;
        }
        setLoading(true);
        try {
            console.log(`fetchDashboardDataAndNotifications: Fetching dashboard data for user ${currentUserId}`);
            const dashboardResponse = await fetch(`http://localhost:5000/user/dashboard?userId=${currentUserId}`);
            if (!dashboardResponse.ok) {
                const errorData = await dashboardResponse.json().catch(() => ({ message: 'Unknown server error' }));
                throw new Error(`HTTP error! Status: ${dashboardResponse.status} - ${errorData.message}`);
            }
            const dashboardData = await dashboardResponse.json();
            setLostItems(dashboardData.myLostItems);
            setFoundItems(dashboardData.myFoundItems);
            setClaimRequests(dashboardData.myClaimRequests);

            await fetchNotifications(currentUserId);
            console.log("fetchDashboardDataAndNotifications: Dashboard data fetched successfully:", dashboardData);

        } catch (err) {
            console.error("fetchDashboardDataAndNotifications: Failed to fetch dashboard data or initial notifications:", err);
            setError(`Failed to load dashboard data: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const fetchConversations = async () => {
        if (!currentUserId) {
            console.log("fetchConversations: currentUserId is null or undefined, skipping fetch.");
            return;
        }
        try {
            console.log(`fetchConversations: Attempting to fetch conversations for user ${currentUserId}`);
            const response = await fetch(`${API_BASE_URL}/api/chat/conversations?userId=${currentUserId}`);
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to fetch conversations');
            }
            const data = await response.json();
            setConversations(data);
            console.log("fetchConversations: Conversations fetched successfully:", data);
        } catch (err) {
            console.error('fetchConversations: Error fetching conversations:', err);
            setError(`Error loading conversations: ${err.message}`);
        }
    };

    useEffect(() => {
        if (currentUserId) {
            console.log("Dashboard main useEffect: currentUserId available, fetching dashboard data and notifications.");
            fetchDashboardDataAndNotifications();

            const pollingInterval = setInterval(() => {
                console.log("Dashboard polling for notifications...");
                fetchNotifications(currentUserId);
            }, 30000);

            return () => clearInterval(pollingInterval);
        } else {
            console.log("Dashboard main useEffect: currentUserId not yet available.");
        }

    }, [currentUserId]);

    useEffect(() => {
        console.log(`Dashboard chat useEffect: activeSection=${activeSection}, showChat=${showChat}, currentUserId=${currentUserId}`);
        if (activeSection === 'chat' && !showChat && currentUserId) {
            console.log("Dashboard chat useEffect: Conditions met, fetching conversations...");
            fetchConversations();
            const pollingConversations = setInterval(() => {
                console.log("Dashboard polling for conversations...");
                fetchConversations();
            }, 10000); // Poll for conversations every 10 seconds
            return () => clearInterval(pollingConversations);
        } else if (activeSection === 'chat' && showChat) {
            console.log("Dashboard chat useEffect: Chat component is currently active, skipping conversation list fetch.");
        } else if (activeSection !== 'chat') {
            console.log("Dashboard chat useEffect: Not in chat section, skipping conversation list fetch.");
        }
    }, [activeSection, showChat, currentUserId]);

    const handleChatInitiate = (user) => {
        console.log("handleChatInitiate: Initiating chat with user:", user);
        setChatWithUser(user);
        setShowChat(true);
        setActiveSection('chat'); // Automatically switch to chat section
    };

    const getStatusStyle = (status) => {
        if (!status) return {};
        switch (status.toLowerCase()) {
            case 'pending':
                return styles.statusPending;
            case 'approved':
                return styles.statusApproved;
            case 'rejected':
                return styles.statusRejected;
            default:
                return {};
        }
    };

    const unreadNotifications = notifications.filter(note => note.isRead === false);
    const readNotifications = notifications.filter(note => note.isRead === true);

    if (loading) {
        return (
            <div style={{
                ...styles.container,
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '1.5rem',
                color: '#64748b'
            }}>
                <span className="spinner" style={{ marginRight: '0.5rem', border: '4px solid rgba(0, 0, 0, 0.1)', borderTop: '4px solid #4F46E5', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite' }}></span>
                Loading dashboard...
                <style jsx>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ ...styles.container, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <AlertCircle size={50} color="#ef4444" />
                <p style={{ color: '#ef4444', textAlign: 'center', marginTop: '1rem', fontSize: '1.2rem', fontWeight: '600' }}>{error}</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <style jsx>{`
                .hover-effect:hover {
                    transform: translateY(-5px) scale(1.01);
                    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
                }

                .sidebar-link-hoverable:hover {
                    background: rgba(79, 70, 229, 0.15) !important;
                    color: #fff !important;
                    transform: translateX(5px) !important;
                }

                .read-notification-item-hover-override:hover {
                    background-color: #e2e8f0 !important;
                    box-shadow: none !important;
                    transform: none !important;
                    cursor: 'not-allowed' !important;
                }

                .mark-as-read-btn-hoverable:hover {
                    transform: translateY(-1px) scale(1.02) !important;
                    boxShado: 0 4px 10px rgba(0, 0, 0, 0.2) !important;
                    filter: brightness(1.1) !important;
                }

                .mark-as-read-btn-disabled-hover-override:hover {
                    background: #cbd5e1 !important;
                    cursor: 'not-allowed' !important;
                    box-shadow: none !important;
                    transform: none !important;
                }
            `}</style>

            <div style={styles.dashboardWrapper}>
                {/* Sidebar */}
                <aside style={styles.sidebar}>
                    <h2 style={styles.sidebarHeader}>Findr Dashboard</h2>
                    <ul style={styles.sidebarNav}>
                        <li>
                            <div
                                style={{ ...styles.sidebarNavLink, ...(activeSection === 'dashboard' ? styles.sidebarNavLinkActive : {}) }}
                                onClick={() => setActiveSection('dashboard')}
                                className="sidebar-link-hoverable"
                            >
                                <LayoutDashboard size={20} style={styles.sidebarNavIcon} />
                                Dashboard
                            </div>
                        </li>
                        <li>
                            <div
                                style={{ ...styles.sidebarNavLink, ...(activeSection === 'myLostItems' ? styles.sidebarNavLinkActive : {}) }}
                                onClick={() => setActiveSection('myLostItems')}
                                className="sidebar-link-hoverable"
                            >
                                <Search size={20} style={styles.sidebarNavIcon} />
                                My Lost Items
                            </div>
                        </li>
                        <li>
                            <div
                                style={{ ...styles.sidebarNavLink, ...(activeSection === 'myFoundItems' ? styles.sidebarNavLinkActive : {}) }}
                                onClick={() => setActiveSection('myFoundItems')}
                                className="sidebar-link-hoverable"
                            >
                                <Box size={20} style={styles.sidebarNavIcon} />
                                My Found Items
                            </div>
                        </li>
                        <li>
                            <div
                                style={{ ...styles.sidebarNavLink, ...(activeSection === 'claimRequests' ? styles.sidebarNavLinkActive : {}) }}
                                onClick={() => setActiveSection('claimRequests')}
                                className="sidebar-link-hoverable"
                            >
                                <MessageSquareText size={20} style={styles.sidebarNavIcon} />
                                Claim Requests
                            </div>
                        </li>
                        <li>
                            <div
                                style={{ ...styles.sidebarNavLink, ...(activeSection === 'notifications' ? styles.sidebarNavLinkActive : {}) }}
                                onClick={() => setActiveSection('notifications')}
                                className="sidebar-link-hoverable"
                            >
                                <BellRing size={20} style={styles.sidebarNavIcon} />
                                Notifications
                            </div>
                        </li>
                        <li>
                            <div
                                style={{ ...styles.sidebarNavLink, ...(activeSection === 'matchResults' ? styles.sidebarNavLinkActive : {}) }}
                                onClick={() => setActiveSection('matchResults')}
                                className="sidebar-link-hoverable"
                            >
                                <GitCompare size={20} style={styles.sidebarNavIcon} />
                                See Match Results
                            </div>
                        </li>
                        {/* Account Pages Section */}
                        <li style={{ marginTop: '1.5rem', opacity: 0.7, fontSize: '0.9rem', color: '#fff' }}>Account Pages</li>
                        <li>
                            <div
                                style={{ ...styles.sidebarNavLink, ...(activeSection === 'profile' ? styles.sidebarNavLinkActive : {}) }}
                                onClick={() => setActiveSection('profile')}
                                className="sidebar-link-hoverable"
                            >
                                <User size={20} style={styles.sidebarNavIcon} />
                                Profile
                            </div>
                        </li>
                        <li>
                            <div
                                style={{ ...styles.sidebarNavLink, ...(activeSection === 'helpSupport' ? styles.sidebarNavLinkActive : {}) }}
                                onClick={() => setActiveSection('helpSupport')}
                                className="sidebar-link-hoverable"
                            >
                                <LifeBuoy size={20} style={styles.sidebarNavIcon} />
                                Help & Support
                            </div>
                        </li>
                        <li>
                            <div
                                style={{ ...styles.sidebarNavLink, ...(activeSection === 'chat' ? styles.sidebarNavLinkActive : {}) }}
                                onClick={() => { setActiveSection('chat'); setShowChat(false); setChatWithUser(null); }}
                                className="sidebar-link-hoverable"
                            >
                                <MessageSquare size={20} style={styles.sidebarNavIcon} />
                                Chat
                            </div>
                        </li>
                    </ul>
                </aside>

                {/* Main Dashboard Content */}
                <main style={styles.mainContent}>
                    {activeSection === 'chat' ? (
                        showChat && chatWithUser ? (
                            <ChatComponent
                                currentUserId={currentUserId}
                                otherUser={chatWithUser}
                                onBack={() => setShowChat(false)} // Go back to chat list
                            />
                        ) : (
                            <div>
                                <h2 style={styles.sectionTitle}><MessageSquare size={28} /> My Conversations</h2>
                                {conversations.length === 0 ? (
                                    <div style={styles.noDataMessage}>No active conversations. Start a chat from an approved claim request!</div>
                                ) : (
                                    <ul style={styles.list}>
                                        {conversations.map((conversation) => (
                                            <li
                                                key={conversation.otherUserId}
                                                style={{ ...styles.listItem, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                                className="hover-effect"
                                                onClick={() => handleChatInitiate({ userid: conversation.otherUserId, firstName: conversation.firstName, lastName: conversation.lastName })}
                                            >
                                                <div>
                                                    <strong>{conversation.firstName} {conversation.lastName}</strong>
                                                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
                                                        User ID: {conversation.otherUserId}
                                                    </div>
                                                </div>
                                                <ArrowRight size={20} color="#4F46E5" />
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )
                    ) : (
                        <>
                            {/* Dashboard Overview Section */}
                            {activeSection === 'dashboard' && (
                                <>
                                    <div style={styles.header}>
                                        <h1 style={styles.title}>Dashboard Overview</h1>
                                        <p style={styles.subtitle}>Welcome back! Here's an overview of your activity.</p>
                                    </div>

                                    {/* Stats Overview Section */}
                                    <div style={styles.statsGrid}>
                                        <div style={{ ...styles.statCard, background: 'linear-gradient(45deg, #1e293b, #334155)' }} className="hover-effect">
                                            <div style={styles.statCardIcon}>
                                                <Search size={28} />
                                            </div>
                                            <div style={styles.statCardContent}>
                                                <div style={styles.statCardTitle}>Lost Reports</div>
                                                <div style={styles.statCardValue}>{lostItems.length}</div>
                                            </div>
                                        </div>
                                        <div style={{ ...styles.statCard, background: 'linear-gradient(45deg, #4F46E5, #7C3AED)' }} className="hover-effect">
                                            <div style={styles.statCardIcon}>
                                                <Box size={28} />
                                            </div>
                                            <div style={styles.statCardContent}>
                                                <div style={styles.statCardTitle}>Found Items</div>
                                                <div style={styles.statCardValue}>{foundItems.length}</div>
                                            </div>
                                        </div>
                                        <div style={{ ...styles.statCard, background: 'linear-gradient(45deg, #f97316, #fb923c)' }} className="hover-effect">
                                            <div style={styles.statCardIcon}>
                                                <MessageSquareText size={28} />
                                            </div>
                                            <div style={styles.statCardContent}>
                                                <div style={styles.statCardTitle}>Claim Requests</div>
                                                <div style={styles.statCardValue}>{claimRequests.length}</div>
                                            </div>
                                        </div>
                                        <div style={{ ...styles.statCard, background: 'linear-gradient(45deg, #22c55e, #4ade80)' }} className="hover-effect">
                                            <div style={styles.statCardIcon}>
                                                <BellRing size={28} />
                                            </div>
                                            <div style={styles.statCardContent}>
                                                <div style={styles.statCardTitle}>Unread Notifications</div>
                                                <div style={styles.statCardValue}>{unreadNotifications.length}</div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Notifications section when 'dashboard' is active */}
                                    <div style={styles.notificationBox} className="hover-effect">
                                        <h3 style={styles.notificationHeader}>
                                            <BellRing size={24} /> Recent Notifications
                                        </h3>
                                        {notifications.length === 0 ? (
                                            <p style={styles.noDataMessage}>No notifications yet.</p>
                                        ) : (
                                            <ul style={styles.list}>
                                                {unreadNotifications.slice(0, 5).map(note => (
                                                    <li
                                                        key={note.id}
                                                        style={styles.notificationItem}
                                                        className="hover-effect"
                                                    >
                                                        <div>
                                                            <strong>New:</strong> {note.message}
                                                            {note.senderFirstName && note.senderLastName && (
                                                                <span style={{ fontSize: '0.9em', marginLeft: '5px', fontStyle: 'italic', color: '#94a3b8' }}>
                                                                    (from {note.senderFirstName} {note.senderLastName})
                                                                </span>
                                                            )}
                                                            <div style={styles.notificationTimestamp}>
                                                                {new Date(note.createdAt).toLocaleString()}
                                                            </div>
                                                        </div>
                                                        <button
                                                            style={styles.markAsReadButton}
                                                            onClick={() => markNotificationAsRead(note.id)}
                                                            className="mark-as-read-btn-hoverable"
                                                        >
                                                            Mark as Read
                                                        </button>
                                                    </li>
                                                ))}
                                                {readNotifications.slice(0, 5).map(note => (
                                                    <li
                                                        key={note.id}
                                                        style={{ ...styles.notificationItem, ...styles.readNotificationItem }}
                                                        className="read-notification-item-hover-override"
                                                    >
                                                        <div>
                                                            {note.message}
                                                            {note.senderFirstName && note.senderLastName && (
                                                                <span style={{ fontSize: '0.9em', marginLeft: '5px', fontStyle: 'italic', color: '#94a3b8' }}>
                                                                    (from {note.senderFirstName} {note.lastName})
                                                                </span>
                                                            )}
                                                            <div style={styles.notificationTimestamp}>
                                                                {new Date(note.createdAt).toLocaleString()} (Read)
                                                            </div>
                                                        </div>
                                                        <button
                                                            style={{ ...styles.markAsReadButton, ...styles.markAsReadButtonRead }}
                                                            disabled
                                                            className="mark-as-read-btn-disabled-hover-override"
                                                        >
                                                            Read
                                                        </button>
                                                    </li>
                                                ))}
                                                {notifications.length > 10 && (
                                                    <p style={{ ...styles.infoText, textAlign: 'center', marginTop: '1rem' }}>
                                                        <a href="#" onClick={() => setActiveSection('notifications')} style={{ color: '#4F46E5', textDecoration: 'none', fontWeight: '600' }}>
                                                            View All Notifications
                                                        </a>
                                                    </p>
                                                )}
                                            </ul>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* My Lost Items Section */}
                            {activeSection === 'myLostItems' && (
                                <section style={styles.card}>
                                    <h2 style={styles.sectionTitle}>
                                        <Search size={24} /> My Lost Items
                                    </h2>
                                    {lostItems.length === 0 ? (
                                        <p style={styles.noDataMessage}>You haven't posted any lost items yet.</p>
                                    ) : (
                                        <ul style={styles.list}>
                                            {lostItems.map(item => (
                                                <li
                                                    key={item.id}
                                                    style={styles.listItem}
                                                    className="hover-effect"
                                                >
                                                    <strong style={styles.listItemStrong}>{item.itemName}</strong>
                                                    <span style={styles.infoText}>Description: {item.description}</span>
                                                    <span style={styles.infoText}>Posted on: {new Date(item.createdAt).toLocaleDateString()}</span>
                                                    {item.location && <span style={styles.infoText}>Location: {item.location}</span>}
                                                    {item.contactInfo && <span style={styles.infoText}>Contact: {item.contactInfo}</span>}
                                                    {item.status && <span style={styles.infoText}>Status: <span style={getStatusStyle(item.status)}>{item.status.toUpperCase()}</span></span>}
                                                    <button
                                                        style={styles.findMatchButton}
                                                        onClick={() => fetchMatchResults(item.id)}
                                                        disabled={fetchingMatches}
                                                    >
                                                        {fetchingMatches ? 'Finding Matches...' : 'Find Match'}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </section>
                            )}

                            {/* My Found Items Section */}
                            {activeSection === 'myFoundItems' && (
                                <section style={styles.card}>
                                    <h2 style={styles.sectionTitle}>
                                        <Box size={24} /> My Found Items
                                    </h2>
                                    {foundItems.length === 0 ? (
                                        <p style={styles.noDataMessage}>You haven't posted any found items yet.</p>
                                    ) : (
                                        <ul style={styles.list}>
                                            {foundItems.map(item => (
                                                <li
                                                    key={item.id}
                                                    style={styles.listItem}
                                                    className="hover-effect"
                                                >
                                                    <strong style={styles.listItemStrong}>{item.itemName}</strong>
                                                    <span style={styles.infoText}>Description: {item.description}</span>
                                                    <span style={styles.infoText}>Posted on: {new Date(item.createdAt).toLocaleDateString()}</span>
                                                    {item.location && <span style={styles.infoText}>Location: {item.location}</span>}
                                                    {item.contactInfo && <span style={styles.infoText}>Contact: {item.contactInfo}</span>}
                                                    {item.status && <span style={styles.infoText}>Status: <span style={getStatusStyle(item.status)}>{item.status.toUpperCase()}</span></span>}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </section>
                            )}

                            {/* My Claim Requests Section */}
                            {activeSection === 'claimRequests' && (
                                <section style={styles.card}>
                                    <h2 style={styles.sectionTitle}>
                                        <MessageSquareText size={24} /> My Claim Requests
                                    </h2>
                                    {claimRequests.length === 0 ? (
                                        <p style={styles.noDataMessage}>You haven't made any claim requests yet.</p>
                                    ) : (
                                        <ul style={styles.list}>
                                            {claimRequests.map(request => (
                                                <li
                                                    key={request.claimId}
                                                    style={styles.listItem}
                                                    className="hover-effect"
                                                >
                                                    <span style={styles.infoText}>Request for: <strong style={styles.listItemStrong}>{request.foundItemName}</strong> (ID: {request.foundItemId})</span>
                                                    <span style={styles.infoText}>Description: {request.foundItemDescription}</span>
                                                    <span style={styles.infoText}>Location: {request.foundItemLocation}</span>
                                                    <span style={styles.infoText}>Your Message: "{request.claimMessage}"</span>
                                                    <span style={styles.infoText}>Status: <span style={getStatusStyle(request.claimStatus)}>{request.claimStatus.toUpperCase()}</span></span>
                                                    <span style={styles.infoText}>Requested On: {new Date(request.claimCreatedAt).toLocaleString()}</span>
                                                    {request.claimStatus.toLowerCase() === 'approved' && (
                                                        <button
                                                            style={{...styles.findMatchButton, marginTop: '1rem'}} // Reusing styling, adjust as needed
                                                            onClick={() => handleChatInitiate({ userid: request.finderId, firstName: request.finderFirstName, lastName: request.finderLastName })}
                                                        >
                                                            Chat with Finder
                                                        </button>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </section>
                            )}

                            {/* Notifications Section (shown only when 'notifications' is active) */}
                            {activeSection === 'notifications' && (
                                <div style={styles.notificationBox} className="hover-effect">
                                    <h3 style={styles.notificationHeader}>
                                        <BellRing size={24} /> All Notifications
                                    </h3>
                                    {notifications.length === 0 ? (
                                        <p style={styles.noDataMessage}>No notifications yet.</p>
                                    ) : (
                                        <ul style={styles.list}>
                                            {unreadNotifications.map(note => (
                                                <li
                                                    key={note.id}
                                                    style={styles.notificationItem}
                                                    className="hover-effect"
                                                >
                                                    <div>
                                                        <strong>New:</strong> {note.message}
                                                        {note.senderFirstName && note.senderLastName && (
                                                            <span style={{ fontSize: '0.9em', marginLeft: '5px', fontStyle: 'italic', color: '#94a3b8' }}>
                                                                (from {note.senderFirstName} {note.senderLastName})
                                                            </span>
                                                        )}
                                                        <div style={styles.notificationTimestamp}>
                                                            {new Date(note.createdAt).toLocaleString()}
                                                        </div>
                                                    </div>
                                                    <button
                                                        style={styles.markAsReadButton}
                                                        onClick={() => markNotificationAsRead(note.id)}
                                                        className="mark-as-read-btn-hoverable"
                                                    >
                                                        Mark as Read
                                                    </button>
                                                </li>
                                            ))}
                                            {readNotifications.map(note => (
                                                <li
                                                    key={note.id}
                                                    style={{ ...styles.notificationItem, ...styles.readNotificationItem }}
                                                    className="read-notification-item-hover-override"
                                                >
                                                    <div>
                                                        {note.message}
                                                        {note.senderFirstName && note.senderLastName && (
                                                            <span style={{ fontSize: '0.9em', marginLeft: '5px', fontStyle: 'italic', color: '#94a3b8' }}>
                                                                (from {note.senderFirstName} {note.lastName})
                                                            </span>
                                                        )}
                                                        <div style={styles.notificationTimestamp}>
                                                            {new Date(note.createdAt).toLocaleString()} (Read)
                                                        </div>
                                                    </div>
                                                    <button
                                                        style={{ ...styles.markAsReadButton, ...styles.markAsReadButtonRead }}
                                                        disabled
                                                        className="mark-as-read-btn-disabled-hover-override"
                                                    >
                                                        Read
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}

                            {/* Match Results Section */}
                            {activeSection === 'matchResults' && (
                                <section style={styles.card}>
                                    <h2 style={styles.sectionTitle}>
                                        <GitCompare size={24} /> Match Results
                                    </h2>
                                    {fetchingMatches ? (
                                        <p style={styles.noDataMessage}>Finding best matches...</p>
                                    ) : matchResults.length === 0 ? (
                                        <p style={styles.noDataMessage}>No significant matches found for your lost item.</p>
                                    ) : (
                                        <ul style={styles.list}>
                                            {matchResults.map(match => (
                                                <li key={match.foundItem.id} style={styles.matchItemContainer} className="hover-effect">
                                                    <strong style={styles.listItemStrong}>Matched Found Item: {match.foundItem.itemName}</strong>
                                                    {match.foundItem.image && match.foundItem.image !== "" && (
                                                        <img
                                                            src={match.foundItem.image}
                                                            alt={match.foundItem.itemName}
                                                            style={styles.foundItemImage}
                                                        />
                                                    )}
                                                    <span style={styles.infoText}>Description: {match.foundItem.description}</span>
                                                    <span style={styles.infoText}>Location: {match.foundItem.location}</span>
                                                    <span style={styles.infoText}>Contact Info: {match.foundItem.contactInfo}</span>
                                                    <span style={styles.infoText}>Found On: {new Date(match.foundItem.createdAt).toLocaleDateString()}</span>
                                                    <span style={styles.matchScore}>Match Score: {(match.score * 100).toFixed(2)}%</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </section>
                            )}

                            {/* Profile Section (Placeholder) */}
                            {activeSection === 'profile' && (
                                <section style={styles.card}>
                                    <h2 style={styles.sectionTitle}>
                                        <User size={24} /> My Profile
                                    </h2>
                                    <p style={styles.noDataMessage}>
                                        This section would display your user profile information.
                                        (Functionality for profile management goes here.)
                                    </p>
                                </section>
                            )}

                            {/* Help & Support Section (Placeholder) */}
                            {activeSection === 'helpSupport' && (
                                <section style={styles.card}>
                                    <h2 style={styles.sectionTitle}>
                                        <LifeBuoy size={24} /> Help & Support
                                    </h2>
                                    <p style={styles.noDataMessage}>
                                        Find answers to common questions or contact support here.
                                        (Functionality for FAQs, contact forms goes here.)
                                    </p>
                                </section>
                            )}

                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default UserDashboard;