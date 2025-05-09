import React from 'react';
import ReactDOM from 'react-dom/client';
import EndScreen from './EndScreen.jsx';
import Profile from './profile.jsx';
import './tinytowns.css';

const root = ReactDOM.createRoot(document.getElementById('app'));

const path = window.location.pathname;

if (path.includes('profile.html')) {
  root.render(<Profile />);
} else {
  root.render(<EndScreen />);
}
