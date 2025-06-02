import React, { useState, useEffect } from 'react';
import {
  Upload,
  MapPin,
  AlertCircle,
  Camera,
  Check,
  X,
  Smartphone,
  Shirt,
  Briefcase,
  HelpCircle,
  FileText,
  Award,
  Info
} from 'lucide-react';

// Import the Cloudinary upload function
import uploadImageToCloudinary from "./cloudinaryImageUpload"; // Adjust path if needed

const LostItemReportForm = () => {
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    location: '',
    itemCategory: '',
    contactInfo: '',
    image: null, // This will hold the File object
    acceptedTerms: false,
    uID: null, // Initialize as null; will be set to an integer via useEffect
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false); // State for loading indicator

  // Simulate fetching a user ID (replace with actual authentication logic)
  useEffect(() => {
    // In a real application, this user ID would come from your authentication system
    // (e.g., from a logged-in user's context, Redux store, or an API call).
    const loggedInUserId = parseInt(localStorage.uID); // Example: Set a static integer user ID for demonstration
    setFormData(prev => ({ ...prev, uID: loggedInUserId }));
  }, []); // Empty dependency array ensures this runs once on component mount

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
    title: {
      fontSize: '3.5rem',
      fontWeight: '800',
      marginBottom: '1rem',
      color: '#0f172a',
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
      marginBottom: '3rem',
      maxWidth: '650px',
      marginLeft: 'auto',
      marginRight: 'auto',
      lineHeight: '1.7'
    },
    progressContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '3rem'
    },
    progressStep: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    progressNumber: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.9rem',
      fontWeight: '600',
      transition: 'all 0.3s ease'
    },
    progressNumberActive: {
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      color: 'white',
      boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
    },
    progressNumberInactive: {
      background: 'rgba(255, 255, 255, 0.8)',
      color: '#64748b',
      border: '2px solid rgba(203, 213, 225, 0.8)'
    },
    progressText: {
      fontSize: '0.9rem',
      fontWeight: '500',
      color: '#64748b'
    },
    progressLine: {
      width: '60px',
      height: '2px',
      background: 'rgba(203, 213, 225, 0.5)',
      borderRadius: '1px'
    },
    mainContent: {
      display: 'grid',
      gridTemplateColumns: '1fr 400px',
      gap: '3rem',
      '@media (max-width: 1024px)': {
        gridTemplateColumns: '1fr',
        gap: '2rem'
      }
    },
    formCard: {
      background: 'rgba(255, 255, 255, 0.9)',
      padding: '3rem',
      borderRadius: '24px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.06)',
      border: '1px solid rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      position: 'relative',
      overflow: 'hidden'
    },
    sidebarCard: {
      background: 'rgba(255, 255, 255, 0.9)',
      padding: '2rem',
      borderRadius: '24px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.06)',
      border: '1px solid rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      height: 'fit-content',
      position: 'sticky',
      top: '2rem'
    },
    infoCard: {
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05))',
      border: '1px solid rgba(99, 102, 241, 0.1)',
      borderRadius: '16px',
      padding: '1.5rem',
      marginBottom: '1.5rem'
    },
    infoTitle: {
      fontSize: '1.1rem',
      fontWeight: '700',
      color: '#0f172a',
      marginBottom: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    infoText: {
      color: '#64748b',
      fontSize: '0.95rem',
      lineHeight: '1.6'
    },
    formGroup: {
      marginBottom: '2rem'
    },
    label: {
      display: 'block',
      marginBottom: '0.75rem',
      fontWeight: '600',
      color: '#0f172a',
      fontSize: '1rem'
    },
    input: {
      width: '100%',
      padding: '1rem 1.25rem',
      borderRadius: '12px',
      border: '2px solid rgba(203, 213, 225, 0.5)',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(5px)',
      outline: 'none',
      boxSizing: 'border-box'
    },
    inputFocused: {
      borderColor: '#6366f1',
      boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)'
    },
    textarea: {
      width: '100%',
      padding: '1rem 1.25rem',
      height: '120px',
      borderRadius: '12px',
      border: '2px solid rgba(203, 213, 225, 0.5)',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(5px)',
      outline: 'none',
      resize: 'vertical',
      fontFamily: 'inherit',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: '1rem 1.25rem',
      borderRadius: '12px',
      border: '2px solid rgba(203, 213, 225, 0.5)',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(5px)',
      outline: 'none',
      cursor: 'pointer',
      boxSizing: 'border-box'
    },
    imageUpload: {
      marginBottom: '2rem'
    },
    imageUploadInput: {
      display: 'none'
    },
    imageUploadLabel: {
      display: 'block',
      border: '2px dashed rgba(99, 102, 241, 0.3)',
      borderRadius: '16px',
      padding: '2rem',
      cursor: 'pointer',
      textAlign: 'center',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.02), rgba(139, 92, 246, 0.02))',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    },
    imageUploadLabelHover: {
      borderColor: '#6366f1',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05))'
    },
    imagePreview: {
      width: '100%',
      maxHeight: '300px',
      objectFit: 'cover',
      borderRadius: '12px'
    },
    uploadPlaceholder: {
      color: '#64748b'
    },
    uploadIcon: {
      width: '60px',
      height: '60px',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1rem',
      color: 'white',
      boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)'
    },
    uploadText: {
      marginTop: '1rem',
      fontWeight: '600',
      fontSize: '1.1rem',
      color: '#0f172a'
    },
    uploadSubtext: {
      fontSize: '0.95rem',
      color: '#64748b',
      marginTop: '0.5rem'
    },
    locationGroup: {
      position: 'relative'
    },
    locationButton: {
      position: 'absolute',
      right: '12px',
      top: '44px',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      color: 'white',
      padding: '0.75rem 1rem',
      borderRadius: '8px',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.9rem',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
      marginBottom: '2rem',
      padding: '1.5rem',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05))',
      borderRadius: '12px',
      border: '1px solid rgba(99, 102, 241, 0.1)'
    },
    checkbox: {
      width: '20px',
      height: '20px',
      marginTop: '2px',
      cursor: 'pointer'
    },
    checkboxLabel: {
      fontSize: '0.95rem',
      color: '#374151',
      lineHeight: '1.6',
      cursor: 'pointer'
    },
    submitButton: {
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      color: 'white',
      padding: '1rem 2rem',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '1.1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      width: '100%',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)',
      transform: 'translateY(0)'
    },
    submitButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 35px rgba(99, 102, 241, 0.4)'
    },
    submitButtonDisabled: {
      opacity: 0.7,
      cursor: 'not-allowed',
      boxShadow: 'none',
      transform: 'none',
      background: '#94a3b8'
    },
    categoryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: '1rem',
      marginTop: '1rem'
    },
    categoryCard: {
      padding: '1rem',
      borderRadius: '12px',
      border: '2px solid rgba(203, 213, 225, 0.5)',
      background: 'rgba(255, 255, 255, 0.8)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.5rem'
    },
    categoryCardSelected: {
      borderColor: '#6366f1',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
      boxShadow: '0 4px 15px rgba(99, 102, 241, 0.2)'
    },
    categoryIcon: {
      width: '32px',
      height: '32px',
      color: '#6366f1'
    },
    categoryText: {
      fontSize: '0.9rem',
      fontWeight: '500',
      color: '#0f172a'
    },
    modal: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 50,
      backdropFilter: 'blur(5px)'
    },
    modalContent: {
      background: 'rgba(255, 255, 255, 0.95)',
      padding: '3rem',
      borderRadius: '24px',
      maxWidth: '450px',
      width: '90%',
      position: 'relative',
      textAlign: 'center',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.8)',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
    },
    modalIcon: {
      width: '80px',
      height: '80px',
      margin: '0 auto 1.5rem',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white'
    },
    modalIconSuccess: {
      background: 'linear-gradient(135deg, #10b981, #059669)'
    },
    modalIconError: {
      background: 'linear-gradient(135deg, #ef4444, #dc2626)'
    },
    modalTitle: {
      fontWeight: '700',
      fontSize: '1.5rem',
      margin: '0 0 2rem 0',
      color: '#0f172a'
    },
    modalButton: {
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      color: 'white',
      padding: '0.75rem 2rem',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
    },
    closeButton: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      background: 'rgba(100, 116, 139, 0.1)',
      border: 'none',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      color: '#64748b'
    },
    helpCard: {
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(5, 150, 105, 0.05))',
      border: '1px solid rgba(16, 185, 129, 0.1)',
      borderRadius: '16px',
      padding: '1.5rem',
      marginBottom: '1.5rem'
    },
    tipsList: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    tipItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
      marginBottom: '1rem',
      fontSize: '0.9rem',
      color: '#374151',
      lineHeight: '1.5'
    },
    tipIcon: {
      width: '20px',
      height: '20px',
      color: '#10b981',
      marginTop: '1px',
      flexShrink: 0
    }
  };

  const categories = [
    { value: 'electronics', label: 'Electronics', icon: <Smartphone /> },
    { value: 'documents', label: 'Documents', icon: <FileText /> },
    { value: 'accessories', label: 'Accessories', icon: <Award /> },
    { value: 'clothing', label: 'Clothing', icon: <Shirt /> },
    { value: 'bags', label: 'Bags', icon: <Briefcase /> },
    { value: 'other', label: 'Other', icon: <HelpCircle /> }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCategorySelect = (category) => {
    setFormData((prev) => ({
      ...prev,
      itemCategory: category,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Frontend validation
    if (!formData.itemName || !formData.description || !formData.location ||
        !formData.contactInfo || !formData.itemCategory) {
        setModalMessage('Please fill in all required fields.');
        setIsModalOpen(true);
        return;
    }

    if (!formData.acceptedTerms) {
      setModalMessage('Please accept the terms before submitting.');
      setIsModalOpen(true);
      return;
    }

    if (formData.uID === null) {
      setModalMessage('User ID is not set. Please ensure you are logged in.');
      setIsModalOpen(true);
      return;
    }

    setIsSubmitting(true); // Start loading

    let imageUrl = '';
    // Only attempt to upload if an image file is selected
    if (formData.image) {
      try {
        imageUrl = await uploadImageToCloudinary(formData.image);
        if (!imageUrl) {
          // If uploadImageToCloudinary returns null (indicating failure)
          setModalMessage('Failed to upload image. Please try again.');
          setIsModalOpen(true);
          setIsSubmitting(false); // Stop loading
          return;
        }
      } catch (error) {
        // Catch any uncaught errors from uploadImageToCloudinary
        setModalMessage(`Image upload error: ${error.message}`);
        setIsModalOpen(true);
        setIsSubmitting(false); // Stop loading
        return;
      }
    }

    const dataToSubmit = {
      itemName: formData.itemName,
      description: formData.description,
      location: formData.location,
      contactInfo: formData.contactInfo,
      itemCategory: formData.itemCategory,
      acceptedTerms: formData.acceptedTerms,
      imageUrl: imageUrl, // Use the Cloudinary image URL (can be empty string if no image)
      uID: formData.uID, // This will now be an integer
    };

    try {
      const response = await fetch('http://localhost:5000/report-lost-item', { // Adjust URL if needed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });

      const result = await response.json();

      if (response.ok) {
        setModalMessage(`Successfully submitted: ${result.message}`);
        // Reset form after successful submission (except for uID if persistent)
        setFormData(prev => ({
          itemName: '',
          description: '',
          location: '',
          itemCategory: '',
          contactInfo: '',
          image: null,
          acceptedTerms: false,
          uID: prev.uID, // Keep the same user ID if it's persistent across submissions
        }));
      } else {
        setModalMessage(`Error: ${result.message || 'Something went wrong.'}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setModalMessage('Network error or server is unreachable. Please try again.');
    } finally {
      setIsSubmitting(false); // Stop loading regardless of success/failure
      setIsModalOpen(true);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            location: `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`,
          }));
        },
        (error) => {
          let errorMessage = 'Location access denied or unavailable.';
          if (error.code === error.PERMISSION_DENIED) {
            errorMessage = 'Location access denied. Please enable location services in your browser settings.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMessage = 'Location information is unavailable.';
          } else if (error.code === error.TIMEOUT) {
            errorMessage = 'The request to get user location timed out.';
          }
          setModalMessage(errorMessage);
          setIsModalOpen(true);
        }
      );
    } else {
      setModalMessage('Geolocation is not supported by your browser.');
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerBackground}></div>
          <h1 style={styles.title}>
            Report Your
            <span style={styles.titleGradient}>Lost Item</span>
          </h1>
          <p style={styles.subtitle}>
            Help us help you find your lost belongings. Fill out this form with as much detail as possible to increase your chances of recovery.
          </p>

          {/* Progress Steps */}
          <div style={styles.progressContainer}>
            <div style={styles.progressStep}>
              <div style={{ ...styles.progressNumber, ...(currentStep === 1 ? styles.progressNumberActive : styles.progressNumberInactive) }}>1</div>
              <span style={styles.progressText}>Item Details</span>
            </div>
            <div style={styles.progressLine}></div>
            <div style={styles.progressStep}>
              <div style={{ ...styles.progressNumber, ...(currentStep === 2 ? styles.progressNumberActive : styles.progressNumberInactive) }}>2</div>
              <span style={styles.progressText}>Review & Submit</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.mainContent}>
          {/* Form Card */}
          <div style={styles.formCard}>
            <form onSubmit={handleSubmit}>
              {/* Image Upload */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Upload Image</label>
                <div style={styles.imageUpload}>
                  <input
                    type="file"
                    id="imageUpload"
                    name="image"
                    style={styles.imageUploadInput}
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="imageUpload" style={styles.imageUploadLabel}>
                    {formData.image ? (
                      <img
                        src={URL.createObjectURL(formData.image)}
                        alt="Uploaded"
                        style={styles.imagePreview}
                      />
                    ) : (
                      <div style={styles.uploadPlaceholder}>
                        <div style={styles.uploadIcon}>
                          <Camera size={28} />
                        </div>
                        <div style={styles.uploadText}>Upload Item Image</div>
                        <div style={styles.uploadSubtext}>
                          Click to browse or drag and drop
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Item Name */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Item Name</label>
                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="What did you lose? (e.g., iPhone 13, Black Wallet)"
                  required
                />
              </div>

              {/* Description */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Detailed Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  style={styles.textarea}
                  placeholder="Describe your item in detail including color, brand, unique features, or any distinguishing marks..."
                  required
                />
              </div>

              {/* Location */}
              <div style={{ ...styles.formGroup, ...styles.locationGroup }}>
                <label style={styles.label}>Where did you lose it?</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Last known location (e.g., Central Park, Coffee Shop on Main St)"
                  required
                />
                <button
                  type="button"
                  style={styles.locationButton}
                  onClick={handleGetLocation}
                >
                  <MapPin size={16} /> Use Current Location
                </button>
              </div>

              {/* Category Selection */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Item Category</label>
                <div style={styles.categoryGrid}>
                  {categories.map((category) => (
                    <div
                      key={category.value}
                      style={{
                        ...styles.categoryCard,
                        ...(formData.itemCategory === category.value ? styles.categoryCardSelected : {})
                      }}
                      onClick={() => handleCategorySelect(category.value)}
                    >
                      <div style={styles.categoryIcon}>
                        {category.icon}
                      </div>
                      <span style={styles.categoryText}>{category.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Contact Information</label>
                <input
                  type="text"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Email address or phone number"
                  required
                />
              </div>

              {/* Terms Checkbox */}
              <div style={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  name="acceptedTerms"
                  checked={formData.acceptedTerms}
                  onChange={handleChange}
                  style={styles.checkbox}
                  id="terms"
                  required
                />
                <label htmlFor="terms" style={styles.checkboxLabel}>
                  I confirm that the information provided is accurate and I agree to the terms of service. I understand that false reports may result in account suspension.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                style={{ ...styles.submitButton, ...(isSubmitting ? styles.submitButtonDisabled : {}) }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.target.style.transform = styles.submitButtonHover.transform;
                    e.target.style.boxShadow = styles.submitButtonHover.boxShadow;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.target.style.transform = styles.submitButton.transform;
                    e.target.style.boxShadow = styles.submitButton.boxShadow;
                  }
                }}
                disabled={isSubmitting || formData.uID === null} // Disable if submitting or uID is not set
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner" style={{ marginRight: '0.5rem', border: '3px solid rgba(255, 255, 255, 0.3)', borderTop: '3px solid #fff', borderRadius: '50%', width: '20px', height: '20px', animation: 'spin 1s linear infinite' }}></span>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Submit Lost Item Report
                  </>
                )}
              </button>
            </form>
            {/* CSS for spinner animation */}
            <style jsx>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>

          {/* Sidebar */}
          <div>
            {/* Info Card */}
            <div style={styles.sidebarCard}>
              <div style={styles.infoCard}>
                <div style={styles.infoTitle}>
                  <Info size={20} />
                  Why Report Your Lost Item?
                </div>
                <div style={styles.infoText}>
                  Our community-driven platform connects you with people who may have found your item. The more details you provide, the better your chances of recovery.
                </div>
              </div>

              <div style={styles.helpCard}>
                <div style={styles.infoTitle}>
                  <Check size={20} />
                  Tips for Better Results
                </div>
                <ul style={styles.tipsList}>
                  <li style={styles.tipItem}>
                    <Check style={styles.tipIcon} />
                    Include clear, high-quality photos
                  </li>
                  <li style={styles.tipItem}>
                    <Check style={styles.tipIcon} />
                    Be specific about location and time
                  </li>
                  <li style={styles.tipItem}>
                    <Check style={styles.tipIcon} />
                    Mention unique identifying features
                  </li>
                  <li style={styles.tipItem}>
                    <Check style={styles.tipIcon} />
                    Check back regularly for matches
                  </li>
                </ul>
              </div>

              {/* Stats */}
              <div style={styles.infoCard}>
                <div style={styles.infoTitle}>
                  <Award size={20} />
                  Success Stories
                </div>
                <div style={styles.infoText}>
                  Over **50,000 items** have been successfully returned to their owners through our platform with a **95% satisfaction rate**.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={{
              ...styles.modalIcon,
              ...(modalMessage.includes('Successfully') ? styles.modalIconSuccess : styles.modalIconError)
            }}>
              {modalMessage.includes('Successfully') ? (
                <Check size={40} />
              ) : (
                <AlertCircle size={40} />
              )}
            </div>
            <h2 style={styles.modalTitle}>{modalMessage}</h2>
            <button onClick={closeModal} style={styles.modalButton}>
              {modalMessage.includes('Successfully') ? 'Continue' : 'Try Again'}
            </button>
            <button onClick={closeModal} style={styles.closeButton}>
              <X size={20} />
            </button>
          </div>
        </div>
      )}
  
    </div>
  );
};

export default LostItemReportForm;