// src/pages/BoardPost.js
import React, { useEffect, useState } from 'react';
import { Modal, Paper, Typography, Button, Box, Divider } from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getBoardPost } from '../api/boardApi';
import { useAuth } from '../context/AuthContext';
import styles from '../pages/Board.module.css';

const BoardPost = ({ categories }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { accessToken } = useAuth();
    const [post, setPost] = useState(null);

    const locationCategories = location.state?.categories || categories;

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await getBoardPost(accessToken, id);
                setPost(data);
            } catch (error) {
                console.error('게시글 조회 실패:', error);
            }
        };
        fetchPost();
    }, [accessToken, id]);

    const handleClose = () => {
        navigate(-1); // 이전 location(배경 페이지)로 돌아감
    };

    const handleEdit = () => {
        navigate(`/board/edit/${post.id}`, { state: { categories: locationCategories } }); // 수정 페이지로 이동
    };

    if (!post) return null;

    return (
        <Modal open={true} onClose={handleClose}>
            <Paper
                sx={{
                    padding: 4,
                    width: '90%',
                    maxWidth: '600px',
                    margin: 'auto',
                    marginTop: '5%',
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: '#fff',
                }}
                className={styles.boardContainer}
            >
                {/* 제목 섹션 */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                        제목:
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                        {post.title}
                    </Typography>
                </Box>
                <Divider sx={{ marginBottom: 2 }} />

                {/* 내용 섹션 */}
                <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: 1 }}>
                    내용:
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        marginBottom: 3,
                        textAlign: 'left',
                        lineHeight: 1.5,
                        whiteSpace: 'pre-line', // 줄바꿈 유지
                    }}
                >
                    {post.content}
                </Typography>
                <Divider sx={{ marginBottom: 2 }} />

                {/* 이미지 섹션 */}
                {post.imageUrl || (post.imageUrls && post.imageUrls.length > 0) ? (
                    <Box>
                        <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: 1 }}>
                            이미지:
                        </Typography>
                        <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
                            {post.imageUrls && post.imageUrls.length > 0 ? (
                                post.imageUrls.map((url, index) => (
                                    <img
                                        key={index}
                                        src={url}
                                        alt={`게시글 이미지 ${index + 1}`}
                                        style={{
                                            maxWidth: '100%',
                                            height: 'auto',
                                            maxHeight: '300px',
                                            borderRadius: '5px',
                                            marginBottom: '10px',
                                        }}
                                    />
                                ))
                            ) : (
                                <img
                                    src={post.imageUrl}
                                    alt="게시글 이미지"
                                    style={{
                                        maxWidth: '100%',
                                        height: 'auto',
                                        maxHeight: '300px',
                                        borderRadius: '5px',
                                        marginBottom: '10px',
                                    }}
                                />
                            )}
                        </Box>
                        <Divider sx={{ marginBottom: 2 }} />
                    </Box>
                ) : null}

                {/* 닫기 버튼 */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleEdit} sx={{ fontSize: '0.8rem' }}>
                        수정
                    </Button>
                    <Button variant="outlined" color="primary" onClick={handleClose}>
                        닫기
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );
};

export default BoardPost;
