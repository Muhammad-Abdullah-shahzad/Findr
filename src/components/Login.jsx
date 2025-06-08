import React, { useState } from 'react';
import {useNavigate} from "react-router-dom"
import { 
  Search, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Shield,
  CheckCircle,
  AlertCircle,
  User
} from 'lucide-react';

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

  // For demo purposes - replace with actual useNavigate
  

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    else if (email && !email.includes('@umt.edu.pk')){
      newErrors.email='use umt domain @umt at the end';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Store in localStorage (note: in real Claude artifacts, this won't persist)
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('uID', data.uID);
          localStorage.setItem('token', data.token);
        }
        
        // Show success message
        setErrors({ success: 'Login successful! Redirecting...' });
        
        // Simulate navigation after delay
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setErrors({ general: data.message || 'Login failed' });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    },
    backgroundPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
      zIndex: 1
    },
    authCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      padding: '3rem',
      width: '100%',
      maxWidth: '420px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.8)',
      position: 'relative',
      zIndex: 2
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      marginBottom: '2rem'
    },
    logoIcon: {
      width: '48px',
      height: '48px',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)'
    },
    logoText: {
      fontSize: '1.8rem',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    title: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#0f172a',
      textAlign: 'center',
      marginBottom: '0.5rem',
      letterSpacing: '-0.02em'
    },
    subtitle: {
      color: '#64748b',
      textAlign: 'center',
      marginBottom: '2.5rem',
      fontSize: '1rem',
      lineHeight: '1.6'
    },
    inputGroup: {
      marginBottom: '1.5rem',
      position: 'relative'
    },
    inputWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    },
    input: {
      width: '100%',
      padding: '16px 20px 16px 52px',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      backgroundColor: '#fff',
      color: '#0f172a',
      outline: 'none',
      boxSizing: 'border-box'
    },
    inputFocused: {
      borderColor: '#6366f1',
      boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)'
    },
    inputError: {
      borderColor: '#ef4444',
      boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)'
    },
    inputIcon: {
      position: 'absolute',
      left: '16px',
      color: '#94a3b8',
      zIndex: 1,
      transition: 'color 0.3s ease'
    },
    inputIconFocused: {
      color: '#6366f1'
    },
    passwordToggle: {
      position: 'absolute',
      right: '16px',
      color: '#94a3b8',
      cursor: 'pointer',
      transition: 'color 0.3s ease',
      zIndex: 1
    },
    errorMessage: {
      color: '#ef4444',
      fontSize: '0.85rem',
      marginTop: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    successMessage: {
      color: '#10b981',
      fontSize: '0.85rem',
      marginTop: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    checkboxGroup: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '2rem'
    },
    checkboxWrapper: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    checkbox: {
      width: '18px',
      height: '18px',
      accentColor: '#6366f1'
    },
    checkboxLabel: {
      fontSize: '0.9rem',
      color: '#64748b',
      cursor: 'pointer'
    },
    forgotPassword: {
      color: '#6366f1',
      textDecoration: 'none',
      fontSize: '0.9rem',
      fontWeight: '500',
      transition: 'color 0.3s ease'
    },
    loginButton: {
      width: '100%',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '16px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      marginBottom: '1.5rem',
      boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)',
      position: 'relative',
      overflow: 'hidden'
    },
    loginButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 35px rgba(99, 102, 241, 0.4)'
    },
    loginButtonDisabled: {
      opacity: 0.7,
      cursor: 'not-allowed',
      transform: 'none'
    },
    loadingSpinner: {
      width: '20px',
      height: '20px',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      margin: '1.5rem 0',
      color: '#94a3b8',
      fontSize: '0.9rem'
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      background: '#e2e8f0'
    },
    dividerText: {
      padding: '0 1rem'
    },
    socialButtons: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem'
    },
    socialButton: {
      flex: 1,
      padding: '12px',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      background: '#fff',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.9rem',
      fontWeight: '500',
      color: '#64748b'
    },
    signupLink: {
      textAlign: 'center',
      color: '#64748b',
      fontSize: '0.95rem'
    },
    signupLinkHighlight: {
      color: '#6366f1',
      textDecoration: 'none',
      fontWeight: '600',
      transition: 'color 0.3s ease'
    },
    securityBadge: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      marginTop: '1.5rem',
      padding: '8px 12px',
      background: 'rgba(16, 185, 129, 0.1)',
      border: '1px solid rgba(16, 185, 129, 0.2)',
      borderRadius: '8px',
      color: '#10b981',
      fontSize: '0.85rem',
      fontWeight: '500'
    }
  };

  // CSS for loading animation
  const spinKeyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <>
      <style>{spinKeyframes}</style>
      <div style={styles.container}>
        <div style={styles.backgroundPattern}></div>
        
        <div style={styles.authCard}>
          {/* Logo */}
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <Search size={24} />
            </div>
            <span style={styles.logoText}>FindIt</span>
          </div>

          {/* Title */}
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>
            Sign in to your account to continue helping others find their lost items
          </p>

          {/* General Error/Success Message */}
          {errors.general && (
            <div style={styles.errorMessage}>
              <AlertCircle size={16} />
              {errors.general}
            </div>
          )}
          {errors.success && (
            <div style={styles.successMessage}>
              <CheckCircle size={16} />
              {errors.success}
            </div>
          )}

          {/* Email Input */}
          <div style={styles.inputGroup}>
            <div style={styles.inputWrapper}>
              <Mail 
                size={20} 
                style={{
                  ...styles.inputIcon,
                  ...(email ? styles.inputIconFocused : {})
                }} 
              />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors(prev => ({...prev, email: ''}));
                  }
                }}
                onKeyPress={handleKeyPress}
                style={{
                  ...styles.input,
                  ...(errors.email ? styles.inputError : {}),
                  ...(email && !errors.email ? styles.inputFocused : {})
                }}
              />
            </div>
            {errors.email && (
              <div style={styles.errorMessage}>
                <AlertCircle size={14} />
                {errors.email}
              </div>
            )}
          </div>

          {/* Password Input */}
          <div style={styles.inputGroup}>
            <div style={styles.inputWrapper}>
              <Lock 
                size={20} 
                style={{
                  ...styles.inputIcon,
                  ...(password ? styles.inputIconFocused : {})
                }} 
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors(prev => ({...prev, password: ''}));
                  }
                }}
                onKeyPress={handleKeyPress}
                style={{
                  ...styles.input,
                  
                  ...(errors.password ? styles.inputError : {}),
                  ...(password && !errors.password ? styles.inputFocused : {})
                }}
              />
              <div
                style={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
            {errors.password && (
              <div style={styles.errorMessage}>
                <AlertCircle size={14} />
                {errors.password}
              </div>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div style={styles.checkboxGroup}>
            <div style={styles.checkboxWrapper}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={styles.checkbox}
              />
              <label htmlFor="rememberMe" style={styles.checkboxLabel}>
                Remember me
              </label>
            </div>
            <a href="/forgot-password" style={styles.forgotPassword}>
              Forgot password?
            </a>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            style={{
              ...styles.loginButton,
              ...(isLoading ? styles.loginButtonDisabled : {})
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                Object.assign(e.target.style, styles.loginButtonHover);
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.3)';
              }
            }}
          >
            {isLoading ? (
              <>
                <div style={styles.loadingSpinner}></div>
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {/* Divider */}
          <div style={styles.divider}>
            <div style={styles.dividerLine}></div>
            <span style={styles.dividerText}>or</span>
            <div style={styles.dividerLine}></div>
          </div>

          {/* Social Login Buttons */}
          <div style={styles.socialButtons}>
            <button style={styles.socialButton}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button style={styles.socialButton}>
              <User size={20} />
              Guest
            </button>
          </div>

          {/* Security Badge */}
          <div style={styles.securityBadge}>
            <Shield size={16} />
            Secured with SSL encryption
          </div>

          {/* Sign Up Link */}
          <p style={styles.signupLink}>
            Don't have an account?{' '}
            <a href="/signup" style={styles.signupLinkHighlight}>
              Create one here
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;