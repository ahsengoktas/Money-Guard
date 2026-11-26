import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { selectUser } from '../../redux/auth/auth-selectors';
import ModalLogout from '../modal-logout/modal-logout';
import logo from '../../assets/icons/logo.svg';
import exitIcon from '../../assets/icons/exit.svg';
import css from './header.module.css';

const Header = () => {
  const { email } = useSelector(selectUser);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  // TASK-27: the name shown is the part of the email before "@".
  const userName = email ? email.split('@')[0] : '';

  return (
    <header className={css.header}>
      <Link className={css.logo} to="/home" aria-label="Money Guard home">
        <img className={css.logoIcon} src={logo} alt="" />
        <span className={css.logoText}>Money Guard</span>
      </Link>

      <div className={css.user}>
        <span className={css.name}>{userName}</span>
        <button
          className={css.exit}
          type="button"
          aria-label="Exit"
          onClick={() => setIsLogoutOpen(true)}
        >
          <img className={css.exitIcon} src={exitIcon} alt="" />
          <span className={css.exitText}>Exit</span>
        </button>
      </div>

      {isLogoutOpen && <ModalLogout onClose={() => setIsLogoutOpen(false)} />}
    </header>
  );
};

export default Header;
