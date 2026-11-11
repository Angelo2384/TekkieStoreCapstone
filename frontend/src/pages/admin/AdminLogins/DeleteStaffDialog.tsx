import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import '../../../components/admin/products/DeleteShoeDialog.css';

interface DeleteStaffDialogProps {
  email: string;
  onCancel: () => void;
  onDeleted: (email: string) => void;
}

export const DeleteStaffDialog: React.FC<DeleteStaffDialogProps> = ({ email, onCancel, onDeleted }) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      await adminService.deleteStaff(email);
      onDeleted(email);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Could not delete the account. Please try again.');
      setDeleting(false);
    }
  };

  return (
    <div className="delete-dialog-overlay" onClick={() => !deleting && onCancel()}>
      <div
        className="delete-dialog-card"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-staff-title"
        aria-describedby="delete-staff-text"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="delete-staff-title" className="delete-dialog-title">
          Delete staff account?
        </h2>
        <p id="delete-staff-text" className="delete-dialog-text">
          Are you sure you want to delete <strong>{email}</strong>? They are logged out straight away and can no
          longer use the admin portal.
        </p>

        {error && (
          <p className="delete-dialog-error" role="alert">
            {error}
          </p>
        )}

        <div className="delete-dialog-actions">
          {/* Cancel is focused first so pressing Enter doesn't delete by accident */}
          <button type="button" className="delete-dialog-cancel" onClick={onCancel} disabled={deleting} autoFocus>
            Cancel
          </button>
          <button type="button" className="delete-dialog-confirm" onClick={handleDelete} disabled={deleting}>
            {deleting ? (
              <>
                <Loader2 size={15} className="delete-dialog-spinner" />
                <span>Deleting...</span>
              </>
            ) : (
              'Yes, delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteStaffDialog;
