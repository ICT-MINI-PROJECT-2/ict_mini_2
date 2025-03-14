"use client"

import React, { useState, memo, useCallback } from "react"
import { Link, useLocation } from "react-router-dom"
import axios from "axios"
import { QueryClient, QueryClientProvider, useQuery, keepPreviousData } from '@tanstack/react-query'

// QueryClient 인스턴스를 EventList 컴포넌트 밖에서 생성
const queryClient = new QueryClient();

// 이벤트 카드 컴포넌트 (memoized) - calculateRemainingTime prop 제거, onError 단순화, placeholder URL 단순화
const MemoizedRenderEventCard = memo(function RenderEventCard({ event }) {
  const hasThumbnail = event.files && event.files.length > 0
  let thumbnailUrl = "/placeholder-simple.svg"; // 단순 placeholder URL 사용

  if (hasThumbnail && event.files[0]) {
    thumbnailUrl = `http://localhost:9977${event.files[0].fileUrl}`
  }

  return (
    <div className="event-card" style={{ marginBottom: "20px" }}>
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background: "#e74c3c",
            color: "white",
            padding: "2px 8px",
            borderRadius: "4px",
            fontSize: "12px",
          }}
        >
          EVENT
        </div>
        <img
          src={thumbnailUrl || "/placeholder-simple.svg"} // 단순 placeholder URL 사용
          alt={event.subject}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "4px",
          }}
          onError={(e) => {
            if (e.target.src !== window.location.origin + "/placeholder-simple.svg") {
              console.log("Image load failed, using placeholder:", e.target.src);
              e.target.src = "/placeholder-simple.svg";
            }
          }}
          loading="lazy"
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            textAlign: "center",
            width: "100%",
            textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
          }}
        >
          <h3 style={{ fontSize: "28px", fontWeight: "bold", margin: "0 0 5px 0" }}>BIG SALE</h3>
          <p style={{ fontSize: "14px", margin: "0" }}>
            {event.createDate ? new Date(event.createDate).toLocaleDateString() : "날짜 미정"} -
            {event.modifiedDate ? new Date(event.modifiedDate).toLocaleDateString() : "날짜 미정"}
          </p>
        </div>
      </div>
      <div style={{ padding: "10px 0" }}>
        <Link to={`/events/${event.id}`} style={{ textDecoration: "none", color: "inherit" }}>
          <h4 style={{ margin: "0 0 5px 0", fontSize: "16px", fontWeight: "bold" }}>{event.subject}</h4>
        </Link>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
          <div
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              backgroundColor: "#3498db",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              marginRight: "5px",
              fontSize: "12px",
            }}
          >
            {event.user?.username?.charAt(0) || "?"}
          </div>
          <span style={{ fontSize: "14px" }}>{event.user?.username || "최고관리자"}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#666" }}>
          <div>
            <span>조회: </span>
            <span style={{ color: "#e74c3c", fontWeight: "bold" }}>{event.hit}</span>
          </div>
          {/* 삭제: 남은기간 관련 div */}
          {/* <div>
            <span>남은기간: </span>
            <span>{calculateRemainingTime(event.modifiedDate)}</span>
          </div> */}
        </div>
        <div style={{ fontSize: "12px", color: "#999", textAlign: "left", marginTop: "5px" }}>
          {event.createDate ? new Date(event.createDate).toLocaleDateString() : "날짜 미정"}
        </div>
        <div style={{ textAlign: "right", fontSize: "12px", color: "#999" }}>
          <span>👁️ {event.hit}</span>
        </div>
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  return prevProps.event === nextProps.event;
});
MemoizedRenderEventCard.displayName = "MemoizedRenderEventCard"

const EventList = memo(function EventList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState("제목내용")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showOnlyWithImages, setShowOnlyWithImages] = useState(false)
  const location = useLocation()

  // 검색 파라미터 변경 감지를 위한 키 생성 (유지)
  const getSearchKey = useCallback(() => {
    const category = new URLSearchParams(location.search).get("category") || "EVENT"
    return [`eventList`, category, currentPage, searchType, searchTerm, showOnlyWithImages]
  }, [location.search, currentPage, searchType, searchTerm, showOnlyWithImages])

  const { data, fetchStatus } = useQuery({
    queryKey: getSearchKey(),
    queryFn: ({ queryKey }) => {
      const [_, category, page, searchType, searchTerm, withImages] = queryKey;
      return axios
        .get("http://localhost:9977/board/boardPage", {
          params: {
            category,
            page: page - 1,
            size: 6,
            searchType,
            searchTerm,
            withImages,
          },
        })
        .then((res) => res.data);
    },
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const events = data?.list || []
  const loading = fetchStatus === "fetching"


  const handleSearch = useCallback(
    (e) => {
      e.preventDefault()
      setCurrentPage(1)
    },
    [],
  )

  // 이벤트 목록 렌더링 최적화 (useCallback 유지, calculateRemainingTime 제거)
  const renderEventList = useCallback(() => {
    if (loading) {
      return <div style={{ textAlign: "center", padding: "50px 0" }}>로딩 중...</div>
    }
    if (!events || events.length === 0) {
      return (
        <div style={{ gridColumn: "span 3", textAlign: "center", padding: "50px 0" }}>이벤트가 없습니다.</div>
      )
    }
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "30px" }}>
        {events.map((event) => (
          // 수정: calculateRemainingTime prop 제거
          <MemoizedRenderEventCard key={event.id} event={event} /* 삭제: calculateRemainingTime={calculateRemainingTime} */ />
        ))}
      </div>
    )
  }, [loading, events /* 삭제: , calculateRemainingTime */]) // 의존성 배열에서 calculateRemainingTime 제거

  // 페이지네이션 렌더링 최적화 (유지)
  const renderPagination = useCallback(() => {
    if (totalPages <= 1) return null
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", marginBottom: "20px" }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            style={{ /* ... */ }}
          >
            {page}
          </button>
        ))}
      </div>
    )
  }, [totalPages, currentPage])

  return (
    <div className="event-list-container">
      {/* 검색 및 필터 영역 (유지) */}
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex" }}>
          <select value={searchType} onChange={(e) => setSearchType(e.target.value)} style={{ /* ... */ }}>
            <option value="제목내용">제목+내용</option>
            <option value="제목만">제목만</option>
            <option value="작성자">작성자</option>
          </select>
          <form onSubmit={handleSearch} style={{ display: "flex" }}>
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="검색어를 입력하세요" style={{ /* ... */ }} />
            <button type="submit" style={{ /* ... */ }}>
              <span role="img" aria-label="search">🔍</span>
            </button>
          </form>
        </div>
        <div>
          <label style={{ display: "flex", alignItems: "center", fontSize: "14px" }}>
            <input type="checkbox" checked={showOnlyWithImages} onChange={(e) => setShowOnlyWithImages(e.target.checked)} style={{ marginRight: "5px" }} />
            첨부 파일이 있는 게시물만 검색하기
          </label>
        </div>
      </div>

      {/* 이벤트 그리드 - 메모이제이션된 함수 사용 (유지) */}
      {renderEventList()}

      {/* 페이지네이션 - 메모이제이션된 함수 사용 (유지) */}
      {renderPagination()}

      {/* 글쓰기 버튼 (유지) */}
      <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex" }}></div>
        <Link to="/events/write" style={{ /* ... */ }}>글쓰기</Link>
      </div>
    </div>
  )
})
EventList.displayName = "EventList"

const EventPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <EventList />
    </QueryClientProvider>
  );
};

export default EventPage;