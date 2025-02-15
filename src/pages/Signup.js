import React, { useState } from 'react';
import { signup } from '../api/memberApi';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Paper, Typography, Box, Container } from '@mui/material';

const Signup = () => {
    const [form, setForm] = useState({ username: '', name: '', password: '', confirmPassword: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 비밀번호 유효성 검사 (8자 이상, 숫자, 영문, 특수문자 포함)
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!passwordRegex.test(form.password)) {
            alert('비밀번호는 8자 이상이며 숫자, 영문, 특수문자(!@#$%^&*)가 포함되어야 합니다.');
            return;
        }
        if (form.password !== form.confirmPassword) {
            alert('비밀번호와 확인 비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            await signup(form);
            alert('회원가입 성공! 로그인 페이지로 이동합니다.');
            navigate('/login');
        } catch (error) {

            // **서버 응답에서 사용 중인 아이디 여부 확인**
            if (error.response && error.response.status === 400) {
                const errorMessage = error.response.data?.username?.[0]; // 백엔드에서 `username` 필드 에러를 보낸다면 해당 값 가져오기
                if (errorMessage) {
                    alert(`회원가입 실패: ${errorMessage}`); // 예: "이미 사용 중인 아이디입니다."
                } else {
                    alert('회원가입 실패: 입력 정보를 확인하세요.');
                }
            } else {
                alert('회원가입 실패: 네트워크 오류 또는 서버 문제입니다.');
            }
        }
    };

    const handleCancel = () => {
        navigate('/login');
    };

    return (
        <Container maxWidth="sm">
            <Paper sx={{ padding: 4, marginTop: 5, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    회원가입
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box sx={{ marginBottom: 2 }}>
                        <TextField
                            label="이메일"
                            name="username"
                            type="email"
                            value={form.username}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Box>
                    <Box sx={{ marginBottom: 2 }}>
                        <TextField
                            label="사용자 이름"
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Box>
                    <Box sx={{ marginBottom: 2 }}>
                        <TextField
                            label="비밀번호"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Box>
                    <Box sx={{ marginBottom: 2 }}>
                        <TextField
                            label="비밀번호 확인"
                            name="confirmPassword"
                            type="password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', marginTop: 2 }}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            회원가입
                        </Button>
                        <Button variant="contained" color="#fff" fullWidth onClick={handleCancel}>
                            취소
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default Signup;
