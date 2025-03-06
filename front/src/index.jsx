import React from 'react';
import ReactDOM from 'react-dom/client';
import {HashRouter} from 'react-router-dom';

import Body from './view/Body';
import Footer from './view/Footer';
import Header from './view/Header';
import Menu from './view/Menu';

import './css/public.css';
import './js/public.js';

const container = ReactDOM.createRoot(document.getElementById('container'));
container.render(
  <div>
    <HashRouter>
      <Header/>
      <Menu/>
      <Body/>
      <Footer/>
    </HashRouter>
  </div>
);
