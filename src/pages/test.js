// import React, { useEffect, useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import {
//     getBoardCategories,
//     getBoardPosts,
//     getBoardPost,
//     submitBoardPost,
//     updateBoardPost,
//     deleteBoardPost,
// } from '../api/boardApi';
// import {
//     List,
//     ListItemButton,
//     ListItemText,
//     ListItem,
//     Paper,
//     Button,
//     Typography,
//     TextField,
//     Box,
//     Select,
//     MenuItem,
//     Modal,
//     Tabs,
//     Tab,
// } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
// import styles from '../pages/Board.module.css';

// const Board = () => {
//     const { accessToken } = useAuth();

//     const [categories, setCategories] = useState([{ key: 'ALL', name: '전체' }]); // '전체' 기본 추가
//     const [selectedCategory, setSelectedCategory] = useState('ALL'); // 기본값: 전체
//     const [loading, setLoading] = useState(true);

//     const [posts, setPosts] = useState([]);
//     const [selectedPost, setSelectedPost] = useState(null);

//     const [isWriting, setIsWriting] = useState(false);
//     const [isEditing, setIsEditing] = useState(false);

//     const [modalOpen, setModalOpen] = useState(false);

//     const [page, setPage] = useState(0); // 현재 페이지 상태
//     const [totalPages, setTotalPages] = useState(1); // 전체 페이지 개수
//     const pageSize = 10; // 한 페이지에 보여줄 게시글 개수

//     const [searchQuery, setSearchQuery] = useState('');
//     const [searchResults, setSearchResults] = useState([]);

//     const [newPost, setNewPost] = useState({ title: '', content: '', category: 'NOTICE' });
//     const [file, setFile] = useState(null); // 파일 상태 추가

//     const [editingPost, setEditingPost] = useState({ title: '', content: '', category: 'NOTICE' });
//     const [editFile, setEditFile] = useState(null); // 수정 시 파일 업로드 추가

//     // useEffect(() => {
//     //     if (!accessToken) return;
//     //     const fetchData = async () => {
//     //         try {
//     //             const catData = await getBoardCategories(accessToken);
//     //             setCategories(catData);
//     //             const postsData = await getBoardPosts(accessToken, page, 10);
//     //             setPosts(postsData.content || []);

//     //             // 전체 페이지 수 설정 (API가 totalPages를 지원하면 사용)
//     //             if (postsData.totalPages !== undefined) {
//     //                 setTotalPages(postsData.totalPages);
//     //             } else if (postsData.totalElements !== undefined) {
//     //                 setTotalPages(Math.ceil(postsData.totalElements / pageSize));
//     //             }
//     //         } catch (error) {
//     //             console.error('데이터 로드 실패:', error);
//     //         }
//     //     };
//     //     fetchData();
//     // }, [page, accessToken]);

//     // 1. 카테고리 목록 불러오기 (처음 한 번 실행)
//     useEffect(() => {
//         if (!accessToken) return;

//         const fetchCategories = async () => {
//             try {
//                 const catData = await getBoardCategories(accessToken);
//                 const categoryList = Object.entries(catData).map(([key, name]) => ({ key, name }));
//                 setCategories([{ key: 'ALL', name: '전체' }, ...categoryList]); // "전체" 추가
//             } catch (error) {
//                 console.error('카테고리 로드 실패:', error);
//             }
//         };

//         fetchCategories();
//     }, [accessToken]); // accessToken이 바뀔 때만 실행 (한 번만 실행됨)

//     // 2. 게시글 목록 불러오기 (선택된 카테고리 & 페이지 변경 시 실행)
//     useEffect(() => {
//         if (!accessToken) return;
//         setLoading(true);

//         const fetchPosts = async () => {
//             try {
//                 // 프론트엔드에서 카테고리 필터링
//                 const allPostsData = await getBoardPosts(accessToken, page, pageSize);
//                 const filteredPosts =
//                     selectedCategory === 'ALL'
//                         ? allPostsData.content || []
//                         : (allPostsData.content || []).filter((post) => post.category === selectedCategory);

//                 // 전체 페이지 수 업데이트
//                 if (allPostsData.totalPages !== undefined) {
//                     setTotalPages(allPostsData.totalPages);
//                 } else if (allPostsData.totalElements !== undefined) {
//                     setTotalPages(Math.ceil(allPostsData.totalElements / pageSize));
//                 }

//                 setPosts(filteredPosts);
//             } catch (error) {
//                 console.error('게시글 로드 실패:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchPosts();
//     }, [accessToken, selectedCategory, page]); // 선택된 카테고리 or 페이지가 바뀔 때 실행

