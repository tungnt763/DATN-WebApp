import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import HistoryPage from './pages/HistoryPage';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import api from './api';

function App() {
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    api.get('/whoami')
      .then(res => setAuthenticated(true))
      .catch(() => setAuthenticated(false));
  }, []);

  if (authenticated === null) return <div className="text-center mt-5">Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={
          authenticated ? (
            <Layout>
              <Routes>
                <Route path="/" element={<UploadPage />} />
                <Route path="/history" element={<HistoryPage />} />
              </Routes>
            </Layout>
          ) : <Navigate to="/login" />
        } />
      </Routes>
    </Router>
  );
}

export default App;