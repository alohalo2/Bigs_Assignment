// src/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { CircularProgress, Box, Typography } from '@mui/material';

const ProtectedRoute = ({ children }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
                <Typography variant="body1" sx={{ marginTop: 2, fontWeight: 600, fontSize: '20px' }}>
                    로그인 상태 확인 중...
                </Typography>
            </Box>
        );
    }

    return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;