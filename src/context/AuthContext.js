// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { refreshToken } from '../api/memberApi';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);

    const refreshAccessToken = async () => {
        const storedRefreshToken = sessionStorage.getItem('refreshToken');
        if (!storedRefreshToken) {
            console.warn('refreshToken이 존재하지 않음. 로그인이 필요합니다.');
            return;
        }

        try {
            const data = await refreshToken();
            setAccessToken(data.accessToken); // 새 accessToken을 메모리에 저장
            sessionStorage.setItem('refreshToken', data.refreshToken);
            const decodedToken = jwtDecode(data.accessToken);
            setUser({ username: decodedToken.username, name: decodedToken.name });
        } catch (error) {
            console.error('refreshToken 갱신 실패:', error.response?.data || error.message);
        }
    };

    useEffect(() => {
        refreshAccessToken(); // 새로고침 시 자동으로 accessToken 재발급
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, accessToken, setAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
