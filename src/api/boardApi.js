import axios from 'axios';

const BASE_URL = 'https://front-mission.bigs.or.kr';

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

// 게시판 카테고리 조회
export const getBoardCategories = async (token) => {
    try {
        const response = await axiosInstance.get('/boards/categories', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 게시글 목록 조회
export const getBoardPosts = async (token, page = 0, size = 10) => {
    try {
        const response = await axiosInstance.get(`/boards?page=${page}&size=${size}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 단일 게시글 조회
export const getBoardPost = async (token, postId) => {
    try {
        const response = await axiosInstance.get(`/boards/${postId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 게시글 등록
export const submitBoardPost = async (token, postData, files = []) => {
    try {
        const formData = new FormData();

        console.log(postData.boardCategory);

        const requestPayload = {
            title: postData.title,
            content: postData.content,
            category: postData.boardCategory,
        };

        formData.append('request', new Blob([JSON.stringify(requestPayload)], { type: 'application/json' }));

        if (files.length > 0) {
            files.forEach((file) => {
                formData.append('files', file);
            });
        }

        const response = await axiosInstance.post('/boards', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('게시글 작성 실패:', error.response?.data || error.message);
        throw error;
    }
};

// 게시글 수정
export const updateBoardPost = async (token, postId, postData, newFiles = []) => {
    try {
        const formData = new FormData();

        const requestPayload = {
            title: postData.title,
            content: postData.content,
            category: postData.boardCategory,
        };

        formData.append('request', new Blob([JSON.stringify(requestPayload)], { type: 'application/json' }));

        if (newFiles.length > 0) {
            newFiles.forEach((file) => {
                formData.append('files', file);
            });
        }

        const response = await axiosInstance.patch(`/boards/${postId}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('게시글 수정 실패:', error.response?.data || error.message);
        throw error;
    }
};

// 게시글 삭제
export const deleteBoardPost = async (token, postId) => {
    try {
        const response = await axiosInstance.delete(`/boards/${postId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
