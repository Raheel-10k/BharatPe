import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute() {
  const isAuthenticated = true; // Mock authentication state

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;