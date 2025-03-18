import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const NoticeEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (id) {
            fetchEventData();
        }
    }, [id]);

    const fetchEventData = async () => {
        try {
            const response = await axios.get(`http://localhost:9977/board/view/edit/${id}`);
            const eventData = response.data;
            setTitle(eventData.subject || '');
            setContent(eventData.content || '');
        } catch (error) {
            console.error('데이터 불러오기 실패:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }

        if (!content.trim()) {
            alert('내용을 입력해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('event_title', title);
        formData.append('event_content', content);
        formData.append('category', 'NOTICE');
        formData.append('user_id', 'admin1234');

        if (id) {
            formData.append('event_id', id);
        }

        try {
            const response = await axios.post('http://localhost:9977/board/eventWriteOk', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            
            alert('저장되었습니다.');
            navigate('/notice/view/'+id);
        } catch (error) {
            console.error('저장 실패:', error);
            alert('저장 실패: ' + (error.response?.data || error.message));
        }
    };

    return (
        <div className="container mt-5">
            <h2>{id ? '공지사항 수정' : '공지사항 작성'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">제목</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">내용</label>
                    <textarea
                        className="form-control"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows="10"
                        required
                        style={{ resize: 'vertical' }}
                    />
                </div>

                <div className="mb-3">
                    <button type="submit" className="btn btn-primary">
                        {id ? '수정하기' : '등록하기'}
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary ms-2"
                        onClick={() => navigate('/notice/page')}
                    >
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NoticeEdit;