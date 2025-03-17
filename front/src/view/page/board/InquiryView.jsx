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
    const [isAuthor, setIsAuthor] = useState(false); // 작성자 여부
    const navigate = useNavigate();

    useEffect(() => {
        // 컴포넌트가 처음 로드될 때, 비밀번호 확인 상태를 false 로 초기화 (비밀번호 입력 폼 표시)
        setIsPasswordCorrect(false);
        setInquiry(null); // inquiry 데이터 초기화
        setIsAuthor(false); // 작성자 여부 초기화
    }, [id]);

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        setError(''); // 에러 메시지 초기화
    
        axios.get(`http://localhost:9977/board/inquiryView/${id}?password=${password}`)
            .then(response => {
                const inquiryData = response.data;
    
                // 관리자 또는 작성자 확인 (핵심 로직)
                if (sessionStorage.getItem('loginId') === 'admin1234' ||
                    (inquiryData.user && sessionStorage.getItem("loginId") === inquiryData.user.userid)) {
    
                    setInquiry(inquiryData);
                    setIsPasswordCorrect(true);
                    setError('');
    
                    // 작성자 여부 설정 (삭제 버튼 표시를 위해)
                    if (inquiryData.user && sessionStorage.getItem("loginId") === inquiryData.user.userid) {
                        setIsAuthor(true);
                    }
                } else {
                    // 관리자나 작성자가 아닌 경우
                    setIsPasswordCorrect(false);
                    setInquiry(null);
                    setError('해당 사용자가 아닙니다.'); // 에러 메시지 설정
                }
            })
            .catch(error => {
                console.error('Error verifying password:', error);
                setIsPasswordCorrect(false);
                setInquiry(null);
                if (error.response && error.response.status === 401) {
                    setError('비밀번호가 일치하지 않습니다.');
                } else {
                    setError('문의 내용을 불러오는 데 실패했습니다.');
                }
            });
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
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
        // 답변 등록 로직 (백엔드와 연동) - 기존 코드 유지
        axios.post(`http://localhost:9977/board/addReply/${id}`, { reply: reply, userId: sessionStorage.getItem("loginId") })
            .then(response => {
                alert('답변이 등록되었습니다.');
                window.location.reload();
            })
            .catch(error => {
                console.error('Error adding reply:', error);
                alert('답변 등록에 실패했습니다.');
            });
    };

    // 날짜 포맷팅 함수 (기존 코드 유지)
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


    // 삭제 핸들러
    const handleDelete = () => {
        if (window.confirm("정말로 삭제하시겠습니까?")) {
            axios.delete(`http://localhost:9977/board/delete/${id}`) // 백엔드 API 호출
                .then(response => {
                    alert('문의글이 삭제되었습니다.');
                    navigate('/boardPage?category=INQUIRY'); // 목록 페이지로 이동
                })
                .catch(error => {
                    console.error('Error deleting inquiry:', error);
                    alert('문의글 삭제에 실패했습니다.');
                });
        }
    };


    if (!inquiry && isPasswordCorrect) { // 데이터 로딩 중 (비밀번호 확인 후)
        return <div>Loading Inquiry Content...</div>;
    }

    return (
        <div className="inquiry-view-container">
            <h1>1:1 문의 내용</h1>

            {!isPasswordCorrect && ( // 비밀번호 입력 폼 (비밀번호 확인 안 된 경우)
                <form onSubmit={handlePasswordSubmit} className="password-form">
                    <label htmlFor="password">비밀번호:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                        className="password-input"
                        placeholder="비밀번호를 입력하세요" // placeholder 추가
                    />
                    <button type="submit" className='btn-style'>확인</button>
                    {error && <p className="error-message">{error}</p>}
                </form>
            )}

            {isPasswordCorrect && inquiry && ( // 비밀번호가 맞고, 문의 내용이 로딩되었으면 내용 표시
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

                    {/* 관리자 답변 폼 (기존 코드 유지) */}
                    {sessionStorage.getItem('loginId') === 'admin1234' && (
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
                    )}
                </>
            )}

            <div className="button-container">
                <button type="button" onClick={() => navigate(`/boardPage?category=INQUIRY`)} className="btn-style">목록</button>
                {(isAuthor || sessionStorage.getItem('loginId') === 'admin1234') && (
                    <button type="button" onClick={handleDelete} className="btn-style delete-button">삭제</button>
                )}
            </div>
        </div>
    );
}

export default InquiryView;