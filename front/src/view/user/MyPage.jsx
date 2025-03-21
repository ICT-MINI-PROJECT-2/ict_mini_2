"use client"

import "../../css/user/mypage.css"
import Faded from "../../effect/Faded"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Doughnut } from "react-chartjs-2"
import axios from "axios"

function MyPage() {
  const [wishRecord, setWishRecord] = useState([])
  const [wishPageNumber, setWishPageNumber] = useState([])
  const [nowWishPage, setWishNowPage] = useState(1)
  const [totalWishPage, setWishTotalPage] = useState(1)

  const [reviewRecord, setReviewRecord] = useState([])
  const [reviewPageNumber, setReviewPageNumber] = useState([])
  const [nowReviewPage, setNowReviewPage] = useState(1)
  const [totalReviewPage, setTotalReviewPage] = useState(1)

  const [graphRecord, setGraphRecord] = useState([])
  const [chartData, setChartDate] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])

  //페이지,마운트
  const mounted = useRef(false)
  useEffect(() => {
    if (mounted.current) {
    } else {
      mounted.current = true
      getWishList(1)
      graphData()
      getReviewList(1)
      console.log("!  ")
    }
  }, [])

  useEffect(() => {
    const categories = graphRecord.map((item) => item.categoryOne)

    const categoryLabels = [
      "한식",
      "중국식",
      "일식",
      "양식",
      "아시아음식",
      "패스트푸드",
      "주점",
      "뷔페",
      "패밀리레스트랑",
      "기타",
    ]
    const categoryData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    setChartDate(categoryData)
    categories.forEach((category) => {
      if (category === "한식") categoryData[0] += 1
      if (category === "중국식") categoryData[1] += 1
      if (category === "일식") categoryData[2] += 1
      if (category === "양식") categoryData[3] += 1
      if (category === "아시아음식") categoryData[4] += 1
      if (category === "패스트푸드") categoryData[5] += 1
      if (category === "주점") categoryData[6] += 1
      if (category === "뷔페") categoryData[7] += 1
      if (category === "패밀리레스트랑") categoryData[8] += 1
      if (category === "기타") categoryData[9] += 1
    })
  }, [graphRecord])

  //찜목록 wishList
  const [wishvo, setWishvo] = useState([])

  function getWishList(page) {
    const id = sessionStorage.getItem("id")
    const url = `http://localhost:9977/user/getWishList?id=${id}&nowPage=${page}`

    axios
      .post(url)
      .then((res) => {
        //기존 데이터 초기화
        setWishRecord([])
        setWishRecord(res.data.re)
        setWishvo([])
        setWishvo(res.data.we)

        setWishPageNumber([])
        const pwVO = res.data.pwVO

        for (let pw = pwVO.startPageNum; pw < pwVO.startPageNum + pwVO.onePageCount; pw++) {
          if (pw <= pwVO.totalPage) {
            setWishPageNumber((prev) => {
              return [...prev, pw]
            })
          }
        }
        setWishNowPage(pwVO.nowPage)
        setWishTotalPage(pwVO.totalPage)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  function wishDel(id) {
    console.log(id, "삭제버튼클릭")
  }

  //리뷰리스트
  function getReviewList(page) {
    const id = sessionStorage.getItem("id")
    const url = `http://localhost:9977/user/getReviewList?id=${id}&nowPage=${page}`

    axios
      .post(url)
      .then((result) => {
        console.log(result.data)
        //기존 데이터 초기화
        setReviewRecord([])
        setReviewRecord(result.data.review)
        setReviewPageNumber([])
        const prVO = result.data.prVO

        for (let pr = prVO.startPageNum; pr < prVO.startPageNum + prVO.onePageCount; pr++) {
          if (pr <= prVO.totalPage) {
            setReviewPageNumber((prev) => {
              return [...prev, pr]
            })
          }
        }
        setNowReviewPage(prVO.nowPage)
        setTotalReviewPage(prVO.totalPage)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //그래프
  //불러오기
  function graphData() {
    const id = sessionStorage.getItem("id")
    const url = `http://localhost:9977/user/graphData?id=${id}`

    axios
      .get(url)
      .then((response) => {
        setGraphRecord([])
        setGraphRecord(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }  

  ChartJS.register(ArcElement, Tooltip, Legend)
  const data = {
    labels: ["한식", "중국식", "일식", "양식", "아시아음식", "패스트푸드", "주점", "뷔페", "패밀리레스트랑", "기타"],
    datasets: [
      {
        label: "# of Votes",
        data: chartData,
        backgroundColor: [
          "rgba(255, 0, 0, 0.5)", // 진한 빨강
          "rgba(0, 128, 255, 0.5)", // 진한 파랑
          "rgba(255, 255, 0, 0.5)", // 밝은 노랑
          "rgba(0, 200, 0, 0.5)", // 진한 초록
          "rgba(128, 0, 255, 0.5)", // 진한 보라
          "rgba(255, 165, 0, 0.5)", // 진한 주황
          "rgba(192, 0, 0, 0.5)", // 더 진한 빨강
          "rgba(0, 100, 0, 0.5)", // 더 진한 초록
          "rgba(255, 69, 0, 0.5)", // 진한 주황색
          "rgba(80, 80, 80, 0.5)", // 어두운 회색
        ],
        borderColor: [
          "rgba(200, 230, 201, 0.25)",  // 한식
          "rgba(255, 204, 128, 0.25)",  // 패스트푸드
          "rgba(174, 213, 255, 0.25)",  // 일식
          "rgba(255, 183, 77, 0.25)",   // 중식
          "rgba(179, 229, 252, 0.25)",  // 아시아음식
          "rgba(255, 236, 179, 0.25)",  // 양식
          "rgba(255, 204, 188, 0.25)",  // 주점
          "rgba(225, 190, 231, 0.25)",  // 분식
          "rgba(255, 245, 157, 0.25)",  // 뷔페
          "rgba(197, 202, 233, 0.25)"   // 기타
        ],
        borderWidth: 1,
      },
    ],
  }
  const options = {
    plugins: {
      datalabels: {
        anchor: "end", // 레이블 위치 설정
        align: "start", // 레이블 정렬 설정
        formatter: (value, context) => {
          // 레이블 내용 설정
          return value // 데이터 값 표시
        },
      },
    },
  }

  return (
    <Faded>
      <div className="mypage-container">
        <h2 id="graph-title">선호음식</h2>
        <div className="graph-box">
          <Doughnut data={data} options={options} />
        </div>

        <div id="wishlist-box">
          <h2 id="wishlist-title">찜목록</h2>
          <div className="table-wrapper">
            <table className="list-table">
              <thead>
                <tr>
                  <th>찜한식당</th>
                  <th>카테고리</th>
                  <th>주소</th>
                  <th>삭제</th>
                </tr>
              </thead>
              <tbody>
                {wishRecord.map((wishlistup) => (
                  <tr key={wishlistup.id}>
                    <td>{wishlistup.name}</td>
                    <td>{wishlistup.categoryOne}</td>
                    <td>{wishlistup.location}</td>
                    <td>
                      <a onClick={() => wishDel(wishlistup.id)}>삭제</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="my-pagination-box">
              <ul className="my-pagination">
                <li className="my-page-item">
                  <a className="my-page-link" onClick={() => getWishList(nowWishPage > 1 ? nowWishPage - 1 : 1)}>
                    Previous
                  </a>
                </li>
                {wishPageNumber.map((pg) => (
                  <li className={nowWishPage == pg ? "my-page-item active" : "my-page-item"} key={pg}>
                    <a className="my-page-link" onClick={() => getWishList(pg)}>
                      {pg}
                    </a>
                  </li>
                ))}
                <li className="my-page-item">
                  <a
                    className="my-page-link"
                    onClick={() => getWishList(nowWishPage < totalWishPage ? nowWishPage + 1 : totalWishPage)}
                  >
                    Next
                  </a>
                </li>
              </ul>
            </div>

        <div id="reviewlist-box">
          <h2 id="reviewlist-title">나의 리뷰</h2>
          <div className="table-wrapper">
            <table className="list-table">
              <thead>
                <tr>
                  <th>식당이름</th>
                  <th>리뷰</th>
                  <th>별점</th>
                  <th>날짜</th>
                  <th>삭제</th>
                </tr>
              </thead>
              <tbody>
                {reviewRecord.map((reviewlistup) => (
                  <tr key={reviewlistup.id}>
                    <td>{reviewlistup.restaurant.name}</td>
                    <td
                      style={{
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {reviewlistup.comment}
                    </td>
                    <td>{reviewlistup.rating}</td>
                    <td>{reviewlistup.writedate.substring(0, 10)}</td>
                    <td>
                      <a>삭제</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="my-pagination-box">
              <ul className="my-pagination">
                <li className="my-page-item">
                  <a className="my-page-link" onClick={() => getReviewList(nowReviewPage > 1 ? nowReviewPage - 1 : 1)}>
                    Previous
                  </a>
                </li>
                {reviewPageNumber.map((pgReview) => (
                  <li className={nowReviewPage == pgReview ? "my-page-item active" : "my-page-item"} key={pgReview}>
                    <a className="my-page-link" onClick={() => getReviewList(pgReview)}>
                      {pgReview}
                    </a>
                  </li>
                ))}
                <li className="my-page-item">
                  <a
                    className="my-page-link"
                    onClick={() => getReviewList(nowReviewPage < totalReviewPage ? nowReviewPage + 1 : totalReviewPage)}
                  >
                    Next
                  </a>
                </li>
              </ul>
            </div>

        <div className="edit-profile-button-container">
          <Link to="/editEnter" className="edit-profile-button"> 개인정보수정 </Link>
        </div>
      </div>
    </Faded>
  )
}

export default MyPage

