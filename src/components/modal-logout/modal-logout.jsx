import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { logOut } from '../../redux/auth/auth-operations';
import logo from '../../assets/icons/logo.svg';
import formCss from '../../styles/auth-form.module.css';
import css from './modal-logout.module.css';

// TASK-28: asks for confirmation, then ends the session on the backend.
// The client session is cleared whatever the backend answers (auth slice), and
// PrivateRoute then sends the user to the login page.
const ModalLogout = ({ onClose }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await dispatch(logOut()).unwrap();
    } catch (message) {
      toast.error(message);
    }
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  return createPortal(
    <div className={css.backdrop} onClick={handleBackdropClick}>
      <div
        className={css.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-title"
      >
        <div className={css.logo}>
          <img className={css.logoIcon} src={logo} alt="" />
          <p className={css.logoText}>Money Guard</p>
        </div>
        <p className={css.text} id="logout-title">
          Are you sure you want to log out?
        </p>
        <div className={formCss.actions}>
          <button
            className={formCss.primary}
            type="button"
            onClick={handleLogout}
            disabled={isLoading}
          >
            Logout
          </button>
          <button className={formCss.secondary} type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ModalLogout;
