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
    const [initialFiles, setInitialFiles] = useState([]);
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [contentImageUrls, setContentImageUrls] = useState([]);
    const [newContentImageNames, setNewContentImageNames] = useState([]);
    const [deletedFileIds, setDeletedFileIds] = useState([]);

    useEffect(() => {
        const categoryParam = new URLSearchParams(location.search).get('category');
        if (categoryParam) { setCategory(categoryParam); }

        const fetchEventData = async () => {
            try {
                const response = await fetch(`http://localhost:9977/board/view/edit/${id}`);
                if (!response.ok) { throw new Error("이벤트 수정 데이터를 불러오는데 실패했습니다."); }

                const eventData = await response.json();
                console.log("Fetched event data:", eventData);

                setTitle(eventData.subject);
                setContent(eventData.content);
                setStartDate(formatDateTimeForInput(eventData.startDate));
                setEndDate(formatDateTimeForInput(eventData.endDate));
                setInitialFiles(eventData.files || []);

                // 첫 번째 파일을 썸네일로 처리
                const thumbnailFile = eventData.files && eventData.files[0];
                if (thumbnailFile) {
                    console.log("Setting thumbnail URL:", thumbnailFile);
                    setThumbnailUrl(`http://localhost:9977${thumbnailFile.fileUrl}`);
                }

                // 나머지 파일들을 내용 이미지로 처리
                if (eventData.files && eventData.files.length > 1) {
                    const contentUrls = eventData.files.slice(1).map(file => `http://localhost:9977${file.fileUrl}`);
                    console.log("Setting content URLs:", contentUrls);
                    setContentImageUrls(contentUrls);
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
        return dateTimeString ? new Date(dateTimeString).toISOString().slice(0, 16) : '';
    };

    const handleTitleChange = (e) => setTitle(e.target.value);
    const handleContentChange = (e) => setContent(e.target.value);
    const handleStartDateChange = (e) => setStartDate(e.target.value);
    const handleEndDateChange = (e) => setEndDate(e.target.value);

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log("New thumbnail selected:", file);
            setThumbnail(file);
            setThumbnailUrl(URL.createObjectURL(file));

            // 기존 썸네일이 있으면 삭제 목록에 추가
            if (initialFiles.length > 0) {
                const oldThumbnailId = initialFiles[0].id;
                console.log("Adding old thumbnail to delete list:", oldThumbnailId);
                setDeletedFileIds(prev => [...prev, oldThumbnailId]);
            }
        }
    };

    const handleContentImagesChange = (e) => {
        const files = Array.from(e.target.files);
        console.log("New content images selected:", files);
        setContentImages(files);
    
        // 미리보기 URL 생성
        const urls = files.map(file => URL.createObjectURL(file));
        setContentImageUrls(urls);
        
        // 새 파일 이름 설정 (files 배열에서 직접 가져옴)
        setNewContentImageNames(files.map(file => file.name));
    
        // 기존 내용 이미지들 삭제 목록에 추가
        if (initialFiles.length > 1) {
            const contentFileIds = initialFiles.slice(1).map(file => file.id);
            console.log("Adding content files to delete list:", contentFileIds);
            setDeletedFileIds(prev => [...prev, ...contentFileIds]);
        }
    };

    const handleDeleteFile = async (fileId, fileType, fileIndex = -1) => {
        if (!window.confirm("파일을 삭제하시겠습니까?")) return;

        try {
            if (fileId) {
                console.log("Deleting existing file:", fileId, fileType);
                const response = await fetch(`http://localhost:9977/board/file/delete/${fileId}`, {
                    method: 'DELETE'
                });

                if (!response.ok) throw new Error('파일 삭제에 실패했습니다.');

                setInitialFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
                setDeletedFileIds(prev => [...prev, fileId]);

                if (fileType === 'thumbnail') {
                    setThumbnailUrl('');
                    setThumbnail(null);
                }
            } else if (fileType === 'content' && fileIndex >= 0) {
                console.log("Removing new content image:", fileIndex);
                setContentImages(prev => prev.filter((_, i) => i !== fileIndex));
                setContentImageUrls(prev => prev.filter((_, i) => i !== fileIndex));
                setNewContentImageNames(prev => prev.filter((_, i) => i !== fileIndex));
            }

            alert('파일이 삭제되었습니다.');
        } catch (error) {
            console.error('파일 삭제 오류:', error);
            alert('파일 삭제 중 오류가 발생했습니다.');
        }
    };

    const getSearchKey = useCallback(() => {
        const category = new URLSearchParams(location.search).get("category") || "EVENT";
        return [`eventList`, category, 1, "제목내용", "", false];
    }, [location.search]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) { alert('제목을 입력하세요.'); return; }
        if (!content.trim()) { alert('내용을 입력하세요.'); return; }
        if (new Date(startDate) > new Date(endDate)) { alert('종료 날짜는 시작 날짜 이후여야 합니다.'); return; }

        const formData = new FormData();
        formData.append('event_id', id);
        formData.append('event_title', title);
        formData.append('event_content', content);
        formData.append('event_startdate', startDate);
        formData.append('event_enddate', endDate);
        formData.append('category', category);
        formData.append('user_id', sessionStorage.getItem('loginId') || 'admin1234');

        if (thumbnail) {
            console.log("Adding new thumbnail to form data");
            formData.append('mf', thumbnail);
        }

        contentImages.forEach((file, index) => {
            console.log(`Adding content image ${index} to form data:`, file.name);
            formData.append('files', file);
        });

        deletedFileIds.forEach(fileId => {
            console.log("Adding deleted file ID to form data:", fileId);
            formData.append('deletedFileIds', fileId);
        });

        try {
            const response = await fetch('http://localhost:9977/board/eventWriteOk', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('이벤트 수정에 실패했습니다.');

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
                                {thumbnailUrl ? (
                                    <div>
                                        <span>{thumbnail ? thumbnail.name : (initialFiles[0]?.originalFileName || "")}</span>
                                        <button type="button" className="btn-delete-file" onClick={() => handleDeleteFile(initialFiles[0]?.id, 'thumbnail')}>삭제</button>
                                        <img src={thumbnailUrl} alt="썸네일 미리보기" style={{ maxWidth: '100px', marginTop: '5px' }} />
                                    </div>
                                ) : (
                                    <div>등록된 썸네일 이미지 없음</div>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <th>썸네일 업로드</th>
                            <td><input type="file" name="mf" onChange={handleThumbnailChange} className="custom-input" /></td>
                        </tr>
                        <tr>
                            <th>현재 내용 이미지</th>
                            <td>
                                {contentImageUrls.map((url, index) => {
                                    // 파일 이름 결정 로직 수정
                                    let fileName;
                                    if (index < initialFiles.length - 1) {
                                        // 기존 파일인 경우
                                        fileName = initialFiles[index + 1]?.originalFileName;
                                    } else {
                                        // 새로 추가된 파일인 경우
                                        const newFileIndex = index - (initialFiles.length - 1);
                                        fileName = contentImages[newFileIndex]?.name || newContentImageNames[newFileIndex];
                                    }

                                    return (
                                        <div key={index}>
                                            <span>{fileName}</span>
                                            <button 
                                                type="button" 
                                                className="btn-delete-file" 
                                                onClick={() => handleDeleteFile(
                                                    index < initialFiles.length - 1 ? initialFiles[index + 1]?.id : null,
                                                    'content',
                                                    index
                                                )}
                                            >삭제</button>
                                            <img 
                                                src={url} 
                                                alt={`내용 이미지 ${index + 1}`} 
                                                style={{ maxWidth: '100px', marginTop: '5px' }} 
                                            />
                                        </div>
                                    );
                                })}
                            </td>
                        </tr>
                        <tr>
                            <th>내용 이미지 업로드</th>
                            <td><input type="file" name="files" onChange={handleContentImagesChange} className="custom-input" multiple /></td>
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