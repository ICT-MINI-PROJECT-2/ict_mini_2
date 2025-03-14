// InquiryView.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './InquiryView.css'; // CSS 파일 import

function InquiryView() {
    const { id } = useParams(); // URL 파라미터에서 글 번호 (id) 가져오기
    const [inquiry, setInquiry] = useState(null);
    const [password, setPassword] = useState('');
    const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
    const [error, setError] = useState('');
    const [reply, setReply] = useState(''); // 답변 내용
    const navigate = useNavigate();



    useEffect(() => {
        // 처음 로드될 때는 비밀번호 확인 없이 데이터만 가져옴 (제목, 작성자 등)
        axios.get(`http://localhost:8080/board/boardpage/${id}`) // 백엔드 URL 확인
            .then(response => {
                setInquiry(response.data);
                console.log(response.data)
            })
            .catch(error => {
                console.error('Error fetching inquiry:', error);
                setError('문의 내용을 불러오는 데 실패했습니다.');
            });
    }, [id]);

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        // 비밀번호 확인 로직 (백엔드와 연동)
        if (inquiry && password === inquiry.password) { //가져온 데이터의 password와 사용자가 입력한 password 비교
            setIsPasswordCorrect(true);
            setError('');
        } else {
            setIsPasswordCorrect(false);
            setError('비밀번호가 일치하지 않습니다.');
        }
    };

    const handleReplyChange = (e) => {
        setReply(e.target.value);
    };

    const handleReplySubmit = (e) => {  //백엔드 수정 필요 (문의번호(id), 답변자(session), 답변내용(reply))
        e.preventDefault();
        if (!reply.trim()) {
            alert('답변 내용을 입력하세요.');
            return;
        }
        // 답변 등록 로직 (백엔드와 연동)
        axios.post(`http://localhost:8080/board/addReply/${id}`, { reply: reply,  userId: sessionStorage.getItem("loginId") }) // 백엔드 URL, 형식 확인
            .then(response => {
                alert('답변이 등록되었습니다.');
                // 답변 등록 후 필요한 작업 (예: 페이지 새로고침)
                window.location.reload();
            })
            .catch(error => {
                console.error('Error adding reply:', error);
                alert('답변 등록에 실패했습니다.');
            });
    };

     // 날짜 포맷팅 함수 추가 (시작일과 종료일)
     function formatDateTime(dateTimeString) {
        if (!dateTimeString) {
          return '';
        }
        const date = new Date(dateTimeString);
        if (isNaN(date)) {
            return ''; //유효하지 않은 날짜
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    if (!inquiry) {
        return <div>Loading...</div>; // 데이터 로딩 중
    }

    return (
        <div className="inquiry-view-container">
            <h1>1:1 문의 내용</h1>

            {!isPasswordCorrect && ( // 비밀번호 입력 폼
                <form onSubmit={handlePasswordSubmit} className="password-form">
                    <label htmlFor="password">비밀번호:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="password-input"
                    />
                    <button type="submit" className='btn-style'>확인</button>
                    {error && <p className="error-message">{error}</p>}
                </form>
            )}

            {isPasswordCorrect && ( // 비밀번호가 맞으면 내용 표시
                <>
                    <table className='inquiry-view-table'>
                        <tbody>
                            <tr>
                                <th>제목</th>
                                <td>{inquiry.subject}</td>
                            </tr>
                            <tr>
                                <th>작성자</th>
                                <td>{inquiry.user ? inquiry.user.userid : '알 수 없음'}</td>
                            </tr>
                            <tr>
                                <th>등록일</th>
                                <td>{formatDateTime(inquiry.createDate)}</td>
                            </tr>
                            <tr>
                                <th>내용</th>
                                <td>{inquiry.content}</td>
                            </tr>
                        </tbody>

                    </table>

                    {/* 관리자 답변 폼 */
                        sessionStorage.getItem('loginId') === 'admin1234' && (
                            <form onSubmit={handleReplySubmit} className="reply-form">
                                <h2>답변 작성</h2>
                                <textarea
                                    value={reply}
                                    onChange={handleReplyChange}
                                    placeholder="답변 내용을 입력하세요..."
                                    rows={5}
                                    className="reply-textarea"
                                />
                                <button type="submit" className='btn-style'>답변 등록</button>
                            </form>
                        )
                    }
                </>
            )}
             <div className="button-container">
                    <button type="button" onClick={() => navigate(`/boardpage?category=INQUIRY`)} className="btn-style">목록</button>
                </div>
        </div>
    );
}

export default InquiryView;