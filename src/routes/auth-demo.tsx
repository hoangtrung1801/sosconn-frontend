import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginPage } from './auth/login';
import { SignupPage } from './auth/signup';
import { ForgotPasswordPage } from './auth/forgot-password';

export const Route = createFileRoute('/auth-demo')({
  component: AuthDemoPage,
});

function AuthDemoPage() {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Auth UI Demo
          </h1>
          <p className="text-gray-600">
            Xem trước các màn hình đăng nhập/đăng ký
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="login">Đăng nhập</TabsTrigger>
            <TabsTrigger value="signup">Đăng ký</TabsTrigger>
            <TabsTrigger value="forgot">Quên mật khẩu</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginPage />
          </TabsContent>

          <TabsContent value="signup">
            <SignupPage />
          </TabsContent>

          <TabsContent value="forgot">
            <ForgotPasswordPage />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}