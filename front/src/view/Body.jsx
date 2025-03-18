import { Route, Routes } from 'react-router-dom';

import MainPage from './page/MainPage';
import About from './page/About';
import Login from './user/Login';
import Signup from './user/Singup';
import Board from './page/board/BoardPage';
import Find from './page/find/Find';
import Recommend from './page/recommend/Recommend';
import MyPage from './user/MyPage';
import FindInfo from './page/find/FindInfo';
import Test from './Test';
import CheckList from './user/CheckList';

function Body() {
  return (
    <Routes>
      <Route path="/" element={<MainPage/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/boardpage" element={<Board/>}/>
      <Route path="/find" element={<Find/>}/>
      <Route path="/recommend" element={<Recommend/>}/>
      <Route path="/mypage" element={<MyPage/>}/>
      <Route path="/findInfo" element={<FindInfo/>}/>
      <Route path="/test" element={<Test/>}/>
      <Route path="/checkList" element={<CheckList/>}/>
    </Routes>
  );
}

export default Body;
