import React, { useState, useEffect } from 'react';
import {
    Loader2,
    CheckCircle2,
    Archive,
    XCircle,
    Info,
    X,
    Handshake,
    LayoutDashboard, // For the main dashboard overview
    MessageSquareText, // For claim requests
    Search, // For lost items
    Box, // For found items
    Users, // For managing users (new for admin)
    Settings, // For general settings/admin tools
    LifeBuoy // For help & support
} from 'lucide-react';

const AdminDashboard = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState('info');
    const [activeSection, setActiveSection] = useState('dashboard');

    const [totalPosts, setTotalPosts] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);

    // --- Configuration ---
    const ADMIN_UID = 7;
    const API_BASE_URL = 'http://localhost:5000';
    // --- End Configuration ---

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
            margin: '0',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', // Allows 2-3 cards per row
            gap: '1.5rem',
        },
        listItem: {
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            padding: '1rem 1.5rem',
            borderRadius: '0.75rem',
            lineHeight: '1.5',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column', // Essential for pushing buttons to bottom
            justifyContent: 'space-between', // Distribute space
            fontSize: '0.95rem',
            height: 'auto',
            ':hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.06)'
            }
        },
        listItemContent: { // New style for content area to contain text and image
            marginBottom: '1rem', // Space before buttons
            flexGrow: 1, // Allows content to take available space
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem', // Space between info lines
        },
        listItemImageContainer: { // New style for square image box
            width: '100%',
            paddingTop: '100%', // Makes the container square (1:1 aspect ratio)
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '0.5rem', // Slightly rounded corners for images
            marginBottom: '0.75rem', // Space between image and text
            backgroundColor: '#e2e8f0', // Placeholder background for empty image
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#94a3b8',
            fontSize: '0.9rem',
            fontStyle: 'italic',
        },
        listItemImage: { // New style for the image itself
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover', // Ensures image covers the square container
            objectPosition: 'center',
        },
        listItemDescription: { // New style to constrain description height
            maxHeight: '4.5em', // Approx 3 lines of text
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'normal', // Ensure text wraps
            display: '-webkit-box',
            WebkitLineClamp: 3, // Limit to 3 lines for Webkit browsers
            WebkitBoxOrient: 'vertical',
        },
        listItemStrong: {
            color: '#1e293b',
            fontSize: '1.05em',
            fontWeight: '600'
        },
        infoText: {
            color: '#64748b',
            fontSize: '0.9rem',
            lineHeight: '1.5'
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
        actionButtonContainer: { // New style for button container
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.5rem',
            marginTop: 'auto', // Pushes buttons to the bottom
            paddingTop: '0.5rem', // Small padding to separate from description
            borderTop: '1px solid #f1f5f9', // A subtle separator line
        },
        actionButton: {
            background: 'linear-gradient(45deg, #4F46E5, #7C3AED)',
            color: 'white',
            border: 'none',
            padding: '0.6rem 1.2rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '0.9rem',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            flexShrink: 0, // Prevent buttons from shrinking
            ':hover': {
                transform: 'translateY(-1px) scale(1.02)',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                filter: 'brightness(1.1)',
            },
            ':disabled': {
                background: '#cbd5e1',
                cursor: 'not-allowed',
                boxShadow: 'none',
                transform: 'none',
                filter: 'none',
            }
        },
        approveButton: {
            background: 'linear-gradient(45deg, #22c55e, #43a047)',
            ':hover': {
                background: 'linear-gradient(45deg, #43a047, #22c55e)',
            }
        },
        archiveButton: {
            background: 'linear-gradient(45deg, #f97316, #ea580c)',
            ':hover': {
                background: 'linear-gradient(45deg, #ea580c, #f97316)',
            }
        },
        rejectButton: {
            background: 'linear-gradient(45deg, #ef4444, #dc2626)',
            ':hover': {
                background: 'linear-gradient(45deg, #dc2626, #ef4444)',
            }
        },
        modal: {
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.3s ease-out'
        },
        modalContent: {
            background: 'rgba(255, 255, 255, 0.98)',
            padding: '2.5rem',
            borderRadius: '16px',
            maxWidth: '500px',
            width: '90%',
            position: 'relative',
            textAlign: 'center',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)',
            border: '1px solid #e2e8f0',
            animation: 'slideIn 0.3s ease-out'
        },
        modalIcon: {
            width: '70px',
            height: '70px',
            margin: '0 auto 1.2rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
        },
        modalIconSuccess: {
            background: 'linear-gradient(45deg, #22c55e, #43a047)'
        },
        modalIconError: {
            background: 'linear-gradient(45deg, #ef4444, #dc2626)'
        },
        modalTitle: {
            fontWeight: '700',
            fontSize: '1.8rem',
            marginBottom: '1rem',
            color: '#1e293b'
        },
        modalMessage: {
            fontSize: '1rem',
            color: '#475569',
            marginBottom: '2rem'
        },
        modalButton: {
            background: 'linear-gradient(45deg, #4F46E5, #7C3AED)',
            color: 'white',
            padding: '0.8rem 2.5rem',
            borderRadius: '0.75rem',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '1.05rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)',
            ':hover': {
                transform: 'translateY(-2px) scale(1.02)',
                boxShadow: '0 8px 20px rgba(79, 70, 229, 0.4)',
                filter: 'brightness(1.1)',
            }
        },
        closeButton: {
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            background: 'none',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            color: '#94a3b8',
            ':hover': {
                backgroundColor: 'rgba(0,0,0,0.05)',
                color: '#334155',
                transform: 'rotate(90deg)'
            }
        },
        '@keyframes fadeIn': {
            from: { opacity: 0 },
            to: { opacity: 1 }
        },
        '@keyframes slideIn': {
            from: { transform: 'translateY(-50px)', opacity: 0 },
            to: { transform: 'translateY(0)', opacity: 1 }
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
            list: {
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1rem',
            },
            modalContent: {
                padding: '1.5rem',
            },
            modalTitle: {
                fontSize: '1.4rem',
            },
            modalMessage: {
                fontSize: '0.9rem',
            }
        },
        '@media (max-width: 768px)': {
            statsGrid: {
                gridTemplateColumns: '1fr',
            },
            list: {
                gridTemplateColumns: '1fr',
            },
        },
    };

    useEffect(() => {
        const uID = parseInt(localStorage.getItem('uID'));
        if (isNaN(uID) || uID !== ADMIN_UID) {
            setError("Access Denied: You must be an administrator to view this page.");
            setLoading(false);
            return;
        }
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);
        try {
            const uID = parseInt(localStorage.getItem('uID'));
                  
            const postsResponse = await fetch(`${API_BASE_URL}/api/admin/posts?uID=${uID}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!postsResponse.ok) {
                const errorData = await postsResponse.json();
                throw new Error(errorData.message || `HTTP error! Status: ${postsResponse.status}`);
            }
            const postsData = await postsResponse.json();
            setPosts(postsData);
            setTotalPosts(postsData.length);
            const usersCount = await (await fetch(`${API_BASE_URL}/api/users/total`)).json();
            setTotalUsers(usersCount.length); // Mock user count for demonstration
        } catch (err) {
            setError(`Failed to fetch dashboard data: ${err.message}`);
            console.error("Fetch dashboard data error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, type, action) => {
        setActionLoadingId(id);
        let url;
        let successMessage;
        let errorMessage;

        const uID = parseInt(localStorage.getItem('uID'));
        if (isNaN(uID) || uID !== ADMIN_UID) {
            setModalMessage("Access Denied: You must be an administrator to perform this action.");
            setModalType('error');
            setIsModalOpen(true);
            setActionLoadingId(null);
            return;
        }

        try {
            if (type === 'claim') {
                url = `${API_BASE_URL}/api/admin/claims/${id}/${action}?uID=${uID}`;
                successMessage = `Claim ID ${id} has been ${action}d successfully!`;
                errorMessage = `Failed to ${action} claim ID ${id}.`;
            } else {
                url = `${API_BASE_URL}/api/admin/posts/${id}/${type}/${action}?uID=${uID}`;
                successMessage = `Post ID ${id} (${type}) has been ${action}d successfully!`;
                errorMessage = `Failed to ${action} post ID ${id} (${type}).`;
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || errorMessage);
            }

            await fetchDashboardData();

            setModalMessage(successMessage);
            setModalType('success');
            setIsModalOpen(true);

        } catch (err) {
            setModalMessage(`Error: ${err.message}`);
            setModalType('error');
            setIsModalOpen(true);
            console.error(`Error during action on ${type} ID ${id}:`, err);
        } finally {
            setActionLoadingId(null);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalMessage('');
        setModalType('info');
    };

    const pendingPosts = posts.filter(post => post.type !== 'claim' && post.status );
    const approvedPosts = posts.filter(post => post.type !== 'claim' && post.status && post.status.trim() === 'approved');
    const archivedPosts = posts.filter(post => post.type !== 'claim' && post.status && post.status.trim() === 'archived');
    const pendingClaims = posts.filter(post => post.type === 'claim' && post.claimStatus && post.claimStatus.trim() === 'pending');

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
                Loading admin dashboard...
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
                <XCircle size={50} color="#ef4444" />
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
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideIn {
                    from { transform: translateY(-50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>

            <div style={styles.dashboardWrapper}>
                {/* Sidebar */}
                <aside style={styles.sidebar}>
                    <h2 style={styles.sidebarHeader}>Admin Dashboard</h2>
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
                                style={{ ...styles.sidebarNavLink, ...(activeSection === 'claimRequests' ? styles.sidebarNavLinkActive : {}) }}
                                onClick={() => setActiveSection('claimRequests')}
                                className="sidebar-link-hoverable"
                            >
                                <Handshake size={20} style={styles.sidebarNavIcon} />
                                Claim Requests
                            </div>
                        </li>
                        <li>
                            <div
                                style={{ ...styles.sidebarNavLink, ...(activeSection === 'pendingPosts' ? styles.sidebarNavLinkActive : {}) }}
                                onClick={() => setActiveSection('pendingPosts')}
                                className="sidebar-link-hoverable"
                            >
                                <Search size={20} style={styles.sidebarNavIcon} />
                                Pending Posts
                            </div>
                        </li>
                        <li>
                            <div
                                style={{ ...styles.sidebarNavLink, ...(activeSection === 'approvedPosts' ? styles.sidebarNavLinkActive : {}) }}
                                onClick={() => setActiveSection('approvedPosts')}
                                className="sidebar-link-hoverable"
                            >
                                <CheckCircle2 size={20} style={styles.sidebarNavIcon} />
                                Approved Posts
                            </div>
                        </li>
                        <li>
                            <div
                                style={{ ...styles.sidebarNavLink, ...(activeSection === 'archivedPosts' ? styles.sidebarNavLinkActive : {}) }}
                                onClick={() => setActiveSection('archivedPosts')}
                                className="sidebar-link-hoverable"
                            >
                                <Archive size={20} style={styles.sidebarNavIcon} />
                                Archived Posts
                            </div>
                        </li>
                        {/* Admin Tools Section */}
                        <li style={{ marginTop: '1.5rem', opacity: 0.7, fontSize: '0.9rem', color: '#fff' }}>Admin Tools</li>
                        <li>
                            <div
                                style={{ ...styles.sidebarNavLink, ...(activeSection === 'manageUsers' ? styles.sidebarNavLinkActive : {}) }}
                                onClick={() => setActiveSection('manageUsers')}
                                className="sidebar-link-hoverable"
                            >
                                <Users size={20} style={styles.sidebarNavIcon} />
                                Manage Users
                            </div>
                        </li>
                        <li>
                            <div
                                style={{ ...styles.sidebarNavLink, ...(activeSection === 'settings' ? styles.sidebarNavLinkActive : {}) }}
                                onClick={() => setActiveSection('settings')}
                                className="sidebar-link-hoverable"
                            >
                                <Settings size={20} style={styles.sidebarNavIcon} />
                                Settings
                            </div>
                        </li>
                        <li>
                            <div
                                style={{ ...styles.sidebarNavLink, ...(activeSection === 'adminHelpSupport' ? styles.sidebarNavLinkActive : {}) }}
                                onClick={() => setActiveSection('adminHelpSupport')}
                                className="sidebar-link-hoverable"
                            >
                                <LifeBuoy size={20} style={styles.sidebarNavIcon} />
                                Help & Support
                            </div>
                        </li>
                    </ul>
                </aside>

                {/* Main Dashboard Content */}
                <main style={styles.mainContent}>
                    {/* Dashboard Overview Section */}
                    {activeSection === 'dashboard' && (
                        <>
                            <div style={styles.header}>
                                <h1 style={styles.title}>Admin Dashboard Overview</h1>
                                <p style={styles.subtitle}>Welcome, Administrator! Here's a summary of activity across the platform.</p>
                            </div>

                            {/* Admin Stats Overview Section */}
                            <div style={styles.statsGrid}>
                                <div style={{ ...styles.statCard, background: 'linear-gradient(45deg, #1e293b, #334155)' }} className="hover-effect">
                                    <div style={styles.statCardIcon}>
                                        <Search size={28} />
                                    </div>
                                    <div style={styles.statCardContent}>
                                        <div style={styles.statCardTitle}>Total Lost & Found Posts</div>
                                        <div style={styles.statCardValue}>{totalPosts}</div>
                                    </div>
                                </div>
                                <div style={{ ...styles.statCard, background: 'linear-gradient(45deg, #4F46E5, #7C3AED)' }} className="hover-effect">
                                    <div style={styles.statCardIcon}>
                                        <Handshake size={28} />
                                    </div>
                                    <div style={styles.statCardContent}>
                                        <div style={styles.statCardTitle}>Pending Claim Requests</div>
                                        <div style={styles.statCardValue}>{pendingClaims.length}</div>
                                    </div>
                                </div>
                                <div style={{ ...styles.statCard, background: 'linear-gradient(45deg, #f97316, #fb923c)' }} className="hover-effect">
                                    <div style={styles.statCardIcon}>
                                        <Loader2 size={28} />
                                    </div>
                                    <div style={styles.statCardContent}>
                                        <div style={styles.statCardTitle}>Pending Item Posts</div>
                                        <div style={styles.statCardValue}>{pendingPosts.length}</div>
                                    </div>
                                </div>
                                <div style={{ ...styles.statCard, background: 'linear-gradient(45deg, #22c55e, #4ade80)' }} className="hover-effect">
                                    <div style={styles.statCardIcon}>
                                        <Users size={28} />
                                    </div>
                                    <div style={styles.statCardContent}>
                                        <div style={styles.statCardTitle}>Total Registered Users</div>
                                        <div style={styles.statCardValue}>{totalUsers}</div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Claim Requests Section (Actual Content) */}
                    {activeSection === 'claimRequests' && (
                        <section style={styles.card}>
                            <h2 style={styles.sectionTitle}>
                                <Handshake size={24} /> Pending Claim Requests
                            </h2>
                            {pendingClaims.length === 0 ? (
                                <p style={styles.noDataMessage}>No pending claim requests.</p>
                            ) : (
                                <ul style={styles.list}>
                                    {pendingClaims.map(claim => (
                                        <li key={claim.claimId} style={styles.listItem} className="hover-effect">
                                            <div style={styles.listItemContent}>
                                                {/* No image for claims typically, but if there was, it would go here */}
                                                <span style={styles.infoText}>Claim for: <strong style={styles.listItemStrong}>{claim.foundItemName}</strong> (ID: {claim.foundItemId})</span>
                                                <span style={styles.infoText}>Claimant: <strong style={styles.listItemStrong}>{claim.claimantFirstName} {claim.claimantLastName}</strong> (UID: {claim.claimantId})</span>
                                                <span style={styles.infoText}>Claim Type: <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>Claim</span></span>
                                                <span style={styles.infoText}>Details: <span style={styles.listItemDescription}>"{claim.claimMessage}"</span></span>
                                                <span style={styles.infoText}>Found Item Details: {claim.foundItemDescription} (Location: {claim.foundItemLocation})</span>
                                                <span style={styles.infoText}>Requested On: {new Date(claim.claimCreatedAt).toLocaleString()}</span>
                                            </div>
                                            <div style={styles.actionButtonContainer}>
                                                <button
                                                    onClick={() => handleAction(claim.claimId, 'claim', 'approve')}
                                                    style={{ ...styles.actionButton, ...styles.approveButton }}
                                                    disabled={actionLoadingId === claim.claimId}
                                                >
                                                    {actionLoadingId === claim.claimId ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                                                    Approve Claim
                                                </button>
                                                <button
                                                    onClick={() => handleAction(claim.claimId, 'claim', 'reject')}
                                                    style={{ ...styles.actionButton, ...styles.rejectButton }}
                                                    disabled={actionLoadingId === claim.claimId}
                                                >
                                                    {actionLoadingId === claim.claimId ? <Loader2 size={18} className="animate-spin" /> : <XCircle size={18} />}
                                                    Reject Claim
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    )}

                    {/* Pending Posts Section */}
                    {activeSection === 'pendingPosts' && (
                        <section style={styles.card}>
                            <h2 style={styles.sectionTitle}>
                                <Loader2 className="animate-spin" size={24} /> Pending Posts
                            </h2>
                            {pendingPosts.length === 0 ? (
                                <p style={styles.noDataMessage}>No pending posts to review.</p>
                            ) : (
                                <ul style={styles.list}>
                                    {pendingPosts.map(post => (
                                        <li key={`${post.type}-${post.id}`} style={styles.listItem} className="hover-effect">
                                            <div style={styles.listItemContent}>
                                                <div style={styles.listItemImageContainer}>
                                                    {post.image ? (
                                                        <img src={post.image} alt={post.itemName} style={styles.listItemImage} />
                                                    ) : (
                                                        <span>No Image</span>
                                                    )}
                                                </div>
                                                <span style={styles.infoText}>Item: <strong style={styles.listItemStrong}>{post.itemName}</strong></span>
                                                <span style={styles.infoText}>Type: <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{post.type}</span> - Reported by UID: {post.uID}</span>
                                                <span style={styles.infoText}>Description: <span style={styles.listItemDescription}>{post.description}</span></span>
                                            </div>
                                            <div style={styles.actionButtonContainer}>
                                                <button
                                                    onClick={() => handleAction(post.id, post.type, 'delete')}
                                                    style={{ ...styles.actionButton, ...styles.approveButton }}
                                                    disabled={actionLoadingId === post.id}
                                                >
                                                    {actionLoadingId === post.id ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                                                    Delete
                                                </button>
                                                <button
                                                    onClick={() => handleAction(post.id, post.type, 'archive')}
                                                    style={{ ...styles.actionButton, ...styles.archiveButton }}
                                                    disabled={actionLoadingId === post.id}
                                                >
                                                    {actionLoadingId === post.id ? <Loader2 size={18} className="animate-spin" /> : <Archive size={18} />}
                                                    Archive
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    )}

                    {/* Approved Posts Section */}
                    {activeSection === 'approvedPosts' && (
                        <section style={styles.card}>
                            <h2 style={styles.sectionTitle}>
                                <CheckCircle2 size={24} /> Approved Posts
                            </h2>
                            {approvedPosts.length === 0 ? (
                                <p style={styles.noDataMessage}>No approved posts.</p>
                            ) : (
                                <ul style={styles.list}>
                                    {approvedPosts.map(post => (
                                        <li key={`${post.type}-${post.id}`} style={styles.listItem} className="hover-effect">
                                            <div style={styles.listItemContent}>
                                                <div style={styles.listItemImageContainer}>
                                                    {post.image ? (
                                                        <img src={post.image} alt={post.itemName} style={styles.listItemImage} />
                                                    ) : (
                                                        <span>No Image</span>
                                                    )}
                                                </div>
                                                <span style={styles.infoText}>Item: <strong style={styles.listItemStrong}>{post.itemName}</strong></span>
                                                <span style={styles.infoText}>Type: <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{post.type}</span> - Reported by UID: {post.uID}</span>
                                                <span style={styles.infoText}>Description: <span style={styles.listItemDescription}>{post.description}</span></span>
                                            </div>
                                            <div style={styles.actionButtonContainer}>
                                                <button
                                                    onClick={() => handleAction(post.id, post.type, 'archive')}
                                                    style={{ ...styles.actionButton, ...styles.archiveButton }}
                                                    disabled={actionLoadingId === post.id}
                                                >
                                                    {actionLoadingId === post.id ? <Loader2 size={18} className="animate-spin" /> : <Archive size={18} />}
                                                    Archive
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    )}

                    {/* Archived Posts Section - NOW MADE SIMILAR */}
                    {activeSection === 'archivedPosts' && (
                        <section style={styles.card}>
                            <h2 style={styles.sectionTitle}>
                                <Archive size={24} /> Archived Posts
                            </h2>
                            {archivedPosts.length === 0 ? (
                                <p style={styles.noDataMessage}>No archived posts.</p>
                            ) : (
                                <ul style={styles.list}>
                                    {archivedPosts.map(post => (
                                        <li key={`${post.type}-${post.id}`} style={styles.listItem} className="hover-effect">
                                            <div style={styles.listItemContent}>
                                                <div style={styles.listItemImageContainer}>
                                                    {post.image ? (
                                                        <img src={post.image} alt={post.itemName} style={styles.listItemImage} />
                                                    ) : (
                                                        <span>No Image</span>
                                                    )}
                                                </div>
                                                <span style={styles.infoText}>Item: <strong style={styles.listItemStrong}>{post.itemName}</strong></span>
                                                <span style={styles.infoText}>Type: <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{post.type}</span> - Reported by UID: {post.uID}</span>
                                                <span style={styles.infoText}>Description: <span style={styles.listItemDescription}>{post.description}</span></span>
                                            </div>
                                            <div style={styles.actionButtonContainer}>
                                                {/* You can add a "Re-approve" or "Delete Permanently" button here if needed */}
                                                {/* Example of a 'Re-approve' button: */}
                                                {/* <button
                                                    onClick={() => handleAction(post.id, post.type, 'approve')}
                                                    style={{ ...styles.actionButton, ...styles.approveButton }}
                                                    disabled={actionLoadingId === post.id}
                                                >
                                                    {actionLoadingId === post.id ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                                                    Re-approve
                                                </button> */}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    )}

                    {/* Manage Users Section (Placeholder) */}
                    {activeSection === 'manageUsers' && (
                        <section style={styles.card}>
                            <h2 style={styles.sectionTitle}>
                                <Users size={24} /> Manage Users
                            </h2>
                            <p style={styles.noDataMessage}>
                                This section would allow administrators to view, edit, or delete user accounts.
                                (Functionality for user management goes here.)
                            </p>
                        </section>
                    )}

                    {/* Settings Section (Placeholder) */}
                    {activeSection === 'settings' && (
                        <section style={styles.card}>
                            <h2 style={styles.sectionTitle}>
                                <Settings size={24} /> Admin Settings
                            </h2>
                            <p style={styles.noDataMessage}>
                                Configure application settings, moderation rules, or other administrative preferences here.
                                (Functionality for settings goes here.)
                            </p>
                        </section>
                    )}

                    {/* Admin Help & Support Section (Placeholder) */}
                    {activeSection === 'adminHelpSupport' && (
                        <section style={styles.card}>
                            <h2 style={styles.sectionTitle}>
                                <LifeBuoy size={24} /> Admin Help & Support
                            </h2>
                            <p style={styles.noDataMessage}>
                                Access documentation, frequently asked questions for administrators, or contact technical support.
                                (Functionality for help & support goes here.)
                            </p>
                        </section>
                    )}

                </main>
            </div>

            {/* Modal for feedback */}
            {isModalOpen && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <button onClick={closeModal} style={styles.closeButton}>
                            <X size={20} />
                        </button>
                        <div style={{
                            ...styles.modalIcon,
                            ...(modalType === 'success' ? styles.modalIconSuccess : styles.modalIconError)
                        }}>
                            {modalType === 'success' ? (
                                <CheckCircle2 size={40} />
                            ) : (
                                <XCircle size={40} />
                            )}
                        </div>
                        <h2 style={styles.modalTitle}>{modalType === 'success' ? 'Success!' : 'Error!'}</h2>
                        <p style={styles.modalMessage}>{modalMessage}</p>
                        <button onClick={closeModal} style={styles.modalButton}>
                            Got It
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;