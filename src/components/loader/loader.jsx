import { createPortal } from 'react-dom';
import { Oval } from 'react-loader-spinner';
import css from './loader.module.css';

export default function Loader() {
  return createPortal(
    <div className={css.overlay} role="status" aria-live="polite">
      <span className={css.srOnly}>Loading, please wait…</span>
      <div className={css.spinner} aria-hidden="true">
        <Oval
          width="100%"
          height="100%"
          color="var(--color-accent)"
          secondaryColor="var(--color-purple)"
          strokeWidth={4}
          strokeWidthSecondary={3}
          wrapperClass={css.animation}
        />
        <span className={css.staticIndicator} />
      </div>
    </div>,
    document.body,
  );
}
