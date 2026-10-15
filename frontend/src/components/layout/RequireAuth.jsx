import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../../hooks/useAuth';

const RequireAuth = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }
  return children;
};

export default RequireAuth;
