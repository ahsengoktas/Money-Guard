import AuthLayout from '../../components/auth-layout/auth-layout';
import LoginForm from '../../components/login-form/login-form';

const LoginPage = () => {
  return (
    <AuthLayout variant="login">
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
