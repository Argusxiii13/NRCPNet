import React, { useState, useEffect } from 'react';
import { Upload, Link } from 'lucide-react';
import styles from '../../../css/styles/admin/ResourceUploadPanel.module.css';
import { useAuth } from '../../hooks/useAuth'; // Import the useAuth hook

const ResourceUploadPanel = ({ refreshResources }) => {
  const { user, isAuthenticated, loading } = useAuth(); // Use the auth hook
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [author, setAuthor] = useState(''); // Add author state
  const [icon, setIcon] = useState(null);
  const [iconPreview, setIconPreview] = useState('');
  const [status, setStatus] = useState('Active');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Set author when user data is loaded
  useEffect(() => {
    if (user && isAuthenticated) {
      // Format the author name using first name and surname
      const authorName = `${user.first_name} ${user.surname}`;
      setAuthor(authorName);
    }
  }, [user, isAuthenticated]);

  const validateUrl = (url) => {
    // Add https:// protocol if no protocol is specified
    if (url && !url.match(/^[a-zA-Z]+:\/\//)) {
      url = 'https://' + url;
    }
    
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleIconChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Check if the file is an image
      if (selectedFile.type.startsWith('image/')) {
        setIcon(selectedFile);
        setIconPreview(URL.createObjectURL(selectedFile));
        setSubmitError(null); // Clear any previous errors
      } else {
        setSubmitError('Only image files are allowed.');
        setIconPreview(''); // Clear preview for non-image files
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim()) {
      setSubmitError('Please enter a resource name');
      return;
    }
    
    if (!link.trim()) {
      setSubmitError('Please enter a resource link');
      return;
    }
    
    if (!validateUrl(link)) {
      setSubmitError('Please enter a valid URL');
      return;
    }

    // Add protocol if missing
    let processedLink = link;
    if (!processedLink.match(/^[a-zA-Z]+:\/\//)) {
      processedLink = 'https://' + processedLink;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('link', processedLink); // Use the processed link
      formData.append('author', author); // Add author to form data
      if (icon) {
        formData.append('icon', icon);
      }
      formData.append('status', status);
      
      const response = await fetch('/api/resources', {
        method: 'POST',
        body: formData, // Using FormData instead of JSON for file upload
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Submission failed');
      }
      
      const result = await response.json();
      console.log('Resource added successfully:', result);
      
      if (refreshResources) {
        refreshResources(); // Refresh the resources list
      }
      
      // Reset form
      setName('');
      setLink('');
      setIcon(null);
      setIconPreview('');
      setStatus('Active');
      // Don't reset author as it should stay the same
      setSubmitSuccess(true);
      
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(error.message || 'An error occurred while adding the resource');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderIconPreview = () => {
    if (iconPreview) {
      return <img src={iconPreview} alt="Preview" className={styles['preview-image']} />;
    } else {
      return (
        <div className={styles['no-icon']}>
          <Link size={48} />
          <p>No icon uploaded</p>
        </div>
      );
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setIcon(droppedFile);
      setIconPreview(URL.createObjectURL(droppedFile));
      setSubmitError(null);
    } else {
      setSubmitError('Only image files are allowed.');
    }
  };

  return (
    <div className={styles['upload-panel']}>
      <div className={styles['panel-header']}>
        <h2 className="text-2xl font-bold">Add System Resource</h2>
      </div>
      <div className={styles['panel-content']}>
        <div className={styles['upload-section']}>
          <div className={styles['upload-area']}>
            {/* Split Layout - 50/50 width */}
            <div className={styles['image-upload-container']}>
              {/* Icon Preview Area - Left side (50%) */}
              <div className={styles['image-holder']}>
                {renderIconPreview()}
              </div>
              
              {/* Upload Zone - Right side (50%) */}
              <div 
                className={styles['upload-zone']}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <Upload size={24} />
                <p>Drag & drop icon here<br />or click to browse</p>
                <span className={styles['upload-info']}>Upload a square icon for this resource</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleIconChange}
                  style={{ display: 'none' }} 
                  id="icon-upload"
                />
                <label htmlFor="icon-upload" className={styles['upload-label']}>Browse Files</label>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className={styles['resource-form']}>
              <div className={styles['form-controls']}>
                <div className={styles['form-group']}>
                  <label htmlFor="resource-name">Resource Name</label>
                  <input 
                    id="resource-name"
                    type="text" 
                    placeholder="Enter resource name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className={styles['title-input']}
                  />
                </div>
                
                <div className={styles['form-group']}>
                  <label htmlFor="resource-link">Resource Link</label>
                  <input 
                    id="resource-link"
                    type="text" 
                    placeholder="Enter URL (e.g. www.example.com)" 
                    value={link} 
                    onChange={(e) => setLink(e.target.value)} 
                    className={styles['title-input']}
                  />
                </div>
                
                {/* Author field - disabled and auto-populated */}
                <div className={styles['form-group']}>
                  <label htmlFor="resource-author">Author</label>
                  <input 
                    id="resource-author"
                    type="text" 
                    value={loading ? "Loading..." : author} 
                    disabled
                    className={`${styles['title-input']} ${styles['disabled-input']}`}
                  />
                </div>
                
                <div className={`${styles['form-group']} ${styles['status-select']}`}>
                  <label htmlFor="resource-status">Status</label>
                  <select 
                    id="resource-status"
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)} 
                    className={styles['status-dropdown']}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              {submitError && (
                <div className={styles['error-message']}>
                  {submitError}
                </div>
              )}
              
              {submitSuccess && (
                <div className={styles['success-message']}>
                  Resource added successfully!
                </div>
              )}
              
              <div className={styles['publish-controls']}>
                <button 
                  type="submit"
                  className={styles['upload-button']}
                  disabled={isSubmitting || loading}
                >
                  {isSubmitting ? 'Adding...' : 'Add Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceUploadPanel;   