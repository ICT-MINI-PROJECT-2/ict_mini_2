import { Navigate, Route, Routes } from "react-router-dom";
import MainPage from "./page/MainPage";
import About from "./page/About";
import Login from "./user/Login";
import Signup from "./user/Singup";
import Board from "./page/board/BoardPage";
import BoardWrite from "./page/board/EventWrite";
import EventView from "./page/board/EventView";
import InquiryPage from "./page/board/InquiryPage";
import InquiryWrite from "./page/board/InquiryWrite";
import InquiryView from "./page/board/InquiryView";
import Find from "./page/find/Find";
import Recommend from "./page/recommend/Recommend";
import MyPage from "./user/MyPage";
import FindInfo from "./page/find/FindInfo";
import Test from "./Test";
import InquiryList from "./page/board/InquiryPage"; // 중복된 import 정리 ✅


function Body() {
  return (
    <Routes>
      {/* 기본 페이지 */}
      <Route path="/" element={<MainPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* 이벤트 게시판 */}
      <Route path="/boardpage" element={<Board />} />
      <Route path="/events/write" element={<BoardWrite />} />
      <Route path="/events/:id" element={<EventView />} />

      {/* 문의 게시판 (Inquiry) */}
      <Route path="/inquiry" element={<InquiryPage />} />
      <Route path="/inquiry/list" element={<InquiryList />} /> {/* 문의 리스트 ✅ */}
      <Route path="/inquiry/write" element={<InquiryWrite />} /> {/* 글쓰기 ✅ */}
      <Route path="/inquiry/view/:id" element={<InquiryView />} /> {/* 글 보기 ✅ */}

      {/* 기타 */}
      <Route path="/find" element={<Find />} />
      <Route path="/recommend" element={<Recommend />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/findInfo" element={<FindInfo />} />
      <Route path="/test" element={<Test />} />

      {/* 기본적으로 이벤트 게시판으로 이동 */}
      <Route path="/" element={<Navigate to="/boardpage?category=EVENT" />} />
    </Routes>
  );
}

export default Body;
