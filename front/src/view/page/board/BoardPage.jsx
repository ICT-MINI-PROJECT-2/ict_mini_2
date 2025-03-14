"use client"

import { useEffect, useState, Suspense } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import InquiryList from "./../board/InquiryList"
import EventList from "./EventPage"
import "./EventPage.css"

// 로딩 컴포넌트
const LoadingFallback = () => (
  <div
    style={{
      textAlign: "center",
      padding: "50px 0",
      minHeight: "600px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div>
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "4px solid #f3f3f3",
          borderTop: "4px solid #3498db",
          borderRadius: "50%",
          margin: "0 auto 20px",
          animation: "spin 1s linear infinite",
        }}
      ></div>
      <p>로딩 중...</p>
    </div>
  </div>
)

function BoardPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const queryParams = new URLSearchParams(location.search)
  const activeCategory = queryParams.get("category") || "INQUIRY"

  // 해시 라우팅(#) 문제 해결을 위한 useEffect
  useEffect(() => {
    // URL에 해시(#)가 있는지 확인
    if (location.hash && location.hash.includes("#/boardpage")) {
      // 해시를 제거하고 올바른 경로로 리다이렉트
      const newPath = location.hash.replace("#", "")
      navigate(newPath)
    }

    // 페이지 로딩 상태 관리
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300) // 짧은 지연 시간 설정

    return () => clearTimeout(timer)
  }, [location, navigate])

  // 카테고리 컴포넌트 선택
  const renderCategoryComponent = () => {
    switch (activeCategory) {
      case "EVENT":
        return <EventList />
      case "INQUIRY":
        return <InquiryList />
      case "NOTICE":
        return <div>공지사항 목록이 표시됩니다.</div>
      case "FAQ":
        return <div>FAQ 목록이 표시됩니다.</div>
      default:
        return <div>카테고리를 선택해주세요.</div>
    }
  }

  return (
    <div className="container" style={{ width: "80%", paddingTop: "5%", margin: "0 auto", position: "relative" }}>
      <div className="row" style={{ marginBottom: "20px", display: "flex", justifyContent: "center" }}>
        {["EVENT", "INQUIRY", "NOTICE", "FAQ"].map((category) => (
          <div
            key={category}
            className={`p-2 ${activeCategory === category ? "active" : ""}`}
            style={{ margin: "0 10px", cursor: "pointer" }}
          >
            <Link
              to={`/boardpage?category=${category}`}
              style={{
                textDecoration: "none",
                color: activeCategory === category ? "black" : "#ccc",
                fontWeight: activeCategory === category ? "bold" : "normal",
              }}
            >
              {category}
            </Link>
          </div>
        ))}
      </div>

      {/* Suspense와 로딩 상태를 사용하여 컴포넌트 렌더링 */}
      <Suspense fallback={<LoadingFallback />}>{isLoading ? <LoadingFallback /> : renderCategoryComponent()}</Suspense>
    </div>
  )
}

export default BoardPage

