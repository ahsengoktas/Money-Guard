import AuthLayout from '../../components/auth-layout/auth-layout';
import RegistrationForm from '../../components/registration-form/registration-form';

const RegistrationPage = () => {
  return (
    <AuthLayout variant="register">
      <RegistrationForm />
    </AuthLayout>
  );
};

export default RegistrationPage;
