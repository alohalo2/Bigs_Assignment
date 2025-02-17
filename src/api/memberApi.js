// src/api/memberApi.js
import axios from 'axios';
import { getAccessToken, setAccessToken as updateTokenService } from '../utils/tokenService';
import { useAuth } from '../context/AuthContext';

const BASE_URL = 'https://front-mission.bigs.or.kr';

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

// 요청 시 토큰을 tokenService에서 읽어와 Authorization 헤더에 추가

axiosInstance.interceptors.request.use((config) => {
    const token = getAccessToken();
    console.log("요청에 적용된 액세스 토큰:", token);
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            try {
                console.log('토큰 갱신 시도...');
                const data = await refreshToken(); // 리프레시 토큰을 사용해 갱신
                if (data?.accessToken) {
                    console.log('토큰 갱신 성공');
                    const { setNewAccessToken } = useAuth();
                    setNewAccessToken(data.accessToken);
                    error.config.headers['Authorization'] = `Bearer ${data.accessToken}`;
                    return axiosInstance(error.config); // 실패했던 요청 재시도
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
        if (!storedRefreshToken) {
            throw new Error('리프레시 토큰이 없음');
        }
        const response = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken: storedRefreshToken });
        console.log('리프레시 토큰 사용해 새 액세스 토큰 발급:', response.data);
        return response.data; // { accessToken: '새로운 액세스 토큰' }
    } catch (error) {
        console.error('리프레시 토큰 요청 실패', error.response?.data || error.message);
        throw error;
    }
};
