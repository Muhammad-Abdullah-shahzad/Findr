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
  import uploadImageToCloudinary from './cloudinaryImageUpload.js';

  const categories = [
    { value: 'Electronics', label: 'Electronics', icon: <Smartphone /> },
    { value: 'Clothing', label: 'Clothing', icon: <Shirt /> },
    { value: 'Bags', label: 'Bags', icon: <Briefcase /> },
    { value: 'Backpacks', label: 'Backpacks', icon: <Briefcase /> },
    { value: 'Accessories', label: 'Accessories', icon: <Award /> },
    { value: 'Jewelry', label: 'Jewelry', icon: <Award /> },
    { value: 'Books', label: 'Books', icon: <FileText /> },
    { value: 'Stationery', label: 'Stationery', icon: <FileText /> },
    { value: 'Keys', label: 'Keys', icon: <Award /> },
    { value: 'Documents', label: 'Documents', icon: <FileText /> },
    { value: 'ID Cards', label: 'ID Cards', icon: <FileText /> },
    { value: 'Wallets', label: 'Wallets', icon: <Briefcase /> },
    { value: 'Purses', label: 'Purses', icon: <Briefcase /> },
    { value: 'Mobile Phones', label: 'Mobile Phones', icon: <Smartphone /> },
    { value: 'Eyewear', label: 'Eyewear', icon: <Award /> },
    { value: 'Sunglasses', label: 'Sunglasses', icon: <Award /> },
    { value: 'Laptops', label: 'Laptops', icon: <Smartphone /> },
    { value: 'Tablets', label: 'Tablets', icon: <Smartphone /> },
    { value: 'Personal Items', label: 'Personal Items', icon: <HelpCircle /> },
    { value: 'Sports Equipment', label: 'Sports Equipment', icon: <Award /> },
    { value: 'Toys', label: 'Toys', icon: <HelpCircle /> },
    { value: 'Games', label: 'Games', icon: <HelpCircle /> },
    { value: 'Musical Instruments', label: 'Musical Instruments', icon: <Award /> },
    { value: 'Umbrellas', label: 'Umbrellas', icon: <HelpCircle /> },
    { value: 'Tools', label: 'Tools', icon: <HelpCircle /> },
    { value: 'Cash', label: 'Cash', icon: <FileText /> },
    { value: 'Pets', label: 'Pets', icon: <HelpCircle /> },
    { value: 'Others', label: 'Others', icon: <HelpCircle /> }
  ];

  const API_BASE = 'http://localhost:5000/api';

  const FoundItem = () => {
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

    const [form, setForm] = useState({
      itemName: '',
      description: '',
      location: '',
      itemCategory: '',
      contactInfo: '',
      imageUrl: '',
    });

    const [rawImage, setRawImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [showLocationBtn, setShowLocationBtn] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [currentStep, setCurrentStep] = useState(1);

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
        marginTop: '1rem',
        maxHeight: '300px',
        overflowY: 'auto',
        padding: '0.5rem'
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
        fontSize: '0.8rem',
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

    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCategorySelect = (category) => {
      setForm(prev => ({ ...prev, itemCategory: category }));
    };

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setRawImage(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      }
    };

    const handleLocationFocus = () => {
      setShowLocationBtn(true);
    };

    const handleUseCurrentLocation = () => {
      navigator.geolocation?.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setForm((prev) => ({
            ...prev,
            location: `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`
          }));
        },
        (err) => {
          setModalMessage(`Location error: ${err.message}`);
          setIsModalOpen(true);
        }
      );
    };

    const handleSubmit = async () => {
      const userId = localStorage.getItem('uID');
      if (!userId) {
        setModalMessage('User ID not found in localStorage.');
        setIsModalOpen(true);
        return;
      }

      const { itemName, description, location, itemCategory, contactInfo } = form;
      if (!itemName || !description || !location || !itemCategory || !contactInfo) {
        setModalMessage('Please fill all required fields.');
        setIsModalOpen(true);
        return;
      }

      setSubmitting(true);
      try {
        let imageUrl = '';
        if (rawImage) {
          imageUrl = await uploadImageToCloudinary(rawImage);
        }

        const res = await fetch(`${API_BASE}/report-found-item`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, userId, imageUrl }),
        });

        if (!res.ok) throw new Error('Failed to submit');

        setModalMessage('Found item reported successfully!');
        setForm({
          itemName: '',
          description: '',
          location: '',
          itemCategory: '',
          contactInfo: '',
          imageUrl: '',
        });
        setRawImage(null);
        setImagePreview(null);
        setShowLocationBtn(false);
      } catch (err) {
        setModalMessage(`Error: ${err.message}`);
      } finally {
        setSubmitting(false);
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
              Report a
              <span style={styles.titleGradient}>Found Item</span>
            </h1>
            <p style={styles.subtitle}>
              Help reunite someone with their lost belongings. Fill out this form with as much detail as possible to help the owner identify their item.
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
                    onChange={handleImageChange}
                  />
                  <label htmlFor="imageUpload" style={styles.imageUploadLabel}>
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Uploaded"
                        style={styles.imagePreview}
                      />
                    ) : (
                      <div style={styles.uploadPlaceholder}>
                        <div style={styles.uploadIcon}>
                          <Camera size={28} />
                        </div>
                        <div style={styles.uploadText}>Upload Found Item Image</div>
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
                  value={form.itemName}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="What did you find? (e.g., iPhone 13, Black Wallet)"
                  required
                />
              </div>

              {/* Description */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Detailed Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  style={styles.textarea}
                  placeholder="Describe the found item in detail including color, brand, unique features, or any distinguishing marks..."
                  required
                />
              </div>

              {/* Location */}
              <div style={{ ...styles.formGroup, ...styles.locationGroup }}>
                <label style={styles.label}>Where did you find it?</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  onFocus={handleLocationFocus}
                  style={styles.input}
                  placeholder="Location where found (e.g., Central Park, Coffee Shop on Main St)"
                  required
                />
                {showLocationBtn && (
                  <button
                    type="button"
                    style={styles.locationButton}
                    onClick={handleUseCurrentLocation}
                  >
                    <MapPin size={16} /> Use Current Location
                  </button>
                )}
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
                        ...(form.itemCategory === category.value ? styles.categoryCardSelected : {})
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
                  value={form.contactInfo}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Email address or phone number"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="button"
                style={{ ...styles.submitButton, ...(submitting ? styles.submitButtonDisabled : {}) }}
                onMouseEnter={(e) => {
                  if (!submitting) {
                    e.target.style.transform = styles.submitButtonHover.transform;
                    e.target.style.boxShadow = styles.submitButtonHover.boxShadow;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!submitting) {
                    e.target.style.transform = styles.submitButton.transform;
                    e.target.style.boxShadow = styles.submitButton.boxShadow;
                  }
                }}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner" style={{ marginRight: '0.5rem', border: '3px solid rgba(255, 255, 255, 0.3)', borderTop: '3px solid #fff', borderRadius: '50%', width: '20px', height: '20px', animation: 'spin 1s linear infinite' }}></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Submit Found Item Report
                  </>
                )}
              </button>

              {/* CSS for spinner animation */}
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>

            {/* Sidebar */}
            <div style={styles.sidebarCard}>
              <div style={styles.infoCard}>
                <h3 style={styles.infoTitle}>
                  <Info size={20} /> Important Information
                </h3>
                <p style={styles.infoText}>
                  Please provide accurate and detailed information. This will significantly increase the chances of reuniting the item with its rightful owner. Your contact information will be used to notify you if the owner is found.
                </p>
              </div>

              <div style={styles.helpCard}>
                <h3 style={styles.infoTitle}>
                  <HelpCircle size={20} /> Tips for a Good Report
                </h3>
                <ul style={styles.tipsList}>
                  <li style={styles.tipItem}>
                    <Check size={18} style={styles.tipIcon} />
                    <span>
                      **Clear Photo:** A well-lit, clear photo from different angles helps a lot.
                    </span>
                  </li>
                  <li style={styles.tipItem}>
                    <Check size={18} style={styles.tipIcon} />
                    <span>
                      **Specific Description:** Mention brand, model, color, and any unique marks.
                    </span>
                  </li>
                  <li style={styles.tipItem}>
                    <Check size={18} style={styles.tipIcon} />
                    <span>
                      **Exact Location:** Pinpoint where you found it as precisely as possible.
                    </span>
                  </li>
                  <li style={styles.tipItem}>
                    <Check size={18} style={styles.tipIcon} />
                    <span>
                      **Prompt Reporting:** Report as soon as possible after finding the item.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <button style={styles.closeButton} onClick={closeModal}>
                <X size={24} />
              </button>
              <div style={{
                ...styles.modalIcon,
                ...(modalMessage.includes('successfully') ? styles.modalIconSuccess : styles.modalIconError)
              }}>
                {modalMessage.includes('successfully') ? <Check size={40} /> : <AlertCircle size={40} />}
              </div>
              <h2 style={styles.modalTitle}>{modalMessage}</h2>
              <button style={styles.modalButton} onClick={closeModal}>
                Got It!
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default FoundItem;