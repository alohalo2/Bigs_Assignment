// src/App.js
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Board from './pages/Board'; // 게시판 목록 페이지 (검색, 필터, 리스트, 페이지네이션 포함)
import BoardForm from './components/BoardForm'; // 글쓰기/수정 페이지
import Header from './components/Header';
import BoardPost from './components/BoardPost.js';
import ProtectedRoute from './ProtectedRoute.js'; // 로그인 여부에 따라 보호하는 컴포넌트
import styles from './App.module.css';

function App() {
    const location = useLocation();
    // 로그인, 회원가입 페이지에서는 헤더 숨김
    const hideHeader = location.pathname.startsWith('/login') || location.pathname.startsWith('/signup');

    // background location을 추적: 모달 라우트가 열릴 때 현재 페이지(배경)를 기억
    const state = location.state;

    return (
        <>
            {!hideHeader && <Header />}
            {/* 배경 라우트 */}
            <Routes location={state?.background || location}>
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
                <Route
                    path="/board/write"
                    element={
                        <ProtectedRoute>
                            <BoardForm />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/board/edit/:id"
                    element={
                        <ProtectedRoute>
                            <BoardForm />
                        </ProtectedRoute>
                    }
                />
                {/* 기본 배경 라우트: 다른 경로는 로그인 페이지로 리다이렉트 */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>

            {/* 모달 라우트: background가 있을 때만 모달을 렌더링 */}
            {state?.background && (
                <Routes>
                    <Route
                        path="/board/view/:id"
                        element={
                            <ProtectedRoute>
                                <BoardPost />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            )}
        </>
    );
}

export default App;
