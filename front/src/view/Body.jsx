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
import NoticeWrite from "./page/board/NoticeWrite";
import NoticeView from "./page/board/NoticeView";
import InquiryList from "./page/board/InquiryPage"; // 중복된 import 정리 ✅
import EventEdit from "./page/board/EventEdit"; // ✅ EventEdit 컴포넌트 import 추가!
import NoticeEdit from "./page/board/NoticeEdit";
import NoticePage from "./page/board/NoticePage";
import FaqUpdate from "./page/board/FaqUpdate";
import FreeWrite from "./page/board/FreeWrite";
import FreePage from "./page/board/FreePage";
import FreeView from "./page/board/FreeView";
import FreeEdit from "./page/board/FreeEdit";
import EnterEdit from "./user/EnterEdit";
import EditPage from "./user/EditPage";

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
      <Route path="/events/edit/:id" element={<EventEdit />} />

      {/* 문의 게시판 (Inquiry) */}
      <Route path="/inquiry" element={<InquiryPage />} />
      <Route path="/inquiry/list" element={<InquiryList />} /> {/* 문의 리스트 ✅ */}
      <Route path="/inquiry/write" element={<InquiryWrite />} /> {/* 글쓰기 ✅ */}
      <Route path="/inquiry/view/:id" element={<InquiryView />} /> {/* 글 보기 ✅ */}
      <Route path="/faq/update/:id" element={<FaqUpdate />} />


      {/* 공지사항 게시판 (Notice) */}
      <Route path="/notice/page" element={<NoticePage/>}/>
      <Route path="/notice/write" element={<NoticeWrite/>}/>
      <Route path="/notice/view/:id" element={<NoticeView/>}/>
      <Route path="/notice/edit/:id" element={<NoticeEdit/>}/>

      {/* 자유 게시판 (Free) */}
      <Route path="/free" element={<FreePage/>}/>
      <Route path="/free/write" element={<FreeWrite/>}/>
      <Route path="/free/view/:id" element={<FreeView/>}/>
      <Route path="/free/edit/:id" element={<FreeEdit/>}/>

      {/* 추가된 경로 */}
      <Route path="/boardwrite" element={<InquiryWrite/>} /> {/* 추가된 경로 ✅ */}

      {/* 기타 */}
      <Route path="/find" element={<Find />} />
      <Route path="/recommend" element={<Recommend />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/findInfo" element={<FindInfo />} />
      <Route path="/test" element={<Test />} />
      <Route path="/editEnter" element={<EnterEdit/>} />
      <Route path="/editPage" element={<EditPage/>} />

      {/* 기본적으로 이벤트 게시판으로 이동 */}
      <Route path="/" element={<Navigate to="/boardpage?category=EVENT" />} />
    </Routes>
  );
}

export default Body;