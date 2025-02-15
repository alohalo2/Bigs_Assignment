// src/api/memberApi.js
import axios from 'axios';

const BASE_URL = 'https://front-mission.bigs.or.kr';

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
