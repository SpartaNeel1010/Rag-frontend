import React, { useState, useRef, useEffect } from 'react';
import './DocumentUploadModal.css';

const DocumentUploadModal = ({ 
  isOpen, 
  onClose, 
  indexNames 
}) => {
  // State for file handling
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Ref for file input
  const fileInputRef = useRef(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedFiles([]);
      setSelectedIndex('');
      setUploadError(null);
    }
  }, [isOpen]);

  // Drag and Drop Handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(files);
  };

  // File Input Handler
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  // Remove File Handler
  const removeFile = (fileToRemove) => {
    setSelectedFiles(selectedFiles.filter(file => file !== fileToRemove));
  };

  // Upload Handler
  const handleUpload = async (e) => {
    e.preventDefault();

    // Validation
    if (selectedFiles.length === 0) {
      setUploadError('Please select at least one document');
      return;
    }

    if (!selectedIndex) {
      setUploadError('Please select an index');
      return;
    }

    // Create FormData for file upload
    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('files', file);
    });
    formData.append('index_name', selectedIndex);

    setIsUploading(true);
    setUploadError(null);

    try {
      const response = await fetch('https://chatbot-ohana-backend-447682071256.us-central1.run.app//upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload documents');
      }

      const result = await response.json();
      
      // Success handling
      alert('Documents uploaded successfully!');
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Prevent modal from closing when clicking inside
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container document-upload-modal"
        onClick={handleModalClick}
      >
        <div className="modal-header">
          <h2>Upload Documents</h2>
          <button 
            className="modal-close"
            onClick={onClose}
            disabled={isUploading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleUpload} className="upload-form">
          <div 
            className={`file-drop-area ${isDragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              style={{ display: 'none' }}
              accept=".pdf"
            />
            <div className="drop-message">
              <p>Drag and drop documents here</p>
              <p>or</p>
              <button 
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="browse-btn"
              >
                Browse Files
              </button>
            </div>
          </div>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div className="selected-files">
              <h3>Selected Files:</h3>
              <ul>
                {selectedFiles.map((file, index) => (
                  <li key={index}>
                    {file.name}
                    <button 
                      type="button"
                      onClick={() => removeFile(file)}
                      className="remove-file-btn"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Index Selector */}
          <div className="form-group">
            <label htmlFor="indexSelect">Select Index</label>
            <select 
              id="indexSelect"
              value={selectedIndex}
              onChange={(e) => setSelectedIndex(e.target.value)}
              disabled={isUploading}
            >
              <option value="">Select an Index</option>
              {indexNames.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Error Display */}
          {uploadError && (
            <div className="error-message">{uploadError}</div>
          )}

          {/* Submit Button */}
          <div className="modal-actions">
            <button 
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={isUploading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-upload"
              disabled={isUploading}
            >
              {isUploading ? (
                <div className="loader">
                  <div className="spinner"></div>
                  Uploading...
                </div>
              ) : (
                'Upload Documents'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentUploadModal;