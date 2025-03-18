import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './NoticeWrite.css';

function NoticeWrite() {
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [user_id, setUser_id] = useState('');
    const [category, setCategory] = useState('NOTICE');

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const categoryParam = new URLSearchParams(location.search).get('category');
        if (categoryParam) {
            setCategory(categoryParam);
        }
        const loggedInUserId = sessionStorage.getItem('loginId') || 'admin1234';
        setUser_id(loggedInUserId);
    }, [location]);

    const handleSubjectChange = (e) => setSubject(e.target.value);
    const handleContentChange = (e) => setContent(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!subject.trim()) {
            alert('제목을 입력하세요.');
            return;
        }
        if (!content.trim()) {
            alert('내용을 입력하세요.');
            return;
        }

        const formData = new FormData();
        formData.append('event_title', subject);
        formData.append('event_content', content);
        formData.append('user_id', user_id);
        formData.append('category', 'NOTICE');

        try {
            const response = await axios.post('http://localhost:9977/board/eventWriteOk', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            
            console.log('성공:', response.data);
            alert('공지사항이 등록되었습니다.');
            navigate('/notice/page');
        } catch (error) {
            console.error('에러:', error);
            alert('공지사항 등록에 실패했습니다: ' + (error.response?.data || error.message));
        }
    };

    return (
        <div className="notice-write-container">
            <h1>공지사항 작성</h1>
            <form onSubmit={handleSubmit}>
                <table className="notice-write-table">
                    <tbody>
                        <tr>
                            <th>작성자</th>
                            <td>
                                <input type="text" value={user_id} readOnly className="notice-write-input" />
                            </td>
                        </tr>
                        <tr>
                            <th>제목</th>
                            <td>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={handleSubjectChange}
                                    className="notice-write-input"
                                    placeholder="공지사항 제목을 입력하세요"
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>내용</th>
                            <td>
                                <textarea
                                    value={content}
                                    onChange={handleContentChange}
                                    className="notice-write-textarea"
                                    placeholder="공지사항 내용을 입력하세요"
                                    rows={10}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="button-container">
                    <button type="button" onClick={() => navigate('/notice/page')} className="btn-style">목록</button>
                    <button type="submit" className="btn-style">등록</button>
                </div>
            </form>
        </div>
    );
}

export default NoticeWrite;