import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProgressBarModule from '@ramonak/react-progress-bar';

import { register as registerUser } from '../../redux/auth/auth-operations';
import { registrationSchema } from '../../helpers/validation-schemas';
import AuthField from '../auth-field/auth-field';
import userIcon from '../../assets/icons/user.svg';
import emailIcon from '../../assets/icons/email.svg';
import lockIcon from '../../assets/icons/lock.svg';
import formCss from '../../styles/auth-form.module.css';
import css from './registration-form.module.css';

// The package only ships a CommonJS build, so Vite hands us { default }.
const ProgressBar = ProgressBarModule.default ?? ProgressBarModule;

// TASK-13: how much of the password the confirmation already matches.
const getMatchPercent = (password, confirmPassword) => {
  if (!password || !confirmPassword) return 0;
  if (!password.startsWith(confirmPassword)) return 0;
  return Math.round((confirmPassword.length / password.length) * 100);
};

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registrationSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  const [password, confirmPassword] = useWatch({
    control,
    name: ['password', 'confirmPassword'],
  });
  const matchPercent = getMatchPercent(password, confirmPassword);

  // TASK-14: invalid values never reach the backend (handled by yup).
  // A backend error is shown as a toast; on success the user is logged in
  // automatically and PublicRoute sends them to the dashboard.
  const onSubmit = async ({ username, email, password }) => {
    try {
      await dispatch(registerUser({ username, email, password })).unwrap();
    } catch (message) {
      toast.error(message);
    }
  };

  return (
    <form className={formCss.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={`${formCss.fields} ${css.fields}`}>
        <AuthField
          icon={userIcon}
          type="text"
          placeholder="Name"
          autoComplete="name"
          error={errors.username?.message}
          {...register('username')}
        />
        <AuthField
          icon={emailIcon}
          type="email"
          placeholder="E-mail"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <AuthField
          icon={lockIcon}
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <AuthField
          icon={lockIcon}
          type="password"
          placeholder="Confirm password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        >
          <ProgressBar
            className={css.progress}
            completed={matchPercent}
            isLabelVisible={false}
            height="4px"
            borderRadius="2px"
            bgColor="var(--color-accent)"
            baseBgColor="var(--color-text-secondary)"
            transitionDuration="250ms"
            ariaValuetext={matchPercent}
          />
        </AuthField>
      </div>

      <div className={formCss.actions}>
        <button
          className={formCss.primary}
          type="submit"
          disabled={isSubmitting}
        >
          Register
        </button>
        {/* TASK-15 */}
        <Link className={`${formCss.secondary} ${css.secondary}`} to="/login">
          Log in
        </Link>
      </div>
    </form>
  );
};

export default RegistrationForm;