//     // 게시글 작성
//     const handleSubmitPost = async () => {
//         if (!accessToken) return;
//         try {
//             await submitBoardPost(accessToken, newPost, file);
//             alert('게시글 작성 완료!');
//             setNewPost({ title: '', content: '', category: 'NOTICE' });
//             setFile(null);
//             setIsWriting(false);
//             window.location.reload(); // 새로고침하여 목록 업데이트
//         } catch (error) {
//             console.error('게시글 작성 실패:', error);
//         }
//     };

//     // 게시글 수정
//     const handleUpdatePost = async () => {
//         if (!accessToken || !editingPost) return;
//         try {
//             await updateBoardPost(accessToken, editingPost.id, editingPost, editFile);
//             alert('게시글 수정 완료!');
//             setEditingPost(null);
//             setEditFile(null);
//             setIsEditing(false);
//             window.location.reload();
//         } catch (error) {
//             console.error('게시글 수정 실패:', error);
//         }
//     };

//     // 게시글 삭제
//     const handleDeletePost = async (postId) => {
//         if (!accessToken) return;
//         try {
//             await deleteBoardPost(accessToken, postId);
//             alert('게시글 삭제 완료!');
//             window.location.reload();
//         } catch (error) {
//             console.error('게시글 삭제 실패:', error);
//         }
//     };

//     // 검색된 게시글 선택 시 상세 조회
//     // const handleSelectPost = async (event, value) => {
//     //     if (!value) return;
//     //     try {
//     //         const postData = await getBoardPost(accessToken, value.id);
//     //         setSelectedPost(postData);
//     //     } catch (error) {
//     //         console.error('게시글 조회 실패:', error);
//     //     }
//     // };

//     // 게시글 클릭 시 상세 조회
//     const handleViewPost = async (postId) => {
//         if (!accessToken) return;
//         try {
//             const postData = await getBoardPost(accessToken, postId);
//             setSelectedPost(postData);
//             setModalOpen(true);
//         } catch (error) {
//             console.error('게시글 조회 실패:', error);
//         }
//     };

//     // 페이지 변경 함수
//     const handlePageChange = (newPage) => {
//         if (newPage >= 0 && newPage < totalPages) {
//             setPage(newPage);
//         }
//     };

//     // 검색 버튼 클릭 시 필터링 방식으로 검색 수행
//     const handleSearch = () => {
//         if (searchQuery.length >= 1) {
//             const filteredResults = posts.filter((post) =>
//                 post.title.toLowerCase().includes(searchQuery.toLowerCase())
//             );
//             setSearchResults(filteredResults);
//         } else {
//             alert('검색어를 1글자 이상 입력하세요.');
//         }
//     };

//     // 검색어 입력 변경 시 검색 결과 초기화
//     const handleSearchChange = (event) => {
//         const value = event.target.value;
//         setSearchQuery(value);

//         if (value.length === 0) {
//             setSearchResults(posts); // 검색어가 비워지면 원래 리스트 복구
//         }
//     };

//     const handleWritePost = () => {
//         setIsWriting(true);
//     };

//     // 수정 버튼 클릭 시 수정 모드로 전환
//     const handleEditPost = (post) => {
//         console.log(editingPost.content);
//         setEditingPost({ ...post }); // 기존 게시글 데이터를 그대로 할당
//         setIsEditing(true);
//         setIsWriting(true);
//     };

//     const handleCancelWrite = () => {
//         setIsWriting(false);
//         setIsEditing(false);

//         // 입력한 내용 초기화
//         setNewPost({ title: '', content: '', category: 'NOTICE' });
//         setFile(null);
//         setEditingPost(null);
//         setEditFile(null);
//     };

//     return (
//         <div className={styles.boardContainer}>
//             <Typography
//                 variant="h4"
//                 sx={{
//                     textAlign: 'center',
//                     margin: '3rem 0',
//                 }}
//             >
//                 게시판
//             </Typography>

//             {!isWriting && (
//                 <>
//                     {/* 검색 입력 + 검색 버튼 */}
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 2 }}>
//                         <TextField
//                             label="게시글 검색"
//                             variant="outlined"
//                             fullWidth
//                             value={searchQuery}
//                             onChange={handleSearchChange}
//                             size="small" // 자동으로 높이를 버튼과 맞춤
//                             sx={{
//                                 backgroundColor: '#fff',
//                                 '& .MuiOutlinedInput-root': {
//                                     height: '40px', // 버튼과 동일한 높이
//                                     display: 'flex',
//                                     alignItems: 'center', // 텍스트 정렬
//                                 },
//                             }}
//                         />
//                         <Button
//                             variant="contained"
//                             color="primary"
//                             onClick={handleSearch}
//                             startIcon={<SearchIcon />}
//                             sx={{
//                                 height: '40px', // 버튼 높이 설정
//                                 whiteSpace: 'nowrap',
//                                 minWidth: '100px', // 버튼 크기 일정하게 유지
//                             }}
//                         >
//                             검색
//                         </Button>
//                     </Box>

