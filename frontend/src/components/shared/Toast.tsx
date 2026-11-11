import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import './Toast.css';

interface ToastProps {
  message: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  return (
    <div className="store-toast" role="alert">
      <AlertCircle size={18} className="store-toast-icon" />
      <span>{message}</span>
      <button type="button" className="store-toast-close" onClick={onClose} aria-label="Dismiss">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
