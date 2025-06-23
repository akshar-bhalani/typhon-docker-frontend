import { useAuthContext } from '@/hooks/AuthContext';
import ProtectedRoutes from './protectedRoutes';
import PublicRoutes from './publicRoutes';

const AppRouter = () => {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? <ProtectedRoutes /> : <PublicRoutes />;
};

export default AppRouter;
