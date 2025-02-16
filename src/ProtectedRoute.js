// src/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) return <p>로그인 상태 확인 중...</p>;
    return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
