import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { logIn } from '../../redux/auth/auth-operations';
import { loginSchema } from '../../helpers/validation-schemas';
import AuthField from '../auth-field/auth-field';
import emailIcon from '../../assets/icons/email.svg';
import lockIcon from '../../assets/icons/lock.svg';
import css from '../../styles/auth-form.module.css';

const LoginForm = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  // TASK-21: invalid values never reach the backend (handled by yup).
  // A backend error is shown as a toast; on success PublicRoute sends the
  // user to the dashboard.
  const onSubmit = async (values) => {
    try {
      await dispatch(logIn(values)).unwrap();
    } catch (message) {
      toast.error(message);
    }
  };

  return (
    <form className={css.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={css.fields}>
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
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
      </div>

      <div className={css.actions}>
        <button className={css.primary} type="submit" disabled={isSubmitting}>
          Log in
        </button>
        {/* TASK-22 */}
        <Link className={css.secondary} to="/register">
          Register
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
