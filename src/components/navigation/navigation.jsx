import { NavLink } from 'react-router-dom';

import css from './navigation.module.css';

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5Z" />
  </svg>
);

const StatisticsIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m23 8-6.47 6.53-3.5-3.5L8 16.06 6.94 15l6.09-6.03 3.5 3.5L21.94 7 23 8ZM3 18h18v2H3v-2Z" />
  </svg>
);

const CurrencyIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4Z" />
  </svg>
);

const LINKS = [
  { to: '/home', label: 'Home', Icon: HomeIcon },
  { to: '/statistics', label: 'Statistics', Icon: StatisticsIcon },
  // TASK-30: the currency tab only exists on mobile.
  { to: '/currency', label: 'Currency', Icon: CurrencyIcon, mobileOnly: true },
];

const getLinkClass = ({ isActive }) =>
  isActive ? `${css.link} ${css.active}` : css.link;

const Navigation = () => {
  return (
    <nav className={css.nav} aria-label="Main">
      <ul className={css.list}>
        {LINKS.map(({ to, label, Icon, mobileOnly }) => (
          <li key={to} className={mobileOnly ? css.mobileOnly : undefined}>
            <NavLink className={getLinkClass} to={to} aria-label={label}>
              <span className={css.icon}>
                <Icon />
              </span>
              <span className={css.label}>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
