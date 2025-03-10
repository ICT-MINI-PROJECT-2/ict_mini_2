import { Route, Routes } from 'react-router-dom';

import MainPage from './page/MainPage';
import About from './page/About';
import Search from './page/Search';

function Body() {
  return (
    <Routes>
      <Route path="/" element={<MainPage/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/search" element={<Search/>}/>
    </Routes>
  );
}

export default Body;
