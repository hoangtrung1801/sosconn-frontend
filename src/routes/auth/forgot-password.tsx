import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const Route = createFileRoute('/auth/forgot-password')({
  component: ForgotPasswordPage,
});

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Vui lòng nhập địa chỉ email hợp lệ');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsEmailSent(true);
    } catch (err: any) {
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const ForgotPasswordForm = () => (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Địa chỉ email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email của bạn"
            className="pl-10 h-12"
            disabled={isLoading}
            required
          />
        </div>
        <p className="text-sm text-gray-600">
          Chúng tôi sẽ gửi liên kết đặt lại mật khẩu đến email này
        </p>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200"
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Đang gửi...</span>
          </div>
        ) : (
          'Gửi liên kết đặt lại'
        )}
      </Button>

      <div className="text-center">
        <Link
          to="/auth/login"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại đăng nhập</span>
        </Link>
      </div>
    </motion.form>
  );

  const SuccessMessage = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-6"
    >
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Email đã được gửi!
        </h3>
        <p className="text-gray-600 mb-4">
          Chúng tôi đã gửi liên kết đặt lại mật khẩu đến{' '}
          <span className="font-medium text-gray-900">{email}</span>
        </p>
        <p className="text-sm text-gray-500">
          Vui lòng kiểm tra hộp thư của bạn và làm theo hướng dẫn để đặt lại mật khẩu.
        </p>
      </div>

      <div className="space-y-3">
        <Button
          onClick={() => {
            setIsEmailSent(false);
            setEmail('');
          }}
          variant="outline"
          className="w-full h-12"
        >
          Gửi lại email
        </Button>
        
        <Link
          to="/auth/login"
          className="inline-flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 font-medium hover:underline w-full"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại đăng nhập</span>
        </Link>
      </div>
    </motion.div>
  );

  return (
    <AuthLayout
      title={isEmailSent ? "Kiểm tra email" : "Quên mật khẩu?"}
      subtitle={isEmailSent ? "Chúng tôi đã gửi hướng dẫn cho bạn" : "Đừng lo lắng, chúng tôi sẽ giúp bạn lấy lại"}
    >
      {isEmailSent ? <SuccessMessage /> : <ForgotPasswordForm />}
    </AuthLayout>
  );
}
