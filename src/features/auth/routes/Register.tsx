import { AuthLayout } from '../components/AuthLayout';
import { RegisterForm } from '../components/RegisterForm';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function Register() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <AuthLayout
      title={t('auth.registerTitle')}
      description={t('auth.registerDescription')}
    >
      <RegisterForm onSuccess={() => navigate('/login')} />
    </AuthLayout>
  );
}
