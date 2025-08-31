import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import authApi from '@/lib/api/auth.api';
import useGlobalStore from '@/store/useGlobalStore';
import { LoginRequest } from '@/types';

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
});

export function LoginPage() {
  const navigate = useNavigate();
  const login = useGlobalStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleLogin = async (data: LoginRequest) => {
    setIsLoading(true);
    setError('');

    try {
      const user = await authApi.login({
        email: data.email,
        password: data.password,
      });
      
      // Update global state
      login(user);
      
      // Redirect to home page after successful login
      navigate({ to: '/home' });
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 
        'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Chào mừng trở lại!"
      subtitle="Đăng nhập để tiếp tục sử dụng SOSConn"
    >
      <LoginForm
        onSubmit={handleLogin}
        isLoading={isLoading}
        error={error}
      />
    </AuthLayout>
  );
}
