// InquiryWrite.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './InquiryWrite.css'; // CSS 파일 import

function InquiryWrite() {
    const [content, setContent] = useState('');
    const [password, setPassword] = useState(''); // ✅ 비밀번호 상태 추가
    const [userid, setUserId] = useState(''); // 사용자 ID 상태 추가

    const navigate = useNavigate();
    const location = useLocation();
    const [category, setCategory] = useState('INQUIRY');

    useEffect(() => {
        const categoryParam = new URLSearchParams(location.search).get('category');
        if (categoryParam) {
            setCategory(categoryParam);
        }
         // 컴포넌트 마운트 시 사용자 ID 가져오기
        const loggedInUserId = sessionStorage.getItem('loginId') || 'admin1234';//id가져오기
        setUserId(loggedInUserId); // 사용자 ID 상태 업데이트

    }, [location]);

    const handleContentChange = (e) => setContent(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value); // ✅ 비밀번호 입력 핸들러

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!content.trim()) {
            alert('문의 내용을 입력하세요.');
            return;
        }
        if (!password.trim()) { // ✅ 비밀번호 입력 검증 추가
            alert('비밀번호를 입력하세요.');
            return;
        }

        const formData = new FormData();
        formData.append('event_title', "1:1 문의"); // 제목은 고정
        formData.append('event_content', content);
        formData.append('user_id', userid); // 사용자 ID
        formData.append('password', password); // ✅ 비밀번호 FormData 에 추가
        formData.append('category', category);

        fetch('http://localhost:9977/board/eventWriteOk', { // 백엔드 URL 확인
            method: 'POST',
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            console.log('Success:', data);
            alert('문의가 등록되었습니다.');
            navigate(`/boardPage?category=${category}`); // 문의 목록 페이지로 이동
        })
        .catch(error => {
            console.error('Error:', error);
            alert('문의 등록에 실패했습니다.');
        });
    };

    return (
        <div className="InquiryWrite_inquiry-write-container">
            <h1>1:1 문의 작성</h1>
            <form onSubmit={handleSubmit} >
                <table className="InquiryWrite_inquiry-write-table">
                    <tbody>
                        <tr>
                            <th>작성자</th>
                            <td>
                                <input type="text" value={userid}  readOnly className="InquiryWrite_inquiry-write-input" />
                            </td>
                        </tr>
                        <tr>
                            <th>문의 내용</th>
                            <td>
                                <textarea
                                    value={content}
                                    onChange={handleContentChange}
                                    className="InquiryWrite_inquiry-write-textarea"
                                    placeholder="문의 내용을 입력하세요..."
                                    rows={10}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>비밀번호</th> {/* ✅ 비밀번호 입력 필드 추가 */}
                            <td>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    className="InquiryWrite_inquiry-write-input"
                                    placeholder="비밀번호를 입력하세요"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="InquiryWrite_button-container">
                     <button type="button" onClick={() => navigate(`/boardPage?category=${category}`)} className="InquiryWrite_btn-style">목록</button>
                    <button type="submit" className='InquiryWrite_btn-style'>등록</button>
                </div>
            </form>
        </div>
    );
}

export default InquiryWrite;