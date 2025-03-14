import { Navigate, Route, Routes } from 'react-router-dom';

import MainPage from './page/MainPage';
import About from './page/About';
import Login from './user/Login';
import Signup from './user/Singup';
import Board from './page/board/BoardPage';
import BoardWrite from './page/board/EventWrite'; // BoardWrite 컴포넌트 임포트 추가
import InquiryPage from './page/board/InquiryPage'; // InquiryPage import
import InquiryWrite from './page/board/InquiryWrite'; // InquiryWrite import
import InquiryView from './page/board/InquiryView'; // InquiryView import
import Find from './page/find/Find';
import Recommend from './page/recommend/Recommend';
import MyPage from './user/MyPage';
import FindInfo from './page/find/FindInfo';
import Test from './Test';

function Body() {
  return (
    <Routes>
      <Route path="/" element={<MainPage/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/boardpage" element={<Board/>}/>
      <Route path="/" element={<Navigate to="/boardpage?category=EVENT" />} />
      <Route path="/events/write" element={<BoardWrite />} /> {/* 이 부분 추가! */}
      <Route path="/inquiry" element={<InquiryPage />} /> {/* InquiryPage 경로 추가 */}
      <Route path="/inquiryWrite" element={<InquiryWrite />} /> {/* InquiryWrite 경로 */}
      <Route path="/inquiryView/:id" element={<InquiryView />} /> {/* InquiryView 경로 */}
      <Route path="/find" element={<Find/>}/>
      <Route path="/recommend" element={<Recommend/>}/>
      <Route path="/mypage" element={<MyPage/>}/>
      <Route path="/findInfo" element={<FindInfo/>}/>
      <Route path="/test" element={<Test/>}/>
    </Routes>
  );
}

export default Body;