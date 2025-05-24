import React, { useState } from 'react';
import UploadForm from '../components/UploadForm';
import { Card } from 'react-bootstrap';

const UploadPage = () => {
  const [logLines, setLogLines] = useState([]);

  const handleLogUpdate = (line) => {
    setLogLines((prev) => [...prev, line]);
  };

  return (
    <>
      <h4 className="mb-3">📤 Tải lên file CSV</h4>
      <UploadForm onLogUpdate={handleLogUpdate} />
      <Card className="mt-4 p-3 bg-dark text-white" style={{ maxHeight: '300px', overflowY: 'auto', fontFamily: 'monospace' }}>
        <h6>📜 Nhật ký upload:</h6>
        {logLines.length === 0 ? (
          <span className="text-muted">Chưa có nhật ký nào.</span>
        ) : (
          logLines.map((line, idx) => <div key={idx}>{line}</div>)
        )}
      </Card>
    </>
  );
};

export default UploadPage;
