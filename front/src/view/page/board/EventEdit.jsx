"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import './EventWrite.css';
import { queryClient } from './EventPage';

function EventEdit() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [contentImages, setContentImages] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const [category, setCategory] = useState('EVENT');
    const [isNewThumbnailUploaded, setIsNewThumbnailUploaded] = useState(false);
    const [initialFiles, setInitialFiles] = useState([]);
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [contentImageUrls, setContentImageUrls] = useState([]);

    useEffect(() => {
        const categoryParam = new URLSearchParams(location.search).get('category');
        if (categoryParam) {
            setCategory(categoryParam);
        }

        const fetchEventData = async () => {
            try {
                const response = await fetch(`http://localhost:9977/board/view/edit/${id}`);
                if (!response.ok) {
                    throw new Error("이벤트 수정 데이터를 불러오는데 실패했습니다.");
                }
                const eventData = await response.json();
                console.log("불러온 이벤트 데이터:", eventData);
                setTitle(eventData.subject);
                setContent(eventData.content);
                setStartDate(formatDateTimeForInput(eventData.startDate));
                setEndDate(formatDateTimeForInput(eventData.endDate));
                setInitialFiles(eventData.files || []); // initialFiles 에 모든 파일 정보 저장

            } catch (error) {
                console.error("이벤트 데이터 불러오기 오류:", error);
                alert("이벤트 수정 데이터를 불러오는데 실패했습니다.");
                navigate(`/boardpage?category=EVENT`);
            }
        };

        fetchEventData();
    }, [id, location, navigate]);


    const formatDateTimeForInput = (dateTimeString) => {
        if (!dateTimeString) return '';
        const date = new Date(dateTimeString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };


    const handleTitleChange = (e) => setTitle(e.target.value);
    const handleContentChange = (e) => setContent(e.target.value);
    const handleStartDateChange = (e) => setStartDate(e.target.value);
    const handleEndDateChange = (e) => setEndDate(e.target.value);
    const handleThumbnailChange = (e) => {
        setThumbnail(e.target.files[0]);
        setIsNewThumbnailUploaded(true);
        setThumbnailUrl(URL.createObjectURL(e.target.files[0])); // 썸네일 미리보기 URL 설정
    };
    const handleContentImagesChange = (e) => {
        const files = Array.from(e.target.files);
        setContentImages(files);
        setContentImageUrls(files.map(file => URL.createObjectURL(file))); // 내용 이미지 미리보기 URL 설정
    };


    const getSearchKey = useCallback(() => {
        const category = new URLSearchParams(location.search).get("category") || "EVENT";
        return [`eventList`, category, 1, "제목내용", "", false];
    }, [location.search]);

    const handleDeleteFile = async (fileId, fileType) => {
        if (window.confirm("파일을 삭제하시겠습니까?")) {
            try {
                const response = await fetch(`http://localhost:9977/board/file/delete/${fileId}`, { // 백엔드 파일 삭제 API 호출
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('파일 삭제에 실패했습니다.');
                }

                alert('파일이 삭제되었습니다.');
                setInitialFiles(initialFiles.filter(file => file.id !== fileId)); // initialFiles 에서 삭제된 파일 제거

                if (fileType === 'thumbnail') {
                    setThumbnailUrl(''); // 썸네일 URL 초기화
                } else if (fileType === 'content') {
                    setContentImageUrls(contentImageUrls.filter(url => !initialFiles.find(file => file.fileUrl === url && file.id === fileId))); // 내용 이미지 URL 목록 업데이트 (URL 기반으로 삭제 - 정확도 높이기 위해 fileId 조건 추가 가능)
                }

            } catch (error) {
                console.error('파일 삭제 오류:', error);
                alert('파일 삭제 중 오류가 발생했습니다.');
            }
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert('제목을 입력하세요.');
            return;
        }
        if (!content.trim()) {
            alert('내용을 입력하세요.');
            return;
        }
        if (new Date(startDate) > new Date(endDate)) {
            alert('종료 날짜는 시작 날짜 이후여야 합니다.');
            return;
        }

        const formData = new FormData();
        formData.append('event_id', id);
        formData.append('event_title', title);
        formData.append('event_content', content);
        formData.append('event_startdate', startDate);
        formData.append('event_enddate', endDate);
        if (thumbnail) {
            formData.append('mf', thumbnail);
        } else if (!isNewThumbnailUploaded && initialFiles.some(file => file.fileType === 'thumbnail')) {
            // 썸네일 변경 없으면 기존 썸네일 유지 (백엔드에서 처리). initialFiles 에 썸네일이 있는지 확인
        }


        // contentImages (썸네일 제외 content 이미지) formData 에 추가
        contentImages.forEach(file => formData.append('files', file));


        const userId = sessionStorage.getItem('loginId') || 'admin1234';
        formData.append('category', category);
        formData.append('user_id', userId);

        try {
            const response = await fetch('http://localhost:9977/board/eventWriteOk', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('이벤트 수정에 실패했습니다.');
            }

            const data = await response.text();
            console.log('성공:', data);
            alert('글이 수정되었습니다.');
            queryClient.invalidateQueries(getSearchKey());
            navigate(`/events/${id}`);
        } catch (error) {
            console.error('오류:', error);
            alert('글 수정에 실패했습니다.');
        }
    };

    return (
        <div className="container">
            <h1>글 수정</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <table className="custom-table">
                    <tbody>
                        <tr>
                            <th>제목</th>
                            <td><input type="text" name="event_title" value={title} onChange={handleTitleChange} className="custom-input" /></td>
                        </tr>
                        <tr>
                            <th>내용</th>
                            <td>
                                <textarea
                                    name="event_content"
                                    value={content}
                                    onChange={handleContentChange}
                                    className="custom-textarea"
                                    placeholder="내용을 입력하세요..."
                                    rows={10}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>시작 날짜</th>
                            <td><input type="datetime-local" name="event_startdate" value={startDate} onChange={handleStartDateChange} className="custom-input" /></td>
                        </tr>
                        <tr>
                            <th>종료 날짜</th>
                            <td><input type="datetime-local" name="event_enddate" value={endDate} onChange={handleEndDateChange} className="custom-input" /></td>
                        </tr>

                        <tr>
                            <th>현재 썸네일</th>
                            <td>
                                {initialFiles.find(file => file.fileType === 'thumbnail') ? (
                                    <div>
                                        <span>{initialFiles.find(file => file.fileType === 'thumbnail').originalFileName}</span> {/* 파일명 표시 */}
                                        <button type="button" className="btn-delete-file" onClick={() => handleDeleteFile(initialFiles.find(file => file.fileType === 'thumbnail').id, 'thumbnail')}>삭제</button> {/* 삭제 버튼 */}
                                    </div>
                                ) : (
                                    <div>등록된 썸네일 이미지 없음</div>
                                )}
                                {thumbnailUrl && <img src={thumbnailUrl} alt="새 썸네일 미리보기" style={{ maxWidth: '100px', marginTop: '5px' }} />} {/* 새 썸네일 미리보기 */}
                            </td>
                        </tr>
                        <tr>
                            <th>썸네일 업로드</th>
                            <td><input type="file" name="mf" onChange={handleThumbnailChange} className="custom-input" /></td>
                        </tr>

                        <tr>
                            <th>현재 내용 이미지</th>
                            <td>
                                {initialFiles.filter(file => file.fileType === 'content').length > 0 ? (
                                    initialFiles.filter(file => file.fileType === 'content').map((file, index) => (
                                        <div key={file.id}>
                                            <span>{file.originalFileName}</span> {/* 파일명 표시 */}
                                            <button type="button" className="btn-delete-file" onClick={() => handleDeleteFile(file.id, 'content')}>삭제</button> {/* 삭제 버튼 */}
                                        </div>
                                    ))
                                ) : (
                                    <div>등록된 내용 이미지 없음</div>
                                )}
                                {contentImageUrls.length > 0 && contentImageUrls.map((url, index) => ( // 새 내용 이미지 미리보기
                                    <img key={index} src={url} alt={`새 내용 이미지 미리보기 ${index + 1}`} style={{ maxWidth: '100px', margin: '5px' }} />
                                ))}
                            </td>
                        </tr>
                        <tr>
                            <th>내용 이미지 업로드</th>
                            <td><input type="file" name="files" multiple onChange={handleContentImagesChange} className="custom-input" /></td>
                        </tr>
                    </tbody>
                </table>
                <div style={{ textAlign: 'right', marginTop: '10px' }}>
                    <button type="button" onClick={() => navigate(`/events/${id}`)} className="btn-style">취소</button>
                    <button type="submit" className="btn-style">저장</button>
                </div>
            </form>
        </div>
    );
}

export default EventEdit;