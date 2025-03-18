import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function NoticeView() {
    const { id } = useParams(); // URL 파라미터에서 글 번호 (id) 가져오기
    const [notice, setNotice] = useState(null);
    const [canEdit, setCanEdit] = useState(false); // 수정 권한 체크 상태
    const navigate = useNavigate();

    useEffect(() => {
        // 서버에서 공지사항 내용 가져오기
        axios.get(`http://localhost:9977/board/view/${id}`)
            .then(response => {
                const fetchedNotice = response.data;
                setNotice(fetchedNotice);

                // 로그인한 사용자의 ID와 비밀번호를 확인하여 수정 가능 여부를 설정
                const loggedInUserId = sessionStorage.getItem('loginId'); // 로그인한 사용자 ID
                const loggedInPassword = sessionStorage.getItem('loginPassword'); // 로그인한 사용자 비밀번호
                
                // 조건에 맞으면 수정 가능
                if (loggedInUserId === 'admin1234' || loggedInPassword === '!!1234qwer') {
                    setCanEdit(true);  // 수정 가능
                }
            })
            .catch(error => {
                if (error.response) {
                    // 서버에서 응답이 있었지만 오류가 발생한 경우
                    console.error('서버 오류:', error.response.data);
                } else if (error.request) {
                    // 서버로 요청이 갔지만 응답이 없었을 경우
                    console.error('응답이 없습니다:', error.request);
                } else {
                    // 요청을 설정하는 중에 오류가 발생한 경우
                    console.error('Error:', error.message);
                }
            });
    }, [id]);

    // 날짜 포맷팅 함수
    function formatDateTime(dateTimeString) {
        if (!dateTimeString) {
            return '';
        }
        const date = new Date(dateTimeString);
        if (isNaN(date)) {
            return ''; // 유효하지 않은 날짜
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    if (!notice) {
        return <div>Loading Notice Content...</div>;
    }

    return (
        <div className="notice-view-container">
            <h1>공지사항 내용</h1>

            {/* 공지사항 내용 표시 */}
            <table className='notice-view-table'>
                <tbody>
                    <tr>
                        <th>제목</th>
                        <td>{notice.subject}</td>
                    </tr>
                    <tr>
                        <th>작성자</th>
                        <td>{notice.user ? notice.user.userid : '알 수 없음'}</td>
                    </tr>
                    <tr>
                        <th>등록일</th>
                        <td>{formatDateTime(notice.createDate)}</td>
                    </tr>
                    <tr>
                        <th>내용</th>
                        <td>{notice.content}</td>
                    </tr>
                </tbody>
            </table>

            <div className="button-container">
                <button type="button" onClick={() => navigate(`/boardPage?category=NOTICE`)} className="btn-style">목록</button>

                {/* 수정 권한이 있을 때만 수정 버튼 표시 */}
                {canEdit && (
                    <button type="button" onClick={() => navigate(`/notice/Edit/${id}`)} className="btn-style">수정</button>
                )}
            </div>
        </div>
    );
}

export default NoticeView;
