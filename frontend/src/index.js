import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="133837833048-c2cnruqut35qa08lhl4gn6pcfha8t7os.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);