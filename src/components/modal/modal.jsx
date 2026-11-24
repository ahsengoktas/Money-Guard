import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import css from './modal.module.css';

export default function Modal({ title, onClose, busy = false, children }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !busy) onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [busy, onClose]);

  return createPortal(
    <div
      className={css.backdrop}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose();
      }}
    >
      <section className={css.dialog} role="dialog" aria-modal="true" aria-label={title}>
        <button
          type="button"
          className={css.close}
          onClick={onClose}
          disabled={busy}
          aria-label="Close dialog"
        >
          ×
        </button>
        <h2 className={css.title}>{title}</h2>
        {children}
      </section>
    </div>,
    document.body,
  );
}
