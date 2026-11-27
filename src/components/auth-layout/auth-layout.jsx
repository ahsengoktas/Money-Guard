import logo from '../../assets/icons/logo.svg';
import coinsLeft from '../../assets/images/golden-coins-left.webp';
import coinsRight from '../../assets/images/golden-coins-right.webp';
import moneyLeft from '../../assets/images/money-left.webp';
import moneyRight from '../../assets/images/money-right.webp';
import css from './auth-layout.module.css';

// Figma backgrounds: golden coins on login, falling dollars on register.
// They are decorative and hidden on mobile, as in the design.
const BACKGROUNDS = {
  login: { left: coinsLeft, right: coinsRight },
  register: { left: moneyLeft, right: moneyRight },
};

// Shared background, card and logo for the login and register pages.
const AuthLayout = ({ variant = 'login', children }) => {
  const background = BACKGROUNDS[variant];

  return (
    <main
      className={
        variant === 'register' ? `${css.page} ${css.register}` : css.page
      }
    >
      <img className={css.imageLeft} src={background.left} alt="" />
      <img className={css.imageRight} src={background.right} alt="" />
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
