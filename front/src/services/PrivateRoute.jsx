// PrivateRoute.jsx
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const PrivateRoute = ({ element }) => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  const location = useLocation();

  // If still loading, don't render anything
  if (isLoading) {
    return null;
  }

  // If not authenticated, redirect to login page with current location state
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Render the route element if authenticated
  return element;
};

export default PrivateRoute;
