"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "./EventView.css"
import { queryClient } from './EventPage'; // ✅ EventPage 컴포넌트에서 queryClient import

function EventView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // 기존 API 엔드포인트 사용
        const response = await fetch(`http://localhost:9977/board/view/${id}`)
        if (!response.ok) {
          throw new Error("이벤트를 불러오는데 실패했습니다.")
        }
        const data = await response.json()
        console.log("받아온 이벤트 데이터:", data)
        setEvent(data)
        console.log(data);
      } catch (error) {
        console.error("이벤트 로딩 중 오류 발생:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [id])

  // 이벤트 날짜 포맷팅 함수 (기존과 동일)
  const formatDate = (dateString) => {
    if (!dateString) return "날짜 미정"
    const date = new Date(dateString)
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="error-container">
        <h2>{error || "이벤트를 찾을 수 없습니다."}</h2>
        <button onClick={() => navigate("/boardpage?category=EVENT")} className="back-button">
          목록으로 돌아가기
        </button>
      </div>
    )
  }

  return (
    <div className="event-view-container">
      <div className="event-header">
        <h1>{event.subject}</h1>
        <div className="event-meta">
          <div className="event-author">
            <div className="author-avatar">{event.user?.username?.charAt(0) || "?"}</div>
            <span>{event.user?.username || "최고관리자"}</span>
          </div>
          <div className="event-info">
            <span>조회수: {event.hit}</span>
            <span className="divider">|</span>
            <span>{formatDate(event.createDate)}</span>
          </div>
        </div>
      </div>

      {/* 이벤트 기간 표시 (기존과 동일) */}
      <div className="event-period">
        <h3>이벤트 기간</h3>
        <div className="period-dates">
          <span>시작: {formatDate(event.startDate)}</span>
          <span className="divider">~</span>
          <span>종료: {formatDate(event.endDate)}</span>
        </div>
      </div>

      {/* 썸네일 이미지 표시 (더 이상 필요 없으므로 제거) */}

      <div className="event-content">
        <div className="content-text">
          {/* 게시글 내용 표시 (기존과 동일) */}
          <p>{event.content}</p>

          {/* 첨부 파일 이미지들을 내용에 삽입 (썸네일 제외 - index 1부터 시작) */}
          {event.files && event.files.length > 1 && // files 배열 길이가 1보다 클 때만 렌더링 (썸네일 제외)
            event.files.slice(1).map((file, index) => ( // slice(1)로 첫 번째 요소(썸네일) 제외
              <div key={file.id || index} className="content-image-container" style={{ textAlign: 'center', margin: '20px 0' }}> {/* 이미지 중앙 정렬 및 margin */}
                <img
                  src={`http://localhost:9977${file.fileUrl}`}
                  alt={`첨부파일 ${index + 1}`}
                  style={{ maxWidth: '80%', maxHeight: '500px', display: 'block', margin: '0 auto' }} // 이미지 스타일 조정: 최대 너비, 최대 높이, 중앙 정렬
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "/placeholder-simple.svg"
                  }}
                />
                {/* <p className="file-name" style={{ fontSize: '0.9em', color: '#777', marginTop: '5px' }}>{file.originalFileName || `파일 ${index + 1}`}</p> */}
              </div>
            ))}
        </div>
      </div>

      {/* 첨부 파일 표시 섹션 제거 */}

      <div className="event-actions">
      <button
          onClick={() => {
            queryClient.invalidateQueries(['eventList']); // ✅ 목록 페이지 데이터 새로 불러오기
            navigate("/boardpage?category=EVENT");
          }}
          className="btn-list"
        >
          목록
        </button>
        {sessionStorage.getItem("loginId") === event.user?.userid && (
          <div className="author-actions">
            <button onClick={() => navigate(`/events/edit/${id}`)} className="btn-edit"> {/* 수정 버튼 클릭 시 EventEdit 페이지로 이동 */}

              수정
            </button>
            <button
              onClick={async () => {
                if (window.confirm("정말로 삭제하시겠습니까?")) {
                  try {
                    const response = await fetch(`http://localhost:9977/board/delete/${id}`, {
                      method: "DELETE",
                    })

                    if (!response.ok) {
                      throw new Error("삭제에 실패했습니다.")
                    }

                    alert("삭제되었습니다.")
                    queryClient.invalidateQueries({ queryKey: ['eventList'] }); // ✅ 삭제 후 캐시 무효화
                    navigate("/boardpage?category=EVENT")
                  } catch (error) {
                    console.error("삭제 중 오류 발생:", error)
                    alert("삭제 중 오류가 발생했습니다.")
                  }
                }
              }}
              className="btn-delete"
            >
              삭제
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventView