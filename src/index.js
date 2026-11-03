import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

// A reload always begins at the top of the page. Browsers restore the old
// scroll position by default, which on this site drops you into the middle of
// a pinned section with the preloader still running over it — and the pins
// are measured from a fresh layout, so the restored offset is wrong anyway.
// Turning restoration off has to happen before the first paint, which is why
// it is here rather than in a component effect.
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
