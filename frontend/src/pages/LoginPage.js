import React from 'react';

const LoginPage = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:5050/login/google';
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f4f6f8',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '3rem 2.5rem',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '420px',
        width: '100%'
      }}>
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          style={{ width: '48px', marginBottom: '1.5rem' }}
        />
        <h3 className="fw-bold mb-3" style={{ color: '#1e3a8a' }}>Đăng nhập hệ thống</h3>
        <button
          onClick={handleLogin}
          className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2"
          style={{ padding: '10px 24px', fontSize: '16px', borderRadius: '8px' }}
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google icon"
            width="20"
            height="20"
          />
          <span className="fw-medium">Đăng nhập bằng Google</span>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;