import { AuthLayout } from '../components/AuthLayout';
import { LoginForm } from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const navigate = useNavigate();

  return (
    <AuthLayout
      title="Welcome back"
      description="Enter your credentials to access your account"
    >
      <LoginForm onSuccess={() => navigate('/dashboard')} />
    </AuthLayout>
  );
}
