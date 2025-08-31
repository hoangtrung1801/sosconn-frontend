import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import SignupForm from '@/components/auth/SignupForm';
import authApi from '@/lib/api/auth.api';
import { RegisterRequest } from '@/types';

export const Route = createFileRoute('/auth/signup')({
  component: SignupPage,
});

export function SignupPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSignup = async (data: RegisterRequest) => {
    setIsLoading(true);
    setError('');

    try {
      await authApi.registerAccount(data);
      
      // Redirect to login page after successful registration
      navigate({ 
        to: '/auth/login', 
        search: { 
          message: 'Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.' 
        }
      });
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 
        'Đăng ký thất bại. Vui lòng thử lại sau.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Tạo tài khoản mới"
      subtitle="Tham gia cộng đồng SOSConn ngay hôm nay"
    >
      <SignupForm
        onSubmit={handleSignup}
        isLoading={isLoading}
        error={error}
      />
    </AuthLayout>
  );
}