//                     {/* 게시글 목록 */}
//                     <Paper sx={{ padding: 2, marginBottom: 2 }}>
//                         <Typography
//                             variant="h5"
//                             sx={{
//                                 marginBottom: '2rem',
//                             }}
//                         >
//                             게시글 목록
//                         </Typography>

//                         {/* 카테고리 탭 */}
//                         {!searchQuery && (
//                             <Tabs
//                                 value={selectedCategory}
//                                 onChange={(e, newValue) => setSelectedCategory(newValue)}
//                                 variant="scrollable"
//                                 scrollButtons="auto"
//                                 sx={{
//                                     backgroundColor: '#f5f5f5',
//                                     '& .MuiTabs-indicator': { display: 'none' },
//                                     '& .MuiTab-root': {
//                                         textTransform: 'none',
//                                         fontWeight: 500,
//                                         padding: '8px 16px',
//                                         color: '#555',
//                                     },
//                                     '& .Mui-selected': {
//                                         backgroundColor: '#fff',
//                                         borderRadius: '8px',
//                                         fontWeight: 'bold',
//                                         color: '#000',
//                                         boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.1)',
//                                     },
//                                 }}
//                             >
//                                 {categories.map((category) => (
//                                     <Tab key={category.key} label={category.name} value={category.key} />
//                                 ))}
//                             </Tabs>
//                         )}

//                         {searchResults.length > 0 ? (
//                             <List>
//                                 {searchResults.map((post) => (
//                                     <ListItem key={post.id}>
//                                         <ListItemButton
//                                             onClick={() => handleViewPost(post.id)}
//                                             sx={{
//                                                 border: '1px solid #D9D9D9',
//                                                 borderRadius: '8px',
//                                             }}
//                                         >
//                                             <ListItemText primary={post.title} secondary={post.category} />
//                                             <Box sx={{ zIndex: '10' }}>
//                                                 <Button
//                                                     onClick={(e) => {
//                                                         e.stopPropagation(); // 부모 클릭 이벤트 차단
//                                                         handleDeletePost(post.id);
//                                                     }}
//                                                     color="error"
//                                                 >
//                                                     삭제
//                                                 </Button>
//                                                 <Button
//                                                     onClick={(e) => {
//                                                         e.stopPropagation(); // 부모 클릭 이벤트 차단
//                                                         handleEditPost(post);
//                                                     }}
//                                                     color="primary"
//                                                 >
//                                                     수정
//                                                 </Button>
//                                             </Box>
//                                         </ListItemButton>
//                                     </ListItem>
//                                 ))}
//                             </List>
//                         ) : posts.length > 0 ? (
//                             <List>
//                                 {posts.map((post) => (
//                                     <ListItem
//                                         key={post.id}
//                                         // secondaryAction={
//                                         // }
//                                     >
//                                         <ListItemButton
//                                             onClick={() => handleViewPost(post.id)}
//                                             sx={{
//                                                 border: '1px solid #D9D9D9',
//                                                 borderRadius: '8px',
//                                             }}
//                                         >
//                                             <ListItemText primary={post.title} secondary={post.category} />
//                                             <Box sx={{ zIndex: '10' }}>
//                                                 <Button
//                                                     onClick={(e) => {
//                                                         e.stopPropagation(); // 부모 클릭 이벤트 차단
//                                                         handleDeletePost(post.id);
//                                                     }}
//                                                     color="error"
//                                                 >
//                                                     삭제
//                                                 </Button>
//                                                 <Button
//                                                     onClick={(e) => {
//                                                         e.stopPropagation(); // 부모 클릭 이벤트 차단
//                                                         handleEditPost(post);
//                                                     }}
//                                                     color="primary"
//                                                 >
//                                                     수정
//                                                 </Button>
//                                             </Box>
//                                         </ListItemButton>
//                                     </ListItem>
//                                 ))}
//                             </List>
//                         ) : (
//                             <Typography
//                                 color="textSecondary"
//                                 sx={{
//                                     marginBottom: '2rem',
//                                 }}
//                             >
//                                 게시글이 없습니다.
//                             </Typography>
//                         )}

//                         {/* 페이지네이션 UI */}
//                         {!searchQuery && (page > 0 || posts.length === pageSize) && (
//                             <div className={styles.pagination} style={{ marginTop: '16px', textAlign: 'center' }}>
//                                 <Button onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
//                                     이전
//                                 </Button>
//                                 <Typography variant="body1" display="inline">
//                                     {page + 1} / {totalPages}
//                                 </Typography>
//                                 <Button onClick={() => handlePageChange(page + 1)} disabled={page + 1 >= totalPages}>
//                                     다음
//                                 </Button>
//                             </div>
//                         )}
//                     </Paper>
//                 </>
//             )}

