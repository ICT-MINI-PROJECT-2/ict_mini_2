import { Route, Routes } from 'react-router-dom';

import MainPage from './page/MainPage';
import About from './page/About';
function Body() {
  return (
    <Routes>
      <Route path="/" element={<MainPage/>}/>
      <Route path="/about" element={<About/>}/>
    </Routes>
  );
}

export default Body;
