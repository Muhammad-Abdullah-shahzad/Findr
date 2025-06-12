import { ImCross } from "react-icons/im";
import React, { useEffect, useState ,useRef } from 'react';
import { MdArrowBackIos} from "react-icons/md";
import { useNavigate } from 'react-router-dom'; // Assuming this will be used if navigation is fully set up

import "./landingpage.css"
import {
  Search,
  MapPin,
  Shield,
  Clock,
  ArrowRight,
  Smartphone,
  Star,
  Quote,
  Heart,
  Cross
} from 'lucide-react';
// Removed "./landingPage.css" import as styles are handled inline or in the style tag

// A simple mock for useNavigate if react-router-dom is not fully set up in this environment



export default function LostFoundLanding() {
const [navLinks,setNav] = useState({})
  const navigation = useNavigate()
  useEffect(() => {
    window.scrollTo(0, 0)
    const navlinks = document.querySelector('.nav-links-container')
    setNav(navlinks)
  }, [])

  const [email, setEmail] = useState('');
  const navigate = useNavigate(); // Using the mock or actual hook
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // Using state for login status

  // Check localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('uID')) {
      setIsUserLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('uID');
    }
    setIsUserLoggedIn(false);
    navigate('/'); // Navigate to home or login page after logout
  };


  // Typewriter animation state
  const [typedText, setTypedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const words = ["Hope Again", "Your Valuables", "Lost Items", "Peace of Mind"];
  const [wordIndex, setWordIndex] = useState(0);
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseBeforeDelete = 1500;
  const pauseBeforeType = 500;

  useEffect(() => {
    let timer;
    const currentWord = words[wordIndex];

    if (isDeleting) {
      timer = setTimeout(() => {
        setTypedText(currentWord.substring(0, currentIndex - 1));
        setCurrentIndex(currentIndex - 1);
      }, deletingSpeed);
    } else {
      timer = setTimeout(() => {
        setTypedText(currentWord.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, typingSpeed);
    }

    if (!isDeleting && currentIndex === currentWord.length) {
      setTimeout(() => setIsDeleting(true), pauseBeforeDelete);
    } else if (isDeleting && currentIndex === 0) {
      setIsDeleting(false);
      setWordIndex((prevWordIndex) => (prevWordIndex + 1) % words.length);
      // No explicit setCurrentIndex(0) here, it's handled by the typing logic
      // setTimeout(() => {}, pauseBeforeType); // Pause handled by main logic
    }

    return () => clearTimeout(timer);
  }, [currentIndex, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseBeforeDelete]);


  const styles = {
    container: {
      fontFamily: "'Inter', sans-serif",
      lineHeight: '1.6',
      color: '#334155',
      background: '#f8fafc',
      minHeight: '100vh',
      overflowX: 'hidden', // Prevent horizontal scroll
    },
    // Modified maxWidth to remove horizontal padding for the navbar specifically
    maxWidth: {
      maxWidth: '1280px', // Standard max width
      margin: '0 auto',
      // No padding here for the main container to allow edge-to-edge in certain sections
    },
    // A specific maxWidth for sections that need padding, e.g., content sections
    contentMaxWidth: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 24px' // Apply padding here for content sections
    },
    navbar: {
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(15px)',
      borderBottom: '1px solid #e2e8f0',
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 1000,
      padding: '1.2rem 0',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    },
    navContent: {
      display: 'flex',
      justifyContent: 'space-between', // Keeps logo and button group at ends
      alignItems: 'center',
      padding: '0 24px', // Apply padding directly to navContent for spacing
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      cursor: 'pointer',
    },
    logoIconContainer: { // Added class for targeting
      width: '40px',
      height: '40px',
      background: 'linear-gradient(45deg, #4F46E5, #7C3AED)',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '18px',
      boxShadow: '0 6px 15px rgba(79, 70, 229, 0.25)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Added for smooth hover
    },
    logoTextSpan: { // Added class for targeting
      fontSize: '1.8rem',
      fontWeight: '700',
      background: 'linear-gradient(45deg, #4F46E5, #7C3AED)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      transition: 'filter 0.3s ease', // Added for smooth hover
    },
    // New style for centering nav links
    navLinksCentered: {
      display: 'flex',
      alignItems: 'center',
      gap: '2.5rem',
      flexGrow: 1, // Allows it to take available space
      justifyContent: 'center', // Centers the links within the flex-grow space
    },
    navLink: { // Base styles for navLink
      textDecoration: 'none',
      color: '#64748b',
      fontWeight: '500',
      fontSize: '0.95rem',
      transition: 'color 0.3s ease, transform 0.2s ease',
      padding: '8px 0',
      position: 'relative', // For the ::after pseudo-element
    },
    btnPrimary: {
      background: 'linear-gradient(45deg, #4F46E5, #7C3AED)',
      color: 'white',
      padding: '12px 25px',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 8px 20px rgba(79, 70, 229, 0.2)',
      transform: 'translateY(0)',
    },
    btnSecondary: {
      background: '#ffffff',
      color: '#475569',
      padding: '12px 25px',
      border: '1px solid #cbd5e1',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
    },
    // New style for outlined button (Register)
    btnOutline: {
      background: 'transparent',
      color: '#4F46E5', // Primary color for text
      padding: '12px 25px',
      border: '2px solid #4F46E5', // Primary color for border
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 4px 10px rgba(79, 70, 229, 0.1)', // Subtle shadow
    },
    hero: {
      padding: '160px 0 120px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
    },
    heroBackground: {
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'radial-gradient(circle at 15% 10%, rgba(79, 70, 229, 0.05) 0%, transparent 40%), radial-gradient(circle at 85% 90%, rgba(124, 58, 237, 0.05) 0%, transparent 40%)',
      zIndex: 0, // Ensure it's behind content
    },
    heroContent: { // Wrapper for hero text content to ensure it's above background
        position: 'relative',
        zIndex: 1,
    },
    heroTitle: {
      fontSize: 'clamp(2.5rem, 6vw, 3.8rem)', // Responsive font size
      fontWeight: '800',
      marginBottom: '1rem',
      lineHeight: '1.15',
      letterSpacing: '-0.03em',
      color: '#1e293b',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    heroTitleStatic: {
      color: '#1e293b',
      fontWeight: '800',
      marginRight: '12px',
    },
    heroGradient: {
      background: 'linear-gradient(45deg, #4F46E5, #7C3AED, #9333ea)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      display: 'inline-block',
      minWidth: '200px', // Adjust as needed for longest word
      textAlign: 'left',
    },
    heroSubtitle: {
      fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', // Responsive font size
      color: '#64748b',
      marginBottom: '3rem',
      maxWidth: '700px',
      marginLeft: 'auto',
      marginRight: 'auto',
      lineHeight: '1.8',
    },
    heroButtons: {
      display: 'flex',
      gap: '1.25rem',
      justifyContent: 'center',
      marginBottom: '4rem',
      flexWrap: 'wrap',
    },
    stats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', // Slightly wider min for stats
      gap: '2rem',
      maxWidth: '1000px',
      margin: '0 auto',
    },
    statItem: {
      textAlign: 'center',
      background: '#ffffff',
      padding: '1.8rem 1.2rem',
      borderRadius: '16px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
      border: '1px solid #f1f5f9',
      transition: 'all 0.3s ease-out', // Smoother transition
    },
    statNumber: {
      fontSize: 'clamp(2rem, 5vw, 2.5rem)', // Responsive
      fontWeight: '800',
      background: 'linear-gradient(45deg, #4F46E5, #7C3AED)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '0.4rem',
    },
    statLabel: {
      color: '#64748b',
      fontWeight: '600',
      fontSize: '0.9rem',
    },
    section: {
      padding: 'clamp(60px, 10vw, 100px) 0', // Responsive padding
    },
    sectionWhite: {
      background: '#ffffff',
    },
    sectionGray: {
      background: '#f8fafc',
      borderTop: '1px solid #e2e8f0',
      borderBottom: '1px solid #e2e8f0',
    },
    sectionTitle: {
      fontSize: 'clamp(2.2rem, 5vw, 3rem)', // Responsive
      fontWeight: '800',
      textAlign: 'center',
      marginBottom: '1.2rem',
      color: '#1e293b',
      letterSpacing: '-0.02em',
    },
    sectionSubtitle: {
      fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', // Responsive
      color: '#64748b',
      textAlign: 'center',
      marginBottom: '4rem',
      maxWidth: '700px',
      marginLeft: 'auto',
      marginRight: 'auto',
      lineHeight: '1.8',
    },
    grid: {
      display: 'grid',
      // Adjusted minmax for wider cards on desktop
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
      gap: '2.5rem', // Slightly increased gap
    },
    testimonialGrid: { // Specific grid for testimonials if different layout needed
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '2.5rem',
        justifyContent: 'center', // Added to center the grid items
    },
    card: {
      background: 'rgba(255, 255, 255, 0.95)', // Slightly transparent for depth
      padding: '2rem',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
      transition: 'all 0.3s ease-out', // Smoother transition
      border: '1px solid #f1f5f9',
      position: 'relative',
      overflow: 'hidden', // Good for potential overflow effects
      backdropFilter: 'blur(3px)', // Subtle blur for cards on certain backgrounds
    },
    cardIcon: {
      width: '60px',
      height: '60px',
      background: 'linear-gradient(45deg, #4F46E5, #7C3AED)',
      borderRadius: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '1.5rem',
      color: 'white',
      fontSize: '24px',
      boxShadow: '0 6px 18px rgba(79, 70, 229, 0.2)',
    },
    cardTitle: {
      fontSize: '1.3rem',
      fontWeight: '700',
      marginBottom: '0.8rem',
      color: '#1e293b',
    },
    cardDescription: {
      color: '#64748b',
      lineHeight: '1.7',
      fontSize: '1rem',
    },
    stepNumber: {
      width: '60px',
      height: '60px',
      background: 'linear-gradient(45deg, #4F46E5, #7C3AED)',
      color: 'white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.6rem',
      fontWeight: '700',
      margin: '0 auto 1.8rem',
      boxShadow: '0 6px 18px rgba(79, 70, 229, 0.2)',
    },
    testimonialCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      padding: '2.2rem',
      borderRadius: '16px',
      border: '1px solid #f1f5f9',
      transition: 'all 0.3s ease-out',
      position: 'relative',
      overflow: 'hidden',
      backdropFilter: 'blur(3px)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.04)',
      height: '100%', // Ensure cards in a row have same height
      display: 'flex',
      flexDirection: 'column',
    },

    testimonialQuote: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      width: '36px',
      height: '36px',
      background: 'linear-gradient(45deg, #4F46E5, #7C3AED)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      opacity: 0.7,
    },
    testimonialContent: {
      color: '#475569',
      marginBottom: '1.5rem',
      fontStyle: 'italic',
      lineHeight: '1.7',
      fontSize: '1rem',
      fontWeight: '400',
      flexGrow: 1,
    },
    testimonialAuthor: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.8rem',
      marginTop: 'auto',
    },
    authorAvatar: {
      width: '52px',
      height: '52px',
      background: 'linear-gradient(45deg, #4F46E5, #7C3AED)',
      color: 'white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '600',
      fontSize: '1.1rem',
      boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)',
    },
    authorDetails: { flex: 1 },
    authorName: {
      color: '#1e293b',
      fontWeight: '600',
      margin: 0,
      fontSize: '1rem',
    },
    authorRole: {
      color: '#64748b',
      fontSize: '0.85rem',
      margin: '0.15rem 0 0.4rem 0',
      fontWeight: '500',
    },
    stars: { display: 'flex', gap: '2px' },
    star: {
      width: '14px',
      height: '14px',
      fill: '#F59E0B', // Changed from stroke to fill for solid stars
      color: '#F59E0B', // For Lucide icons, color prop works
    },
    cta: {
      padding: 'clamp(60px, 10vw, 100px) 0',
      background: '#1e293b',
      color: 'white',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    ctaBackground: {
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'radial-gradient(circle at 10% 80%, rgba(79, 70, 229, 0.1) 0%, transparent 40%), radial-gradient(circle at 90% 20%, rgba(124, 58, 237, 0.1) 0%, transparent 40%)',
      zIndex: 0,
    },
    ctaContent: { position: 'relative', zIndex: 1 },
    ctaTitle: {
      fontSize: 'clamp(2rem, 4.5vw, 2.8rem)', // Responsive
      fontWeight: '800',
      marginBottom: '1.2rem',
      letterSpacing: '-0.02em',
    },
    ctaSubtitle: {
      fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', // Responsive
      marginBottom: '2.5rem',
      opacity: '0.85',
      maxWidth: '650px',
      marginLeft: 'auto',
      marginRight: 'auto',
      lineHeight: '1.7',
    },
    emailSignup: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      marginTop: '2rem',
      flexWrap: 'wrap', // Allow wrapping on small screens
      maxWidth: '550px',
      margin: '2rem auto 0',
    },
    emailInput: {
      padding: '14px 22px',
      border: '1px solid #4a5568', // Darker border for contrast on dark bg
      borderRadius: '8px',
      fontSize: '1rem',
      minWidth: '0', // Allow flex to shrink
      background: 'rgba(255,255,255,0.9)',
      color: '#1e293b',
      outline: 'none',
      flex: '1 1 300px', // Flex grow, shrink, basis
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      transition: 'all 0.3s ease',
    },
    footer: {
      background: '#0f172a', // Darker footer
      color: '#94a3b8',
      padding: '2.5rem 0',
      textAlign: 'center',
      fontSize: '0.9rem',
    }
  };

  const features = [
    { icon: <Search size={24}/>, title: "Smart Search", description: "Advanced filtering and AI-powered matching to find your lost items quickly and efficiently." },
    { icon: <MapPin size={24}/>, title: "Location Tracking", description: "GPS-based location logging to help track where items were lost or found with precision." },
    { icon: <Shield size={24}/>, title: "Secure Platform", description: "Verified users and secure messaging to ensure safe and trustworthy item exchanges." },
    { icon: <Clock size={24}/>, title: "Real-time Updates", description: "Instant notifications when potential matches are found for your items." }
  ];

  const steps = [
    { number: 1, title: "Report Your Item", description: "Quickly post details about your lost or found item with photos and location information." },
    { number: 2, title: "Smart Matching", description: "Our AI automatically matches your item with potential matches in the database." },
    { number: 3, title: "Connect Safely", description: "Communicate through our secure platform to arrange safe item exchange." }
  ];

  const testimonials = [
    { name: "Sarah J.", role: "University Student", content: "Found my lost laptop within 2 days! The community here is amazing and the app made the whole process incredibly easy.", rating: 5, avatar: "SJ" },
    { name: "Mike C.", role: "Photographer", content: "I've helped return over 15 items. It feels great to be part of such a helpful community. Highly recommended!", rating: 5, avatar: "MC" },
    { name: "Emma D.", role: "Teacher", content: "Lost my wedding ring at the park. Thanks to this app, a kind stranger found it and returned it safely the next day!", rating: 5, avatar: "ED" }
  ];

  return (
    <div style={styles.container}>
      {/* Global styles and media queries for responsiveness */}
      <style>{`
        /* Blinking cursor for typewriter */
        .typewriter-cursor {
          animation: blink 1s step-end infinite;
          margin-left: 2px; /* Small space for cursor */
          font-weight: normal; /* Ensure cursor isn't too bold */
        }
        @keyframes blink {
          from, to { color: transparent; }
          50% { color: #4F46E5; } /* Match hero gradient color */
        }

        /* NavLink Hover */
        .nav-link-hoverable:hover {
          color: #4F46E5 !important; /* Primary color */
          transform: translateY(-1px);
        }
        .nav-link-hoverable::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -2px; /* Position slightly below text */
          left: 50%;
          transform: translateX(-50%);
          background-color: #4F46E5;
          transition: width 0.3s ease-in-out;
          border-radius: 1px;
        }
        .nav-link-hoverable:hover::after {
          width: 70%; /* Underline doesn't have to be 100% */
        }

        /* Button Hovers */
        .btn-primary-hoverable:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 12px 25px rgba(79, 70, 229, 0.35) !important;
          filter: brightness(1.1);
        }
        .btn-secondary-hoverable:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 8px 20px rgba(0,0,0,0.12) !important;
          border-color: #4F46E5 !important;
          color: #4F46E5 !important;
          background: rgba(79, 70, 229, 0.05) !important;
        }
        .btn-outline-hoverable:hover {
            transform: translateY(-3px) scale(1.02);
            background: rgba(79, 70, 229, 0.05) !important;
            box-shadow: 0 8px 20px rgba(79, 70, 229, 0.1) !important;
        }
        
        /* Card Hovers */
        .card-hoverable:hover, 
        .stat-item-hoverable:hover, 
        .testimonial-card-hoverable:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.09) !important;
        }

        /* Logo Hover */
        .logo-hoverable .logo-icon-container-animated:hover {
          transform: scale(1.1) rotate(-5deg);
          box-shadow: 0 8px 20px rgba(79, 70, 229, 0.35) !important;
        }
        .logo-hoverable .logo-text-span-animated:hover {
          filter: brightness(1.2);
        }
        
        /* --- Responsive adjustments for various screen sizes --- */

        /* Extra Small devices (e.g., small phones, < 480px) */
        @media (max-width: 480px) {
          .navContent {
            flex-direction: column; /* Stack logo and buttons */
            align-items: center;
            gap: 1rem;
          }
          .nav-links-container {
            display: none; /* Hide for very small screens - consider burger menu if functionality allows*/
          }
          .hero-title-container {
            font-size: 2rem !important; /* Smaller title for tiny screens */
            margin-left: 10px;
            margin-right: 10px;
          }
          .hero-title-container span:first-child { /* Adjust static part of title */
            margin-right: 0 !important; /* Remove margin for stacking */
            display: block; /* Force to new line if wrapping */
          }
          .heroGradient {
            min-width: unset !important; /* Allow text to wrap naturally */
            text-align: center !important;
          }
          .heroSubtitle {
            font-size: 0.9rem !important; /* Smaller subtitle */
            padding: 0 15px; /* Adjust padding */
          }
          .hero-buttons-container {
            flex-direction: column; /* Stack buttons */
            width: 90%;
            margin-left: auto;
            margin-right: auto;
          }
          .hero-buttons-container button {
             width: 100%; /* Full width buttons */
             margin-bottom: 10px;
           }
          .stats-grid-container {
             grid-template-columns: 1fr; /* Stack stats items */
             padding: 0 20px;
          }
          .stat-item-hoverable {
            padding: 1.5rem 1rem !important;
          }
          .main-grid-container {
             grid-template-columns: 1fr !important; /* Stack cards on mobile */
             padding: 0 20px;
             gap: 2rem !important;
           }
          .sectionTitle {
            font-size: 1.8rem !important;
            padding: 0 15px;
          }
          .sectionSubtitle {
            font-size: 0.95rem !important;
            padding: 0 15px;
            margin-bottom: 2rem !important;
          }
          .card, .testimonialCard {
            padding: 1.5rem !important;
          }
          .emailSignup {
            flex-direction: column; /* Stack email input and button */
            width: 90%;
            margin-left: auto;
            margin-right: auto;
            gap: 0.8rem !important;
          }
          .emailInput {
            flex: 1 1 auto !important; /* Allow input to take full width */
            min-width: unset !important;
          }
          .ctaTitle {
            font-size: 1.8rem !important;
          }
          .ctaSubtitle {
            font-size: 0.95rem !important;
          }
          .contentMaxWidth {
            padding: 0 16px !important; /* Tighter padding for very small screens */
          }
        }

        /* Small to Medium devices (e.g., phones, 481px - 768px) */
        @media (min-width: 481px) and (max-width: 768px) {
          .navContent {
            padding: 0 20px; /* Slightly more padding */
          }
          .nav-links-container { /* Hide navigation links on smaller screens */
            display: none; 
          }
          .hero-title-container {
              font-size: 2.8rem !important; /* Adjust font size for mobile */
              padding: 0 20px;
          }
          .heroGradient {
             min-width: 180px !important; /* Ensure gradient text has space */
          }
           .hero-buttons-container {
             gap: 1rem !important;
             flex-direction: row; /* Keep buttons in a row for slightly larger phones */
             flex-wrap: wrap; /* Allow wrapping if content is too wide */
             padding: 0 20px;
           }
           .hero-buttons-container button {
             flex: 1 1 auto; /* Allow buttons to grow/shrink */
             min-width: 150px; /* Minimum width for buttons */
           }
           .stats-grid-container {
             grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)) !important; /* Two columns on most phones */
             padding: 0 20px;
           }
           .main-grid-container {
             grid-template-columns: 1fr !important; /* Stack cards on mobile */
             padding: 0 20px;
           }
           .sectionTitle {
            font-size: 2rem !important;
            padding: 0 20px;
           }
           .sectionSubtitle {
            padding: 0 20px;
           }
           .emailSignup {
            flex-direction: column; /* Stack email input and button */
            width: 80%;
            margin-left: auto;
            margin-right: auto;
           }
           .emailInput {
            flex: 1 1 auto !important;
           }
        }

        /* Medium to Large devices (e.g., tablets, 769px - 1024px) */
        @media (min-width: 769px) and (max-width: 1024px) {
          .navContent {
            padding: 0 30px; /* Adjust padding for tablets */
          }
          .nav-links-container { /* Show nav links on tablets, but adjust gap */
            display: flex;
            gap: 1.5rem !important;
          }
          .hero-title-container {
            font-size: clamp(3rem, 5vw, 3.5rem) !important;
          }
          .heroSubtitle {
            font-size: 1.05rem !important;
          }
          .stats-grid-container {
             grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)) !important; /* 2-4 columns on tablets */
             padding: 0 30px;
           }
           .main-grid-container, .testimonialGrid {
             grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important; /* 2-3 columns on tablets */
             padding: 0 30px;
           }
           .sectionTitle {
            font-size: 2.5rem !important;
           }
           .emailSignup {
            flex-direction: row; /* Keep in row for tablets */
            flex-wrap: nowrap;
           }
           .emailInput {
            flex: 1 1 auto !important;
           }
           .contentMaxWidth {
            padding: 0 24px !important; /* Default padding for content */
          }
        }

        /* Large devices (Desktops, > 1024px) - mostly uses existing styles, but define explicitly for clarity */
        @media (min-width: 1025px) {
          .navContent {
            padding: 0 24px;
          }
          .nav-links-container {
            display: flex; /* Ensure visible on desktop */
            gap: 2.5rem;
          }
          .hero-title-container {
            font-size: 3.8rem;
          }
          .heroSubtitle {
            font-size: 1.15rem;
          }
          .stats-grid-container {
             grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
           }
           .main-grid-container {
             grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
           }
           .testimonialGrid {
             grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
           }
           .sectionTitle {
            font-size: 3rem;
           }
           .emailSignup {
            flex-direction: row;
            flex-wrap: nowrap;
           }
           .emailInput {
            flex: 1 1 300px;
           }
           .contentMaxWidth {
            padding: 0 24px; /* Default padding for content */
          }
        }
      `}</style>

      <nav style={styles.navbar}>
        {/* Removed styles.maxWidth from this div, padding moved to navContent */}
        <div style={styles.navContent}>
          <div style={styles.logo} className="logo-hoverable" onClick={() => navigate('/')} title="Go to Homepage">
            <div style={styles.logoIconContainer} className="logo-icon-container-animated">
              <Search size={20} />
            </div>
            <span style={styles.logoTextSpan} className="logo-text-span-animated">Findr</span>
          </div>

          {/* Centered navigation links */}
          <div style={styles.navLinksCentered} className="nav-links-container" >
          <div className="closeBTN" onClick={()=>{
            navLinks.classList.toggle('show-navbar')
          }}>
                   <ImCross/>
           </div>
            <a href="#features" style={styles.navLink} className="nav-link-hoverable">Features</a>
            <a href="#how-it-works" style={styles.navLink} className="nav-link-hoverable">How It Works</a>
            <a href="#testimonials" style={styles.navLink} className="nav-link-hoverable">Reviews</a>
          </div>

          {/* Buttons aligned to the right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {!isUserLoggedIn ? (
              <>
                <button
                  style={styles.btnOutline} // Register button with outline style
                  className="btn-outline-hoverable"
                  onClick={() => navigate("/Signup")} // Assuming a register route
                > 
                  Register
                </button>
                <button 
                  style={styles.btnPrimary} 
                  className="btn-primary-hoverable" 
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              </>
            ) : (
              <>
              
              <button
                  style={styles.btnOutline} // Register button with outline style
                  className="btn-outline-hoverable"
                  onClick={() =>{
                    (localStorage.uID==='7')?
                    navigate("/adminDashboard")
                    :
                      navigate("/userDashboard") 
                  } }// Assuming a register route
                > 
                  Dashboard
                </button>
                <button 
                  style={styles.btnPrimary} 
                  className="btn-primary-hoverable" 
                  onClick={() =>{ 
                    navigate("/")
                    localStorage.clear('uID')
                    setIsUserLoggedIn(!isUserLoggedIn)

                  }}
                >
                  Logout
                </button>
                </>
            )}
          </div>
        </div>
      </nav>

      <section style={styles.hero} className='heroSection'>
        <div className='menu-btn'  onClick={
          ()=>{
                navLinks.classList.toggle('show-navbar')
        }}><MdArrowBackIos/></div>
        <div style={styles.heroBackground}></div>
        <div style={{...styles.contentMaxWidth, ...styles.heroContent}}> {/* Use contentMaxWidth here */}
          <h1 style={styles.heroTitle} className="hero-title-container">
            <span style={styles.heroTitleStatic}>Never Lose&nbsp;</span> {/* &nbsp; for non-breaking space */}
            <span style={styles.heroGradient}>{typedText}</span>
            <span className="typewriter-cursor">|</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Connect with your community to find lost items and help others reunite with their belongings.
            Our smart platform makes recovery simple, secure, and successful.
          </p>
          <div style={styles.heroButtons} className="hero-buttons-container">
            <button 
              onClick={() => {
                (localStorage.uID)?
                navigate('/getStartedOptions')
                :
                navigate('/login')
              }} 
              style={{ ...styles.btnPrimary, fontSize: '1rem', padding: '16px 32px' }} // Larger CTA
              className="btn-primary-hoverable"
            >
              Get Started <ArrowRight style={{ marginLeft: '10px', width: '20px', height: '20px' }} />
            </button>
            <button 
              style={{ ...styles.btnSecondary, fontSize: '1rem', padding: '16px 32px' }}
              className="btn-secondary-hoverable"
              onClick={() => alert('App download link would go here!')} // Placeholder action
            >
              <Smartphone style={{ marginRight: '10px', width: '20px', height: '20px'}} /> Download App
            </button>
          </div>
          <div style={styles.stats} className="stats-grid-container">
            {[{num: "50K+", label: "Items Returned"}, {num: "100K+", label: "Active Users"}, {num: "95%", label: "Success Rate"}, {num: "24/7", label: "Support"}].map(stat => (
                   <div key={stat.label} style={styles.statItem} className="stat-item-hoverable">
                   <div style={styles.statNumber}>{stat.num}</div>
                   <div style={styles.statLabel}>{stat.label}</div>
                 </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" style={{ ...styles.section, ...styles.sectionWhite }}>
        <div style={styles.contentMaxWidth}> {/* Use contentMaxWidth here */}
          <h2 style={styles.sectionTitle}>Powerful Features</h2>
          <p style={styles.sectionSubtitle}>
            Everything you need to find lost items and help others in your community.
          </p>
          <div style={styles.grid} className="main-grid-container">
            {features.map((feature, index) => (
              <div key={index} style={styles.card} className="card-hoverable">
                <div style={styles.cardIcon}>{feature.icon}</div>
                <h3 style={styles.cardTitle}>{feature.title}</h3>
                <p style={styles.cardDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" style={{ ...styles.section, ...styles.sectionGray }}>
        <div style={styles.contentMaxWidth}> {/* Use contentMaxWidth here */}
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <p style={styles.sectionSubtitle}>Simple steps to reunite with your lost items.</p>
          <div style={styles.grid} className="main-grid-container">
            {steps.map((step, index) => (
              <div key={index} style={{ ...styles.card, textAlign: 'center' }} className="card-hoverable">
                <div style={styles.stepNumber}>{step.number}</div>
                <h3 style={styles.cardTitle}>{step.title}</h3>
                <p style={styles.cardDescription}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" style={{ ...styles.section, ...styles.sectionWhite }}>
        <div style={styles.contentMaxWidth}> {/* Use contentMaxWidth here */}
          <h2 style={styles.sectionTitle}>What Our Users Say</h2>
          <p style={styles.sectionSubtitle}>Real stories from our community members.</p>
          <div style={styles.testimonialGrid} className="main-grid-container">
            {testimonials.map((testimonial, index) => (
              <div key={index} style={styles.testimonialCard} className="testimonial-card-hoverable">
                <div style={styles.testimonialQuote}><Quote size={18} /></div>
                <div style={styles.testimonialContent}>"{testimonial.content}"</div>
                <div style={styles.testimonialAuthor}>
                  <div style={styles.authorAvatar}>{testimonial.avatar}</div>
                  <div style={styles.authorDetails}>
                    <h4 style={styles.authorName}>{testimonial.name}</h4>
                    <p style={styles.authorRole}>{testimonial.role}</p>
                    <div style={styles.stars}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} style={styles.star} size={16} /> // Use size prop for lucide
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={styles.cta}>
        <div style={styles.ctaBackground}></div>
        <div style={{...styles.contentMaxWidth, ...styles.ctaContent}}> {/* Use contentMaxWidth here */}
          <h2 style={styles.ctaTitle}>Ready to Get Started?</h2>
          <p style={styles.ctaSubtitle}>
            Join thousands of users who have successfully reunited with their lost items.
          </p>
          <form style={styles.emailSignup} onSubmit={(e) => { e.preventDefault(); alert(`Email submitted: ${email}`); setEmail(''); }}>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.emailInput}
              required
            />
            <button type="submit" style={{ ...styles.btnPrimary, minWidth: 'auto', padding: '14px 28px' }} className="btn-primary-hoverable">
              Sign Up Free
            </button>
          </form>
        </div>
      </section>

      <footer style={styles.footer}>
        <div style={styles.contentMaxWidth}> {/* Use contentMaxWidth here */}
          <p>&copy; {new Date().getFullYear()} Findr. All rights reserved. Built with <span role="img" aria-label="love"><Heart/></span> for the community.</p>
        </div>
      </footer>
    </div>
  );
}
