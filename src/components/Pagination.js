// src/components/Pagination.js
import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Pagination = ({ page, totalPages }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category') || 'ALL';
    const query = searchParams.get('q') || '';

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            navigate(`/board?page=${newPage}&category=${category}&q=${query}`);
        }
    };

    // 게시물이 없거나 페이지가 1개 이하라면 페이지네이션을 숨김
    if (totalPages <= 1) return null;

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 2 }}>
            <Button onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
                이전
            </Button>
            <Typography>
                {page + 1} / {totalPages}
            </Typography>
            <Button onClick={() => handlePageChange(page + 1)} disabled={page + 1 >= totalPages}>
                다음
            </Button>
        </Box>
    );
};

export default Pagination;
