// src/pages/Board.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getBoardCategories, getBoardPosts } from '../api/boardApi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Typography, Paper, Box, Button } from '@mui/material';
import BoardSearch from '../components/BoardSearch';
import CategoryTabs from '../components/CategoryTabs';
import BoardList from '../components/BoardList';
import Pagination from '../components/Pagination';
import BoardPost from '../components/BoardPost';
import styles from '../pages/Board.module.css';

const Board = () => {
    const { accessToken } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // URL 파라미터 읽기
    const query = searchParams.get('q') || '';
    const selectedCategory = searchParams.get('category') || 'ALL';
    const page = parseInt(searchParams.get('page')) || 0;

    const [categories, setCategories] = useState([{ key: 'ALL', name: '전체' }]);
    const [posts, setPosts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedPost, setSelectedPost] = useState(null);
    const pageSize = 10;

    // ① 카테고리 불러오기 (한번 실행)
    useEffect(() => {
        if (!accessToken) return;
        const fetchCategories = async () => {
            try {
                const catData = await getBoardCategories(accessToken);
                const categoryList = Object.entries(catData).map(([key, name]) => ({ key, name }));
                setCategories([{ key: 'ALL', name: '전체' }, ...categoryList]);
            } catch (error) {
                console.error('카테고리 로드 실패:', error);
            }
        };
        fetchCategories();
    }, [accessToken]);

    // ② 게시글 불러오기 (카테고리, 페이지, 검색어 변경 시)
    useEffect(() => {
        if (!accessToken) return;
        const fetchPosts = async () => {
            try {
                const postsData = await getBoardPosts(accessToken, page, pageSize);
                let filteredPosts = postsData.content || [];
                // 카테고리 필터 적용 (검색어가 없을 때만)
                if (selectedCategory !== 'ALL' && query === '') {
                    filteredPosts = filteredPosts.filter((post) => post.boardCategory === selectedCategory);
                }
                // 검색어 필터 적용 (제목에 포함)
                if (query) {
                    filteredPosts = filteredPosts.filter((post) =>
                        post.title.toLowerCase().includes(query.toLowerCase())
                    );
                }
                setPosts(filteredPosts);
                if (postsData.totalPages !== undefined) {
                    setTotalPages(postsData.totalPages);
                } else if (postsData.totalElements !== undefined) {
                    setTotalPages(Math.ceil(postsData.totalElements / pageSize));
                }
            } catch (error) {
                console.error('게시글 로드 실패:', error);
            }
        };
        fetchPosts();
    }, [accessToken, selectedCategory, page, query]);

    return (
        <div className={styles.boardContainer}>
            <Typography variant="h4" sx={{ textAlign: 'center', margin: '3rem 0' }}>
                게시판
            </Typography>
            <BoardSearch />
            {/* 카테고리 탭과 리스트를 하나의 Paper로 묶어서 자연스럽게 연결 */}
            <Paper
                sx={{
                    padding: 2,
                    marginBottom: 2,
                    backgroundColor: '#fff',
                    borderRadius: '10px',
                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                }}
            >
                {query === '' && (
                    <Box sx={{ marginBottom: 2, borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                        <CategoryTabs categories={categories} selectedCategory={selectedCategory} />
                    </Box>
                )}
                <BoardList posts={posts} navigate={navigate} categories={categories} />
                <Pagination page={page} totalPages={totalPages} />
            </Paper>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                    sx={{ marginTop: 3, marginBottom: 3 }}
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/board/write', { state: { categories } })}
                >
                    글 쓰기
                </Button>
            </Box>
            {/* 게시글 상세보기 모달 (URL 기반 상세보기 페이지도 가능) */}
            {selectedPost && <BoardPost post={selectedPost} setSelectedPost={setSelectedPost} categories={categories} />}
        </div>
    );
};

export default Board;
