import { Navigate, Route, Routes } from 'react-router-dom';

import ResetPasswordPage from '@/pages/resetPassword';
import AuthLayout from './AuthLayout';
import Login from '@/pages/login';

const PublicRoutes = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        }
      />
      <Route
        path="/reset-password"
        element={
          <AuthLayout>
            <ResetPasswordPage />
          </AuthLayout>
        }
      />
      <Route
        path="/reset-password/:id/:token"
        element={
          <AuthLayout>
            <ResetPasswordPage />
          </AuthLayout>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default PublicRoutes;
