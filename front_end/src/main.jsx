// here's where it comes to life!

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// initialize a react app by creating a root element for it
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render( // render the app within the root element
  // enables routing in a React application without reloading the browser
  <BrowserRouter> 
    <App />
  </BrowserRouter>
);
