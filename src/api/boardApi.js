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

export const submitBoardPost = async (token, postData, file = null) => {
    try {
        const formData = new FormData();

        // 서버가 'request' 필드 안에 JSON 데이터를 감싸서 보내길 원함
        const requestPayload = {
            title: postData.title,
            content: postData.content,
            category: postData.category,
        };

        formData.append('request', new Blob([JSON.stringify(requestPayload)], { type: 'application/json' }));

        // 파일이 있으면 추가
        if (file) {
            formData.append('file', file);
        }

        const response = await axiosInstance.post('/boards', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};

// 게시글 수정
export const updateBoardPost = async (token, postId, postData, file = null) => {
    try {
        const formData = new FormData();

        // 서버에서 `request` 필드 안에 JSON 데이터가 필요함
        const requestPayload = {
            title: postData.title,
            content: postData.content,
            category: postData.category,
        };

        formData.append('request', new Blob([JSON.stringify(requestPayload)], { type: 'application/json' }));

        // 파일이 있을 경우 추가
        if (file) {
            formData.append('file', file);
        }

        const response = await axiosInstance.patch(`/boards/${postId}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data', // FormData를 사용할 경우 자동으로 설정됨
            },
        });

        return response.data;
    } catch (error) {
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
