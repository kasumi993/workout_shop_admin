import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  HiCheckCircle, 
  HiXCircle, 
  HiInformationCircle, 
  HiExclamationTriangle, 
  HiXMark 
} from 'react-icons/hi2';

// Create a toast context
const ToastContext = createContext(null);

// Toast component
const Toast = ({ toast, onClose }) => {
  const { id, type, title, message } = toast;
  
  // Set up auto-dismiss
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [id, onClose]);
  
  // Toast type configurations
  const configs = {
    success: {
      icon: <HiCheckCircle className="w-5 h-5 text-green-500" />,
      className: "bg-green-50 border-green-500 text-green-800"
    },
    error: {
      icon: <HiXCircle className="w-5 h-5 text-red-500" />,
      className: "bg-red-50 border-red-500 text-red-800"
    },
    info: {
      icon: <HiInformationCircle className="w-5 h-5 text-blue-500" />,
      className: "bg-blue-50 border-blue-500 text-blue-800"
    },
    warning: {
      icon: <HiExclamationTriangle className="w-5 h-5 text-amber-500" />,
      className: "bg-amber-50 border-amber-500 text-amber-800"
    }
  };
  
  const config = configs[type] || configs.info;
  
  return (
    <div className={`${config.className} rounded-lg border-l-4 p-4 flex items-start shadow-md mb-3 max-w-sm w-full`}>
      <div className="flex-shrink-0 mr-3">
        {config.icon}
      </div>
      <div className="flex-1">
        {title && <p className="font-medium">{title}</p>}
        {message && <p className="text-sm mt-1">{message}</p>}
      </div>
      <button 
        onClick={() => onClose(id)}
        className="flex-shrink-0 ml-2 -mt-1 -mr-1 text-gray-400 hover:text-gray-900"
      >
        <HiXMark className="w-5 h-5" />
      </button>
    </div>
  );
};

// Toast container component
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
      {toasts.map(toast => (
        <Toast 
          key={toast.id} 
          toast={toast} 
          onClose={removeToast} 
        />
      ))}
    </div>
  );
};

// Toast provider component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  
  const addToast = (type, title, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, title, message }]);
  };
  
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  const value = {
    // Helper methods for different toast types
    success: (title, message) => addToast('success', title, message),
    error: (title, message) => addToast('error', title, message),
    info: (title, message) => addToast('info', title, message),
    warning: (title, message) => addToast('warning', title, message),
  };
  
  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Custom hook to use the toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default { ToastProvider, useToast };