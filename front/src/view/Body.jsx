import { Route, Routes } from 'react-router-dom';

import MainPage from './page/MainPage';
import About from './page/About';
import Login from './user/Login';
import Signup from './user/Singup';
import Board from './page/board/Board';
import Find from './page/find/Find';
import Recommend from './page/recommend/Recommend';

function Body() {
  return (
    <Routes>
      <Route path="/" element={<MainPage/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/board" element={<Board/>}/>
      <Route path="/find" element={<Find/>}/>
      <Route path="/recommend" element={<Recommend/>}/>
    </Routes>
  );
}

export default Body;
