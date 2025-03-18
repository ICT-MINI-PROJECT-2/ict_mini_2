import React from 'react';
import ReactDOM from 'react-dom/client';
import {HashRouter, Route, Routes} from 'react-router-dom';

import Body from './view/Body';
import Footer from './view/Footer';
import Header from './view/Header';
import Menu from './view/Menu';
import PrivacyPolicy from './view/page/PrivacyPolicy';
import TermsOfUse from './view/page/TermsOfUse';

import './css/public.css';
import './js/public.js';

const container = ReactDOM.createRoot(document.getElementById('container'));
container.render(
  <div>
    <HashRouter>
      <Header/>
      <Menu/>
      <Routes>
        <Route path="/*" element={<Body />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
      </Routes>      
      <Footer/>
    </HashRouter>
  </div>
);
