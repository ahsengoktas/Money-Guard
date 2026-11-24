import logo from '../../assets/icons/logo.svg';
import coinsLeft from '../../assets/images/coins-left.png';
import coinsRight from '../../assets/images/coins-right.png';
import css from './auth-layout.module.css';

// Shared background, card and logo for the login and register pages.
const AuthLayout = ({ variant = 'login', children }) => {
  return (
    <main
      className={
        variant === 'register' ? `${css.page} ${css.register}` : css.page
      }
    >
      {variant === 'login' && (
        <>
          <img className={css.coinsLeft} src={coinsLeft} alt="" />
          <img className={css.coinsRight} src={coinsRight} alt="" />
        </>
      )}
      <div className={css.card}>
        <div className={css.logo}>
          <img className={css.logoIcon} src={logo} alt="" />
          <p className={css.logoText}>Money Guard</p>
        </div>
        {children}
      </div>
    </main>
  );
};

export default AuthLayout;
