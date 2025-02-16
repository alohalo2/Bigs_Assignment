// src/components/CategoryTabs.js
import React from 'react';
import { Tabs, Tab } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

const CategoryTabs = ({ categories, selectedCategory }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    const handleChange = (event, newCategory) => {
        navigate(`/board?category=${newCategory}&q=${query}`);
    };

    return (
        <Tabs
            value={selectedCategory}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
                backgroundColor: '#f5f5f5',
                '& .MuiTabs-indicator': { display: 'none' },
                '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 500,
                    color: '#555',
                },
                '& .Mui-selected': {
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    color: '#000',
                    boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.1)',
                },
            }}
        >
            {categories.map((cat) => (
                <Tab key={cat.key} label={cat.name} value={cat.key} />
            ))}
        </Tabs>
    );
};

export default CategoryTabs;
