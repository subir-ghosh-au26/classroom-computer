// admin-portal/src/components/UI/Modal.js
import React, { useEffect } from 'react';
import './Modal.css'; // We'll create this CSS file for styling

const Modal = ({ show, onClose, title, children, footer }) => {
    // Effect to handle Escape key press for closing the modal
    useEffect(() => {
        const handleEscKeyPress = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (show) {
            document.addEventListener('keydown', handleEscKeyPress);
        }

        // Cleanup function to remove the event listener
        return () => {
            document.removeEventListener('keydown', handleEscKeyPress);
        };
    }, [show, onClose]); // Re-run effect if show or onClose changes

    // If the modal is not supposed to be shown, render nothing
    if (!show) {
        return null;
    }

    // Stop event propagation for clicks inside the modal content
    // so that clicking inside the modal doesn't trigger the backdrop's onClose.
    const handleModalContentClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="modal-backdrop" onClick={onClose}> {/* Backdrop closes modal */}
            <div className="modal-content-wrapper" onClick={handleModalContentClick}> {/* Content area */}
                <div className="modal-header">
                    {title && <h4 className="modal-title">{title}</h4>}
                    <button type="button" className="modal-close-button" onClick={onClose} aria-label="Close modal">
                        × {/* HTML entity for 'X' character */}
                    </button>
                </div>
                <div className="modal-body">
                    {children} {/* Content passed to the modal */}
                </div>
                {footer && (
                    <div className="modal-footer">
                        {footer} {/* Optional footer content (e.g., action buttons) */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;