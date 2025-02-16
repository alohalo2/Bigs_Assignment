// src/components/BoardList.js
import React from 'react';
import { List, ListItem, ListItemButton, ListItemText, Box, Button } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { deleteBoardPost } from '../api/boardApi';
import { useAuth } from '../context/AuthContext';

const BoardList = ({ posts, navigate, categories}) => {
    const location = useLocation();
    const { accessToken } = useAuth();

    const handleDelete = async (postId, event) => {
        event.stopPropagation();
        try {
            await deleteBoardPost(accessToken, postId);
            alert('게시글 삭제 완료!');
            navigate('/board'); // 삭제 후 목록 업데이트
        } catch (error) {
            console.error('게시글 삭제 실패:', error);
        }
    };

    const handleEdit = (post, event) => {
        event.stopPropagation();
        // 수정 시에도 categories 데이터를 함께 전달
        navigate(`/board/edit/${post.id}`, { state: { categories } });
    };

    const handleView = (post) => {
        // 현재 location을 background로 전달하여 모달 오버레이 구현
        navigate(`/board/view/${post.id}`, { state: { background: location } });
    };

    return (
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
                            <Button color="primary" onClick={(e) => handleEdit(post, e)}>
                                수정
                            </Button>
                        </Box>
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
};

export default BoardList;
