import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ShoeProduct } from '../../../types/catalogue';
import { deleteShoe } from '../../../services/shoeService';
import './DeleteShoeDialog.css';

interface DeleteShoeDialogProps {
  shoe: ShoeProduct;
  /** Pairs in stock; a shoe can only be deleted at 0. null = unknown, the server decides. */
  stock: number | null;
  onCancel: () => void;
  onDeleted: (shoe: ShoeProduct) => void;
}

export const DeleteShoeDialog: React.FC<DeleteShoeDialogProps> = ({ shoe, stock, onCancel, onDeleted }) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const inStock = stock !== null && stock > 0;

  // Cancel is focused first so pressing Enter doesn't delete by accident
  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !deleting) onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deleting, onCancel]);

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      await deleteShoe(shoe.id);
      onDeleted(shoe);
    } catch (err) {
      setError((err as Error).message);
      setDeleting(false);
    }
  };

  return (
    <div className="delete-dialog-overlay" onClick={() => !deleting && onCancel()}>
      <div
        className="delete-dialog-card"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-text"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="delete-dialog-title" className="delete-dialog-title">
          {inStock ? "Can't delete this product" : 'Delete product?'}
        </h2>
        <p id="delete-dialog-text" className="delete-dialog-text">
          {inStock ? (
            <>
              <strong>{shoe.name}</strong> still has {stock} {stock === 1 ? 'pair' : 'pairs'} in stock. Set its
              stock to 0 on the Inventory page before deleting it.
            </>
          ) : (
            <>
              Are you sure you want to delete <strong>{shoe.name}</strong>? Its sizes are removed too. Past orders
              aren't affected.
            </>
          )}
        </p>

        {error && (
          <p className="delete-dialog-error" role="alert">
            {error}
          </p>
        )}

        <div className="delete-dialog-actions">
          <button
            ref={cancelRef}
            type="button"
            className="delete-dialog-cancel"
            onClick={onCancel}
            disabled={deleting}
          >
            {inStock ? 'OK' : 'Cancel'}
          </button>
          {!inStock && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteShoeDialog;
