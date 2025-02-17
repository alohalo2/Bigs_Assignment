// src/components/BoardList.js
import React from 'react';
import { List, ListItem, ListItemButton, ListItemText, Box, Button, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { deleteBoardPost } from '../api/boardApi';
import { useAuth } from '../context/AuthContext';

const BoardList = ({ posts, navigate, categories }) => {
    const location = useLocation();
    const { accessToken } = useAuth();

    const handleDelete = async (postId, event) => {
        event.stopPropagation();
        try {
            await deleteBoardPost(accessToken, postId);
            alert('게시글 삭제 완료!');
            window.location.reload();
        } catch (error) {
            console.error('게시글 삭제 실패:', error);
        }
    };

    const handleView = (post) => {
        // 현재 location을 background로 전달하여 모달 오버레이 구현
        navigate(`/board/view/${post.id}`, { state: { background: location, categories } });
    };

    return (
        <>
            {posts.length === 0 ? (
                <Typography variant="body1" sx={{ textAlign: 'center', padding: 3, color: 'gray' }}>
                    등록된 게시물이 없습니다.
                </Typography>
            ) : (
                <List>
                    {posts.map((post) => (
                        <ListItem key={post.id}>
                            <ListItemButton
                                onClick={() => handleView(post)}
                                sx={{ border: '1px solid #D9D9D9', borderRadius: '8px' }}
                            >
                                <ListItemText primary={post.title} secondary={post.category} />
                                <Box sx={{ zIndex: 10 }}>
                                    <Button color="error" onClick={(e) => handleDelete(post.id, e)}>
                                        삭제
                                    </Button>
                                </Box>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            )}
        </>
    );
};

export default BoardList;
