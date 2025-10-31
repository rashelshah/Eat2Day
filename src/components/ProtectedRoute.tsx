import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireVendor?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false, requireVendor = false }: ProtectedRouteProps) => {
  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token || !userStr) {
    // Not logged in, redirect to login
    if (requireAdmin) return <Navigate to="/admin/login" replace />;
    if (requireVendor) return <Navigate to="/auth" replace />;
    return <Navigate to="/auth" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    
    if (requireAdmin && user.role !== 'ADMIN') {
      // Not an admin, redirect to admin login
      return <Navigate to="/admin/login" replace />;
    }

    if (requireVendor && role !== 'VENDOR') {
      // Not a vendor, redirect to login
      return <Navigate to="/auth" replace />;
    }

    return <>{children}</>;
  } catch (error) {
    // Invalid user data, redirect to login
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    return <Navigate to={requireAdmin ? '/admin/login' : '/auth'} replace />;
  }
};

export default ProtectedRoute;

