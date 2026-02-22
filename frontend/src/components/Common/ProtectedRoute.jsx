import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedRoute = ({ children, role }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to='/login' replace />;
  }

  // Support both { user: { role } } and flat { role } shapes
  const userRole = user?.user?.role || user?.role;

  if (role && userRole !== role) {
    return <Navigate to='/' replace />;
  }

  return children;
};

export default ProtectedRoute;
