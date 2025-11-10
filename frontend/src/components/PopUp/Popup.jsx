import React from 'react';
import styles from './Popup.module.css';

function Popup({ isOpen, onClose, title, message, type = 'info' }) {
  if (!isOpen) return null;

  const getTypeClass = () => {
    switch (type) {
      case 'error':
        return styles.error;
      case 'warning':
        return styles.warning;
      case 'success':
        return styles.success;
      default:
        return styles.info;
    }
  };

  return (
      <div className={styles.overlay} onClick={onClose}>
        <div className={`${styles.popup} ${getTypeClass()}`} onClick={(e) => e.stopPropagation()}>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
          {title && <h3 className={styles.title}>{title}</h3>}
          <p className={styles.message}>{message}</p>
          <div className={styles.actions}>
            <button className={styles.okButton} onClick={onClose}>
              OK
            </button>
          </div>
        </div>
      </div>
  );
}

export default Popup;
