import { AuthLayout } from '../components/AuthLayout';
import { RegisterForm } from '../components/RegisterForm';
import { useNavigate } from 'react-router-dom';

export function Register() {
  const navigate = useNavigate();

  return (
    <AuthLayout
      title="Create an account"
      description="Enter your details to register a new account"
    >
      <RegisterForm onSuccess={() => navigate('/login')} />
    </AuthLayout>
  );
}
