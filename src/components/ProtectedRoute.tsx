import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  if (!token || !userStr) {
    // Not logged in, redirect to login
    return <Navigate to={requireAdmin ? '/admin/login' : '/auth'} replace />;
  }

  try {
    const user = JSON.parse(userStr);
    
    if (requireAdmin && user.role !== 'ADMIN') {
      // Not an admin, redirect to admin login
      return <Navigate to="/admin/login" replace />;
    }

    return <>{children}</>;
  } catch (error) {
    // Invalid user data, redirect to login
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return <Navigate to={requireAdmin ? '/admin/login' : '/auth'} replace />;
  }
};

export default ProtectedRoute;

