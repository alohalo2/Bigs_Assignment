// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { refreshToken } from '../api/memberApi';
import { jwtDecode } from 'jwt-decode';
import { setAccessToken as setTokenServiceAccessToken } from '../utils/tokenService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

    const setNewAccessToken = (newToken) => {
        setAccessToken(newToken); // React 상태 업데이트 (렌더링 트리거)
        setTokenServiceAccessToken(newToken); // tokenService에도 저장
    };

    const refreshAccessToken = async () => {
        const storedRefreshToken = sessionStorage.getItem('refreshToken');
        if (!storedRefreshToken) {
            console.warn('refreshToken이 존재하지 않음. 로그인이 필요합니다.');
            setUser(false);
            setIsLoading(false);
            return;
        }
        try {
            const data = await refreshToken();
            setNewAccessToken(data.accessToken);
            sessionStorage.setItem('refreshToken', data.refreshToken);
            const decodedToken = jwtDecode(data.accessToken);
            setUser({ username: decodedToken.username, name: decodedToken.name });
        } catch (error) {
            console.error('refreshToken 갱신 실패:', error.response?.data || error.message);
            setUser(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshAccessToken(); // 새로고침 시 자동으로 accessToken 재발급
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, accessToken, setAccessToken, isLoading, setNewAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
