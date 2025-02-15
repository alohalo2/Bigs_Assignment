import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Board from './pages/Board';
import Header from './components/Header';
import styles from './App.module.css';

function App() {
    const location = useLocation();
    const hideHeader = location.pathname === "/login" || location.pathname === "/signup";

    const ProtectedRoute = ({ children }) => {
        const { user } = useAuth();
        // user === null이면 리디렉트하지 않고 "로딩 중" 상태 유지
        if (user === null) {
            return <p>로그인 상태 확인 중...</p>; // ⏳ refreshToken 요청이 끝날 때까지 기다림
        }

        // user가 false일 때만 로그인 페이지로 리디렉트
        return user ? children : <Navigate to="/login" />;
    };

    return (
        <AuthProvider>
            {!hideHeader && <Header />}
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                    path="/board"
                    element={
                        <ProtectedRoute>
                            <Board />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
