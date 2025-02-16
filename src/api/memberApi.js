// src/api/memberApi.js
import axios from 'axios';
import { getAccessToken, setAccessToken as updateTokenService } from '../utils/tokenService';

const BASE_URL = 'https://front-mission.bigs.or.kr';

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

// 요청 시 토큰을 tokenService에서 읽어와 Authorization 헤더에 추가
axiosInstance.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// 401 오류 발생 시 토큰 갱신 후 재요청
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            try {
                const data = await refreshToken();
                if (data?.accessToken) {
                    // tokenService와 (필요하면 AuthContext에도) 업데이트
                    updateTokenService(data.accessToken);
                    error.config.headers['Authorization'] = `Bearer ${data.accessToken}`;
                    return axiosInstance(error.config);
                }
            } catch (refreshError) {
                console.error('토큰 갱신 실패: 자동 로그아웃', refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export const login = async (loginData) => {
    try {
        const response = await axios.post(`${BASE_URL}/auth/signin`, loginData);
        return response.data; // { accessToken, refreshToken, ... }
    } catch (error) {
        console.error('로그인 실패:', error.response?.data || error.message);
        alert('로그인 실패: ' + JSON.stringify(error.response?.data, null, 2));
        throw error;
    }
};

export const signup = async (signupData) => {
    try {
        const response = await axios.post(`${BASE_URL}/auth/signup`, signupData, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const refreshToken = async () => {
    try {
        const storedRefreshToken = sessionStorage.getItem('refreshToken');
        if (!storedRefreshToken) throw new Error('RefreshToken이 없음');
        const response = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken: storedRefreshToken });
        return response.data; // { accessToken, ... }
    } catch (error) {
        throw error;
    }
};
