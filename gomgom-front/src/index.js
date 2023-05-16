import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; //app.js에서 app()함수가 리턴하는 값이 아이디가 root인 div아래로 들어간다. 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />  
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
