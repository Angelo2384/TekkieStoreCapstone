import React, { useEffect, useRef } from 'react';
import './LogoutDialog.css';

interface LogoutDialogProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export const LogoutDialog: React.FC<LogoutDialogProps> = ({ onCancel, onConfirm }) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Cancel is focused first so pressing Enter doesn't log out by accident
  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <div className="logout-dialog-overlay" onClick={onCancel}>
      <div
        className="logout-dialog-card"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-text"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="logout-dialog-title" className="logout-dialog-title">Log out?</h2>
        <p id="logout-dialog-text" className="logout-dialog-text">
          Are you sure you want to log out?
        </p>

        <div className="logout-dialog-actions">
          <button ref={cancelRef} type="button" className="logout-dialog-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="logout-dialog-confirm" onClick={onConfirm}>
            Yes, log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutDialog;
