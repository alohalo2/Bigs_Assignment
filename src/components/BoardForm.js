// src/components/BoardForm.js
import React, { useState, useEffect } from 'react';
import { Paper, TextField, Button, Box, Select, MenuItem, Typography } from '@mui/material';
import { submitBoardPost, updateBoardPost, getBoardPost } from '../api/boardApi';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styles from '../pages/Board.module.css';

const BoardForm = () => {
    const { accessToken } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams(); // 있으면 수정 모드, 없으면 작성 모드
    const location = useLocation();
    // 전달받은 카테고리 데이터 (없으면 빈 배열)
    const categories = location.state?.categories;

    const isEditing = Boolean(id);
    const [post, setPost] = useState({ id: '', title: '', content: '', boardCategory: 'NOTICE', imageUrls: [] });
    const [files, setFiles] = useState([]);

    useEffect(() => {
        if (isEditing) {
            const fetchPost = async () => {
                try {
                    const data = await getBoardPost(accessToken, id);

                    setPost({
                        id: data.id,
                        title: data.title,
                        content: data.content,
                        boardCategory: data.boardCategory,
                        imageUrls: data.imageUrls || (data.imageUrl ? [data.imageUrl] : []), // 기존 이미지 유지
                    });
                } catch (error) {
                    console.error('게시글 조회 실패:', error);
                }
            };
            fetchPost();
        }
    }, [accessToken, id, isEditing]);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);

        // 새로운 파일들의 URL 생성 후 기존 이미지 유지하면서 추가
        const newImageUrls = selectedFiles.map((file) => URL.createObjectURL(file));

        setPost((prev) => ({
            ...prev,
            imageUrls: [...prev.imageUrls, ...newImageUrls], // 기존 이미지 유지 + 새로운 이미지 추가
        }));
    };

    const handleRemoveExistingImage = (url) => {
        setPost((prev) => ({
            ...prev,
            imageUrls: prev.imageUrls.filter((image) => image !== url),
        }));
    };

    const handleSubmit = async () => {
        console.log("handleSubmit.boardCategory: " + post.boardCategory);
        console.log(post);
        if (!accessToken) return;
        try {
            if (isEditing) {
                await updateBoardPost(accessToken, post.id, post, files);
                alert('게시글 수정 완료!');
            } else {
                await submitBoardPost(accessToken, post, files);
                alert('게시글 작성 완료!');
            }
            navigate('/board');
        } catch (error) {
            console.error(isEditing ? '게시글 수정 실패:' : '게시글 작성 실패:', error);
        }
    };

    return (
        <Paper sx={{ padding: 3, marginBottom: '4rem', backgroundColor: '#f9f9f9' }} className={styles.boardContainer}>
            <Typography variant="h5" gutterBottom sx={{ marginBottom: '2rem' }}>
                {isEditing ? '게시글 수정' : '게시글 작성'}
            </Typography>

            <TextField
                fullWidth
                label="제목"
                variant="outlined"
                value={post.title}
                onChange={(e) => setPost({ ...post, title: e.target.value })}
                sx={{ marginBottom: 2, backgroundColor: '#fff' }}
            />

            <TextField
                fullWidth
                label="내용"
                variant="outlined"
                multiline
                rows={6}
                placeholder="내용을 입력하세요..."
                value={post.content}
                onChange={(e) => setPost({ ...post, content: e.target.value })}
                sx={{ marginBottom: 2, backgroundColor: '#fff' }}
            />

            <Select
                fullWidth
                value={post.boardCategory}
                onChange={(e) => setPost({ ...post, boardCategory: e.target.value })}
                sx={{ marginTop: 2, marginBottom: 2, backgroundColor: '#fff' }}
            >
                {/* '전체' 항목 제외하고 카테고리 목록 렌더링 */}
                {categories
                    .filter((category) => category.key !== 'ALL')
                    .map((category) => (
                        <MenuItem key={category.key} value={category.key}>
                            {category.name}
                        </MenuItem>
                    ))}
            </Select>

            <Box sx={{ marginBottom: 2 }}>
                <Button variant="contained" component="label">
                    파일 업로드
                    <input type="file" hidden multiple onChange={handleFileChange} />
                </Button>

                {/* 선택된 파일 리스트 */}
                {post.imageUrls.length > 0 && (
                    <Typography variant="body2" sx={{ marginTop: 1 }}>
                        {post.imageUrls.length}개의 파일 선택됨
                    </Typography>
                )}
            </Box>

            {/* 이미지 미리보기 */}
            {post.imageUrls.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, marginBottom: 2 }}>
                    {post.imageUrls.map((url, index) => (
                        <Box key={index} sx={{ position: 'relative', display: 'inline-block' }}>
                            <img
                                src={url}
                                alt={`기존 이미지 ${index + 1}`}
                                className={styles.previewImage}
                                style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '5px' }}
                            />

                            {/* 삭제 버튼 */}
                            <Button
                                variant="contained"
                                color="error"
                                size="small"
                                onClick={() => handleRemoveExistingImage(url)}
                                sx={{
                                    position: 'absolute',
                                    top: 5,
                                    right: 5,
                                    fontSize: '12px',
                                    padding: '2px',
                                    borderRadius: '3px',
                                }}
                            >
                                X
                            </Button>
                        </Box>
                    ))}
                </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
                    {isEditing ? '수정 완료' : '게시글 작성'}
                </Button>
                <Button variant="outlined" onClick={() => navigate('/board')} fullWidth>
                    취소
                </Button>
            </Box>
        </Paper>
    );
};

export default BoardForm;
