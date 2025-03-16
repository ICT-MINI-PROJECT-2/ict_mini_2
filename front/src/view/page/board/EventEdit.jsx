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
    const [contentImages, setContentImages] = useState([]); // contentImages 로 변경
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const [category, setCategory] = useState('EVENT');
    const [isNewThumbnailUploaded, setIsNewThumbnailUploaded] = useState(false);
    const [initialFiles, setInitialFiles] = useState([]);

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
                setInitialFiles(eventData.files || []);

                // contentImages 초기화 (썸네일 제외)
                if (eventData.files && eventData.files.length > 1) { // 썸네일 제외하고 contentImages 에 넣기
                    setContentImages(eventData.files.slice(1)); // 썸네일 제외
                }


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
    };
    const handleContentImagesChange = (e) => setContentImages(Array.from(e.target.files)); // contentImages 변경


    const getSearchKey = useCallback(() => {
        const category = new URLSearchParams(location.search).get("category") || "EVENT";
        return [`eventList`, category, 1, "제목내용", "", false];
    }, [location.search]);


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
            formData.append('mf', thumbnail); // 썸네일은 'mf' 로 전송
        } else if (!isNewThumbnailUploaded && initialFiles.length > 0) {
            // 썸네일 변경 없으면 기존 썸네일 유지 (백엔드에서 처리)
        }


        // contentImages (썸네일 제외 content 이미지) formData 에 추가
        for (let i = 0; i < contentImages.length; i++) {
            formData.append('files', contentImages[i]); // content 이미지는 'files' 로 전송 (복수)
        }


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
            navigate(`/view/${id}`);
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
                            <th>썸네일 업로드</th>
                            <td><input type="file" name="mf" onChange={handleThumbnailChange} className="custom-input" /></td>
                        </tr>
                        <tr>
                            <th>내용 이미지 업로드</th>
                            <td><input type="file" name="files" multiple onChange={handleContentImagesChange} className="custom-input" /></td> {/* multiple 속성 유지 */}
                        </tr>
                    </tbody>
                </table>
                <div style={{ textAlign: 'right', marginTop: '10px' }}>
                    <button type="button" onClick={() => navigate(`/view/${id}`)} className="btn-style">취소</button>
                    <button type="submit" className="btn-style">저장</button>
                </div>
            </form>
        </div>
    );
}

export default EventEdit;