import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function NoticeWrite() {
    const [subject, setSubject] = useState(''); // 제목을 관리하는 상태
    const [content, setContent] = useState(''); // 내용
    const [user_id, setUser_id] = useState(''); // 사용자 ID
    const [password, setPassword] = useState(''); // 비밀번호
    const [category, setCategory] = useState('NOTICE'); // 기본 카테고리 'NOTICE'

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // 카테고리 파라미터가 있으면 그 값을 설정
        const categoryParam = new URLSearchParams(location.search).get('category');
        if (categoryParam) {
            setCategory(categoryParam);
        }
        // 로그인한 사용자의 아이디를 세션에서 가져옵니다.
        const loggedInUserId = sessionStorage.getItem('loginId') || 'admin1234'; // 관리자 기본 ID 설정
        setUser_id(loggedInUserId); // 사용자 ID 설정
    }, [location]);

    const handleSubjectChange = (e) => setSubject(e.target.value); // 제목 입력 핸들러
    const handleContentChange = (e) => setContent(e.target.value); // 내용 입력 핸들러
    const handlePasswordChange = (e) => setPassword(e.target.value); // 비밀번호 입력 핸들러

    const handleSubmit = (e) => {
        e.preventDefault();

        // 폼 데이터 유효성 검사
        if (!subject.trim()) {
            alert('제목을 입력하세요.');
            return;
        }
        if (!content.trim()) {
            alert('내용을 입력하세요.');
            return;
        }
        if (!password.trim()) {
            alert('비밀번호를 입력하세요.');
            return;
        }

        const formData = new FormData();
        formData.append('subject', subject); // 제목
        formData.append('content', content); // 내용
        formData.append('user_id', user_id); // 사용자 ID
        formData.append('password', password); // 비밀번호
        formData.append('category', category); // 카테고리

        // 공지사항 글 작성 API 요청
        fetch('http://localhost:9977/board/eventWriteOk', {
            method: 'POST',
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('네트워크 응답이 올바르지 않습니다.');
            }
            return response.text();
        })
        .then(data => {
            console.log('성공:', data);
            alert('공지사항이 등록되었습니다.');
            navigate('/boardPage?category=NOTICE'); // 공지사항 목록 페이지로 이동
        })
        .catch(error => {
            console.error('에러:', error);
            alert('공지사항 등록에 실패했습니다.');
        });
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
                                    onChange={handleSubjectChange} // 제목 상태 업데이트
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
                        <tr>
                            <th>비밀번호</th>
                            <td>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={handlePasswordChange} // 비밀번호 상태 업데이트
                                    className="notice-write-input"
                                    placeholder="비밀번호를 입력하세요"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="button-container">
                    <button type="button" onClick={() => navigate('/boardPage?category=NOTICE')} className="btn-style">목록</button>
                    <button type="submit" className="btn-style">등록</button>
                </div>
            </form>
        </div>
    );
}

export default NoticeWrite;
