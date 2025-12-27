// src/components/ProtectedRoute.tsx

import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles: Array<'manager' | 'keeper'>; // Peran yang diizinkan untuk rute ini
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }): React.ReactElement => {
  const { isAuthenticated, user } = useAuth();

  // 1. Cek apakah pengguna sudah login
  if (!isAuthenticated) {
    // Jika belum login, arahkan ke halaman login
    return <Navigate to="/login" replace />;
  }

  // 2. Cek apakah pengguna memiliki peran yang diizinkan
  if (user && allowedRoles.includes(user.role)) {
    // Jika peran diizinkan, tampilkan rute anak (Outlet)
    return <Outlet />;
  } else {
    // Jika peran tidak diizinkan, arahkan ke halaman "Akses Ditolak" atau Dashboard
    return <Navigate to="/access-denied" replace />;
  }
};

export default ProtectedRoute;