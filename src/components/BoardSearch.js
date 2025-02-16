// src/components/BoardSearch.js
import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate, useSearchParams } from 'react-router-dom';

const BoardSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category') || 'ALL';

    const handleSearch = () => {
        if (searchQuery.trim().length >= 1) {
            navigate(`/board?category=${category}&q=${searchQuery}`);
        } else {
            // 검색어 없으면 URL에서 q 파라미터 제거하여 원래 리스트 표시
            navigate(`/board?category=${category}`);
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 2 }}>
            <TextField
                label="게시글 검색"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                sx={{ backgroundColor: '#fff' }}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                startIcon={<SearchIcon />}
                sx={{ height: '40px', minWidth: '100px' }}
            >
                검색
            </Button>
        </Box>
    );
};

export default BoardSearch;
