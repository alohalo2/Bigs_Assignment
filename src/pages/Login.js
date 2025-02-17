// src/pages/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/memberApi';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';
import { Paper, Typography, TextField, Button, Box } from '@mui/material';

const Login = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const { setUser, setAccessToken } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // 기존 에러 메시지 초기화

        try {
            const data = await login(form);
            if (!data || !data.accessToken) {
                throw new Error('로그인 실패: accessToken이 없습니다.');
            }

            setAccessToken(data.accessToken);
            sessionStorage.setItem('refreshToken', data.refreshToken);

            const decodedToken = jwtDecode(data.accessToken);
            setUser({ username: decodedToken.username, name: decodedToken.name });

            navigate('/board');
        } catch (error) {
            // console.error('로그인 실패:', error);
            setError('로그인 실패: 이메일 또는 비밀번호를 확인하세요.');
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Paper elevation={3} sx={{ padding: 4, width: 400 }}>
                <Typography variant="h5" gutterBottom align="center">
                    로그인
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="이메일"
                        name="username"
                        type="email"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        label="비밀번호"
                        name="password"
                        type="password"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    {error && (
                        <Typography color="error" variant="body2" sx={{ marginBottom: 2 }}>
                            {error}
                        </Typography>
                    )}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
                            로그인
                        </Button>
                        <Button component={Link} to="/signup" variant="contained" color="#fff" fullWidth sx={{ marginTop: 2 }}>
                            회원가입
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default Login;
