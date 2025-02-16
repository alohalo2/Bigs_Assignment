// src/pages/BoardViewModal.js
import React, { useEffect, useState } from 'react';
import { Modal, Paper, Typography, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { getBoardPost } from '../api/boardApi';
import { useAuth } from '../context/AuthContext';
import styles from '../pages/Board.module.css';

const BoardViewModal = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { accessToken } = useAuth();
    const [post, setPost] = useState(null);

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

    if (!post) return null;

    return (
        <Modal open={true} onClose={handleClose}>
            <Paper sx={{ padding: 3, width: 400, margin: 'auto', marginTop: '10%' }} className={styles.boardContainer}>
                <Typography variant="h5">{post.title}</Typography>
                <Typography sx={{ marginTop: 2 }}>{post.content}</Typography>
                <Button onClick={handleClose} sx={{ marginTop: 2 }}>
                    닫기
                </Button>
            </Paper>
        </Modal>
    );
};

export default BoardViewModal;
