// src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Header = () => {
    const { user, setUser, setAccessToken } = useAuth();
    const navigate = useNavigate();

    // 로그아웃 핸들러
    const handleLogout = () => {
        sessionStorage.removeItem('refreshToken'); // 리프레쉬 토큰 삭제
        setUser(null); // 사용자 상태 초기화
        setAccessToken(null); // 엑세스 토큰 초기화
        navigate('/login'); // 로그인 페이지로 이동
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: '#1976d2', borderRadius: 0 }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'end' }}>
                {/* 우측 메뉴 */}
                {user ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body1" sx={{ cursor: 'default' }}>
                            {`${user.username}  ${user.name}님`}
                        </Typography>
                        <Button variant='contained' color="primary" onClick={handleLogout}>
                            로그아웃
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button color="inherit" component={Link} to="/login">
                            로그인
                        </Button>
                        <Button color="inherit" component={Link} to="/signup">
                            회원가입
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;