//             {/* 글 쓰기 버튼 */}
//             {!isWriting && (
//                 <Box sx={{ display: 'flex', justifyContent: 'center' }}>
//                     <Button
//                         sx={{ marginTop: 3, marginBottom: 3 }}
//                         variant="contained"
//                         color="primary"
//                         onClick={handleWritePost}
//                     >
//                         글 쓰기
//                     </Button>
//                 </Box>
//             )}

//             {/* 게시글 작성 */}
//             {(isWriting || isEditing) && (
//                 <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//                     <Paper sx={{ padding: 3, marginBottom: '4rem', backgroundColor: '#f9f9f9' }}>
//                         <Typography
//                             variant="h5"
//                             gutterBottom
//                             sx={{
//                                 marginBottom: '2rem',
//                             }}
//                         >
//                             {isEditing ? '게시글 수정' : '게시글 작성'}
//                         </Typography>

//                         <TextField
//                             fullWidth
//                             label="제목"
//                             variant="outlined"
//                             value={isEditing ? editingPost?.title || '' : newPost.title} // 기본값을 빈 문자열로 설정
//                             onChange={(e) =>
//                                 isEditing
//                                     ? setEditingPost({ ...editingPost, title: e.target.value })
//                                     : setNewPost({ ...newPost, title: e.target.value })
//                             }
//                             sx={{
//                                 marginBottom: 2,
//                                 backgroundColor: '#fff',
//                             }}
//                         />

//                         <TextField
//                             fullWidth
//                             label="내용"
//                             variant="outlined"
//                             multiline
//                             rows={6} // 원하는 높이 설정
//                             placeholder="내용을 입력하세요..."
//                             value={isEditing ? editingPost?.content || '' : newPost.content} // 기본값을 빈 문자열로 설정
//                             onChange={(e) =>
//                                 isEditing
//                                     ? setEditingPost({ ...editingPost, content: e.target.value })
//                                     : setNewPost({ ...newPost, content: e.target.value })
//                             }
//                             sx={{
//                                 marginBottom: 2,
//                                 backgroundColor: '#fff',
//                             }}
//                         />

//                         <Select
//                             fullWidth
//                             value={isEditing ? editingPost?.category || '' : newPost.category}
//                             onChange={(e) =>
//                                 isEditing
//                                     ? setEditingPost({ ...editingPost, category: e.target.value })
//                                     : setNewPost({ ...newPost, category: e.target.value })
//                             }
//                             sx={{
//                                 marginTop: 2,
//                                 marginBottom: 2,
//                                 backgroundColor: '#fff',
//                             }}
//                         >
//                             {/* '전체' 항목을 없애고, 카테고리 목록만 보여줌 */}
//                             {categories
//                                 .filter((category) => category.key !== 'ALL') // "전체" 항목 제외
//                                 .map((category) => (
//                                     <MenuItem key={category.key} value={category.key}>
//                                         {category.name}
//                                     </MenuItem>
//                                 ))}
//                         </Select>

//                         <Box sx={{ marginBottom: 2 }}>
//                             <Button variant="contained" component="label">
//                                 파일 업로드
//                                 <input type="file" hidden onChange={(e) => setFile(e.target.files[0])} />
//                             </Button>
//                             {file && (
//                                 <Typography variant="body2" sx={{ marginTop: 1 }}>
//                                     선택된 파일: {file.name}
//                                 </Typography>
//                             )}
//                         </Box>

//                         <Box sx={{ display: 'flex', gap: 2 }}>
//                             <Button
//                                 variant="contained"
//                                 color="primary"
//                                 onClick={isEditing ? handleUpdatePost : handleSubmitPost}
//                                 fullWidth
//                             >
//                                 {isEditing ? '수정 완료' : '게시글 작성'}
//                             </Button>
//                             <Button variant="contained" color="#fff" onClick={handleCancelWrite} fullWidth>
//                                 취소
//                             </Button>
//                         </Box>
//                     </Paper>
//                 </Box>
//             )}

//             <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
//                 <Paper sx={{ padding: 3, width: 400, margin: 'auto', marginTop: '10%' }}>
//                     {selectedPost && (
//                         <>
//                             <Typography variant="h5">{selectedPost.title}</Typography>
//                             <Typography>{selectedPost.content}</Typography>
//                             <Button onClick={() => setModalOpen(false)}>닫기</Button>
//                         </>
//                     )}
//                 </Paper>
//             </Modal>
//         </div>
//     );
// };

// export default Board;