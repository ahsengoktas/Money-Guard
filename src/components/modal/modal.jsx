import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import css from './modal.module.css';

export default function Modal({ title, onClose, busy = false, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus();
      }
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.defaultPrevented) return;
      if (event.key === 'Escape' && !busy) {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll(
          'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex]',
        ),
      ).filter(
        (element) =>
          element.tabIndex >= 0 && element.getClientRects().length > 0,
      );
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const active = document.activeElement;
      if (
        event.shiftKey &&
        (active === first || active === dialog || !dialog.contains(active))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (active === last || !dialog.contains(active))
      ) {
        event.preventDefault();
        first.focus();
      }
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
      <section
        className={css.dialog}
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
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
