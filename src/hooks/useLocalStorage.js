// src/hooks/useLocalStorage.js
import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Enhanced localStorage hook with synchronization, expiration, and error recovery
 * @param {string} key - The localStorage key
 * @param {*} initialValue - The initial value if key doesn't exist
 * @param {Object} options - Configuration options
 * @param {number} options.expire - Expiration time in milliseconds
 * @param {boolean} options.sync - Enable cross-tab synchronization
 * @param {Function} options.validate - Custom validation function
 * @param {*} options.fallback - Fallback value on error
 * @returns {[*, Function, Object]} - [value, setValue, metadata]
 */
export const useLocalStorage = (key, initialValue, options = {}) => {
  const {
    expire,
    sync = true,
    validate,
    fallback = initialValue
  } = options;

  // State with lazy initialization
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;

      const parsed = JSON.parse(item);
      
      // Check expiration
      if (expire && parsed?.timestamp) {
        const isExpired = Date.now() - parsed.timestamp > expire;
        if (isExpired) {
          window.localStorage.removeItem(key);
          return initialValue;
        }
      }

      // Extract value from stored object
      const storedValue = parsed?.value !== undefined ? parsed.value : parsed;
      
      // Validate value if validator provided
      if (validate && !validate(storedValue)) {
        console.warn(`LocalStorage validation failed for key: ${key}`);
        return fallback;
      }

      return storedValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return fallback;
    }
  });

  const [error, setError] = useState(null);
  const [isPersisted, setIsPersisted] = useState(false);
  const valueRef = useRef(value);

  // Update ref when value changes
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  /**
   * Set value in localStorage and state
   */
  const setStoredValue = useCallback((newValue) => {
    try {
      // Allow functional updates like useState
      const valueToStore = newValue instanceof Function ? newValue(valueRef.current) : newValue;
      
      // Validate before storing
      if (validate && !validate(valueToStore)) {
        throw new Error(`Validation failed for value: ${valueToStore}`);
      }

      // Prepare data for storage
      const dataToStore = expire 
        ? { value: valueToStore, timestamp: Date.now() }
        : valueToStore;

      window.localStorage.setItem(key, JSON.stringify(dataToStore));
      
      // Update state
      setValue(valueToStore);
      setError(null);
      setIsPersisted(true);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
      setError(error);
      setIsPersisted(false);
    }
  }, [key, expire, validate]);

  /**
   * Remove item from localStorage
   */
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setValue(initialValue);
      setError(null);
      setIsPersisted(false);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
      setError(error);
    }
  }, [key, initialValue]);

  /**
   * Clear all localStorage items with the hook's prefix (optional)
   */
  const clearAll = useCallback((prefix = '') => {
    try {
      if (prefix) {
        // Clear only items with specific prefix
        Object.keys(window.localStorage)
          .filter(k => k.startsWith(prefix))
          .forEach(k => window.localStorage.removeItem(k));
      } else {
        // Clear all items set by this hook instance
        window.localStorage.removeItem(key);
      }
      setValue(initialValue);
      setError(null);
      setIsPersisted(false);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      setError(error);
    }
  }, [key, initialValue]);

  /**
   * Get current value without causing re-render
   */
  const getValue = useCallback(() => valueRef.current, []);

  /**
   * Check if value exists in localStorage
   */
  const hasValue = useCallback(() => {
    try {
      return window.localStorage.getItem(key) !== null;
    } catch (error) {
      return false;
    }
  }, [key]);

  /**
   * Get storage information (size, expiration, etc.)
   */
  const getStorageInfo = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return null;

      const data = JSON.parse(item);
      const size = new Blob([item]).size;
      const isExpired = expire && data.timestamp 
        ? Date.now() - data.timestamp > expire
        : false;

      return {
        size,
        isExpired,
        timestamp: data.timestamp || null,
        hasExpiration: !!expire
      };
    } catch (error) {
      return null;
    }
  }, [key, expire]);

  // Sync across tabs
  useEffect(() => {
    if (!sync) return;

    const handleStorageChange = (event) => {
      if (event.key === key && event.newValue !== event.oldValue) {
        try {
          if (event.newValue === null) {
            setValue(initialValue);
          } else {
            const parsed = JSON.parse(event.newValue);
            const newValue = parsed?.value !== undefined ? parsed.value : parsed;
            setValue(newValue);
          }
          setError(null);
        } catch (error) {
          console.error(`Error syncing localStorage key "${key}":`, error);
          setError(error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue, sync]);

  // Auto-remove expired items
  useEffect(() => {
    if (!expire) return;

    const checkExpiration = () => {
      try {
        const item = window.localStorage.getItem(key);
        if (!item) return;

        const data = JSON.parse(item);
        if (data.timestamp && Date.now() - data.timestamp > expire) {
          removeValue();
        }
      } catch (error) {
        console.error('Error checking expiration:', error);
      }
    };

    // Check expiration every minute
    const interval = setInterval(checkExpiration, 60000);
    return () => clearInterval(interval);
  }, [key, expire, removeValue]);

  // Metadata and utilities
  const metadata = {
    error,
    isPersisted,
    hasValue: hasValue(),
    getValue,
    removeValue,
    clearAll,
    getStorageInfo: getStorageInfo()
  };

  return [value, setStoredValue, metadata];
};

/**
 * Hook for managing multiple localStorage items
 */
export const useLocalStorageMulti = (items) => {
  const results = {};
  
  Object.entries(items).forEach(([key, config]) => {
    const [value, setValue, metadata] = useLocalStorage(
      key, 
      config.initialValue, 
      config.options
    );
    results[key] = { value, setValue, metadata };
  });

  return results;
};

/**
 * Hook for localStorage with encryption (basic example)
 * Note: For real encryption, use a proper library like crypto-js
 */
export const useEncryptedLocalStorage = (key, initialValue, secret = '') => {
  const encrypt = (data) => {
    if (!secret) return JSON.stringify(data);
    // Basic obfuscation - replace with proper encryption in production
    return btoa(JSON.stringify(data));
  };

  const decrypt = (encryptedData) => {
    if (!secret) return JSON.parse(encryptedData);
    try {
      return JSON.parse(atob(encryptedData));
    } catch {
      return initialValue;
    }
  };

  const [value, setValue] = useState(() => {
    try {
      const encrypted = window.localStorage.getItem(key);
      return encrypted ? decrypt(encrypted) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setEncryptedValue = useCallback((newValue) => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      const encrypted = encrypt(valueToStore);
      window.localStorage.setItem(key, encrypted);
      setValue(valueToStore);
    } catch (error) {
      console.error('Encrypted storage error:', error);
    }
  }, [key, value, secret]);

  return [value, setEncryptedValue];
};

export default useLocalStorage;