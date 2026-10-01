import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useModalStore } from '../store/modalStore';
import { AlertTriangle, Info, X, CheckCircle } from 'lucide-react';
import './ConfirmModal.css';


export function ConfirmModal() {
    const { isOpen, title, message, confirmText, cancelText, type, close } = useModalStore();
    const [isRendered, setIsRendered] = useState(false);

    // Animación de entrada/salida simple
    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
        } else {
            const timer = setTimeout(() => setIsRendered(false), 200);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isRendered && !isOpen) return null;

    const handleConfirm = () => close(true);
    const handleCancel = () => close(false);

    return createPortal(
        <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={handleCancel}>
            <div className={`modal-container ${isOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-group">
                        {type === 'danger' && <AlertTriangle className="modal-icon icon-danger" size={20} />}
                        {type === 'info' && <Info className="modal-icon icon-info" size={20} />}
                        {type === 'success' && <CheckCircle className="modal-icon icon-success" size={20} />}
                        <h3>{title}</h3>
                    </div>

                    <button className="modal-close-btn" onClick={handleCancel}>
                        <X size={18} />
                    </button>
                </div>
                
                <div className="modal-body">
                    <p>{message}</p>
                </div>

                <div className="modal-footer">
                    {cancelText !== null && (
                        <button className="modal-btn modal-btn-secondary" onClick={handleCancel}>
                            {cancelText}
                        </button>
                    )}
                    <button 
                        className={`modal-btn ${type === 'danger' ? 'modal-btn-danger' : 'modal-btn-primary'}`} 
                        onClick={handleConfirm}
                    >
                        {confirmText}
                    </button>
                </div>

            </div>
        </div>,
        document.body
    );
}
