import css from './auth-field.module.css';

// Underlined input with an icon, used by the login and register forms.
// React 19 passes `ref` as a normal prop, so react-hook-form's register works.
const AuthField = ({ icon, error, children, ...inputProps }) => {
  return (
    <div className={css.field}>
      <label className={css.control}>
        <img className={css.icon} src={icon} alt="" />
        <input
          className={css.input}
          aria-invalid={Boolean(error)}
          {...inputProps}
        />
      </label>
      {children}
      {error && <p className={css.error}>{error}</p>}
    </div>
  );
};

export default AuthField;
