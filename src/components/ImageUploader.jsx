// src/components/ImageUploader.jsx
import React, { useState, useRef, useCallback } from 'react';
import { 
  Camera, 
  Upload, 
  X, 
  AlertCircle, 
  CheckCircle,
  RotateCw,
  ZoomIn,
  Download
} from 'lucide-react';
import { useImageRecognition } from '../hooks/useImageRecognition';

const ImageUploader = ({ 
  onIngredientsDetected, 
  maxFileSize = 10 * 1024 * 1024,
  supportedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
  className = ''
}) => {
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [detectedIngredients, setDetectedIngredients] = useState([]);
  const [imageInfo, setImageInfo] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  
  const { detectIngredients, loading } = useImageRecognition();

  const validateFile = (file) => {
    if (!file) {
      throw new Error('No file selected');
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('Please select an image file');
    }

    if (!supportedFormats.includes(file.type)) {
      throw new Error(`Unsupported format. Please use: ${supportedFormats.join(', ')}`);
    }

    if (file.size > maxFileSize) {
      const sizeInMB = (maxFileSize / (1024 * 1024)).toFixed(1);
      throw new Error(`File too large. Maximum size is ${sizeInMB}MB`);
    }

    return true;
  };

  const getImageDimensions = (file) => {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        const dimensions = {
          width: img.width,
          height: img.height,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          type: file.type
        };
        URL.revokeObjectURL(url);
        resolve(dimensions);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({
          width: 0,
          height: 0,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          type: file.type
        });
      };
      
      img.src = url;
    });
  };

  const processFile = async (file) => {
    try {
      validateFile(file);
      
      // Reset states
      setUploadProgress(0);
      setError(null);
      setDetectedIngredients([]);
      setZoom(1);
      setRotation(0);

      // Show preview
      const reader = new FileReader();
      reader.onloadend = async (e) => {
        setPreview(e.target.result);
        
        // Get image dimensions
        try {
          const dimensions = await getImageDimensions(file);
          setImageInfo(dimensions);
        } catch (err) {
          console.warn('Could not get image dimensions:', err);
          setImageInfo({
            width: 0,
            height: 0,
            size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
            type: file.type
          });
        }
      };
      reader.readAsDataURL(file);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Detect ingredients
      const ingredients = await detectIngredients(file);
      setDetectedIngredients(ingredients);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (ingredients.length > 0) {
        onIngredientsDetected(ingredients);
        setTimeout(() => setUploadProgress(0), 2000);
      }

    } catch (err) {
      setError(err.message);
      setUploadProgress(0);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const clearImage = () => {
    setPreview(null);
    setDetectedIngredients([]);
    setImageInfo(null);
    setUploadProgress(0);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const rotateImage = () => setRotation(prev => (prev + 90) % 360);
  const zoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const resetZoom = () => setZoom(1);

  const downloadImage = () => {
    if (!preview) return;
    const link = document.createElement('a');
    link.download = `ingredient-photo-${Date.now()}.jpg`;
    link.href = preview;
    link.click();
  };

  const getSupportedFormatsText = () => {
    return supportedFormats.map(format => format.replace('image/', '')).join(', ').toUpperCase();
  };

  return (
    <div style={styles.container} className={className}>
      {!preview ? (
        <div
          style={{
            ...styles.dropzone,
            ...(isDragging && styles.dropzoneActive),
            ...(error && styles.dropzoneError)
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <div style={styles.dropzoneContent}>
            {isDragging ? (
              <Upload size={48} color="var(--primary)" />
            ) : error ? (
              <AlertCircle size={48} color="var(--error)" />
            ) : (
              <Camera size={48} color="var(--gray-400)" />
            )}
            
            <div style={styles.textContent}>
              <p style={styles.dropText}>
                {isDragging ? 'Drop your photo here' : 'Upload ingredient photo'}
              </p>
              <p style={styles.subText}>
                {isDragging ? 'Release to upload' : 'Drag & drop or click to browse'}
              </p>
            </div>

            <div style={styles.fileInfo}>
              <p style={styles.hint}>
                Supports {getSupportedFormatsText()} up to {(maxFileSize / (1024 * 1024)).toFixed(0)}MB
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={supportedFormats.join(',')}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          {uploadProgress > 0 && (
            <div style={styles.progressContainer}>
              <div style={{...styles.progressBar, width: `${uploadProgress}%`}} />
            </div>
          )}
        </div>
      ) : (
        <div style={styles.previewSection}>
          <div style={styles.previewContainer}>
            <div style={{
              ...styles.imageWrapper,
              transform: `scale(${zoom}) rotate(${rotation}deg)`
            }}>
              <img 
                src={preview} 
                alt="Uploaded ingredient" 
                style={styles.previewImage}
                onError={() => setError('Failed to load image')}
              />
            </div>
            
            <div style={styles.imageControls}>
              <button style={styles.controlBtn} onClick={zoomIn} title="Zoom In" disabled={zoom >= 3}>
                <ZoomIn size={16} />
              </button>
              <button style={styles.controlBtn} onClick={zoomOut} title="Zoom Out" disabled={zoom <= 0.5}>
                <ZoomIn size={16} style={{ transform: 'scaleY(-1)' }} />
              </button>
              <button style={styles.controlBtn} onClick={resetZoom} title="Reset Zoom">1:1</button>
              <button style={styles.controlBtn} onClick={rotateImage} title="Rotate">
                <RotateCw size={16} />
              </button>
              <button style={styles.controlBtn} onClick={downloadImage} title="Download">
                <Download size={16} />
              </button>
            </div>

            <button style={styles.clearBtn} onClick={clearImage} aria-label="Remove image">
              <X size={20} />
            </button>

            {loading && (
              <div style={styles.loadingOverlay}>
                <div style={styles.spinner}></div>
                <p style={styles.loadingText}>Analyzing ingredients with AI...</p>
                <p style={styles.loadingSubtext}>Detecting food items in your image</p>
              </div>
            )}

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div style={styles.progressOverlay}>
                <div style={styles.progressInfo}>
                  <div style={styles.progressBarCompact}>
                    <div style={{...styles.progressFill, width: `${uploadProgress}%`}} />
                  </div>
                  <span style={styles.progressText}>{uploadProgress}%</span>
                </div>
              </div>
            )}
          </div>

          {/* Image Information */}
          {imageInfo && (
            <div style={styles.imageInfo}>
              <h4 style={styles.infoTitle}>Image Details</h4>
              <div style={styles.infoGrid}>
                <span>Dimensions:</span>
                <span>{imageInfo.width} × {imageInfo.height}</span>
                <span>Size:</span>
                <span>{imageInfo.size}</span>
                <span>Format:</span>
                <span>{imageInfo.type.replace('image/', '').toUpperCase()}</span>
              </div>
            </div>
          )}

          {/* Detected Ingredients */}
          {detectedIngredients.length > 0 && (
            <div style={styles.ingredientsSection}>
              <div style={styles.sectionHeader}>
                <CheckCircle size={20} color="var(--success)" />
                <h3 style={styles.sectionTitle}>Detected Ingredients ({detectedIngredients.length})</h3>
              </div>
              <div style={styles.ingredientsGrid}>
                {detectedIngredients.map((ingredient, index) => (
                  <span key={index} style={styles.ingredientTag}>{ingredient}</span>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div style={styles.errorBanner}>
              <AlertCircle size={18} />
              <span>{error}</span>
              <button style={styles.retryBtn} onClick={() => fileInputRef.current?.click()}>
                Try Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    margin: '2rem 0'
  },
  dropzone: {
    border: '3px dashed var(--gray-300)',
    borderRadius: '16px',
    padding: '3rem 2rem',
    textAlign: 'center',
    cursor: 'pointer',
    background: 'var(--gray-50)',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    position: 'relative',
    overflow: 'hidden'
  },
  dropzoneActive: {
    borderColor: 'var(--primary)',
    background: 'var(--primary-light)',
    transform: 'scale(1.02)'
  },
  dropzoneError: {
    borderColor: 'var(--error)',
    background: 'var(--error-light)'
  },
  dropzoneContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem'
  },
  textContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  dropText: {
    fontSize: '1.2rem',
    color: 'var(--gray-700)',
    margin: 0,
    fontWeight: '600'
  },
  subText: {
    fontSize: '1rem',
    color: 'var(--gray-500)',
    margin: 0
  },
  hint: {
    fontSize: '0.85rem',
    color: 'var(--gray-500)',
    margin: 0
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'var(--gray-200)'
  },
  progressBar: {
    height: '100%',
    background: 'var(--primary)',
    transition: 'width 0.3s ease'
  },
  previewSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  previewContainer: {
    position: 'relative',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    background: 'var(--gray-900)'
  },
  imageWrapper: {
    transition: 'transform 0.3s ease',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px'
  },
  previewImage: {
    maxWidth: '100%',
    maxHeight: '400px',
    objectFit: 'contain'
  },
  imageControls: {
    position: 'absolute',
    bottom: '12px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '8px',
    background: 'rgba(0,0,0,0.7)',
    padding: '8px',
    borderRadius: '8px',
    backdropFilter: 'blur(10px)'
  },
  controlBtn: {
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: 'white',
    borderRadius: '6px',
    width: '32px',
    height: '32px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    ':hover:not(:disabled)': {
      background: 'rgba(255,255,255,0.2)'
    },
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed'
    }
  },
  clearBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'rgba(0,0,0,0.7)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    ':hover': {
      background: 'rgba(0,0,0,0.9)',
      transform: 'scale(1.1)'
    }
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255,255,255,0.95)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    borderRadius: '16px'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid var(--gray-200)',
    borderTop: '4px solid var(--primary)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    fontSize: '1.1rem',
    color: 'var(--gray-700)',
    margin: 0,
    fontWeight: '500'
  },
  loadingSubtext: {
    fontSize: '0.9rem',
    color: 'var(--gray-500)',
    margin: 0
  },
  progressOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255,255,255,0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '16px'
  },
  progressInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    background: 'white',
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  progressBarCompact: {
    width: '120px',
    height: '6px',
    background: 'var(--gray-200)',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: 'var(--primary)',
    transition: 'width 0.3s ease'
  },
  progressText: {
    fontSize: '0.9rem',
    color: 'var(--gray-700)',
    fontWeight: '500',
    minWidth: '40px'
  },
  imageInfo: {
    background: 'var(--gray-50)',
    padding: '1rem',
    borderRadius: '12px',
    border: '1px solid var(--gray-200)'
  },
  infoTitle: {
    margin: '0 0 0.75rem',
    fontSize: '1rem',
    color: 'var(--gray-700)',
    fontWeight: '600'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gap: '0.5rem 1rem',
    fontSize: '0.85rem'
  },
  ingredientsSection: {
    background: 'var(--success-light)',
    border: '1px solid var(--success)',
    borderRadius: '12px',
    padding: '1.5rem'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  sectionTitle: {
    margin: 0,
    fontSize: '1.1rem',
    color: 'var(--success-dark)',
    fontWeight: '600'
  },
  ingredientsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  ingredientTag: {
    background: 'var(--success)',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  errorBanner: {
    background: 'var(--error)',
    color: 'white',
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.9rem'
  },
  retryBtn: {
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '500',
    marginLeft: 'auto',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'rgba(255,255,255,0.3)'
    }
  }
};

export default ImageUploader;