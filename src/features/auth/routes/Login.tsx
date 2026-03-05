import { AuthLayout } from '../components/AuthLayout';
import { LoginForm } from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { useTranslation } from 'react-i18next';

export function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <AuthLayout
      title={t('auth.welcomeBack')}
      description={t('auth.loginDescription')}
    >
      <LoginForm 
        onSuccess={() => {
          const user = useAuthStore.getState().user;
          if (user?.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/dashboard');
          }
        }} 
      />
    </AuthLayout>
  );
}
