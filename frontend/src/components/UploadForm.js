import React, { useState } from 'react';
import api from '../api';
import { Form, Button, Alert, Spinner, Card } from 'react-bootstrap';

const UploadForm = ({ onLogUpdate }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('info');
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      const log = (msg) => {
        const timestamp = new Date().toISOString();
        onLogUpdate?.(`${timestamp} INFO - ${msg}`);
      };
      log("Bắt đầu upload...");
      log("Lỗi: Không có file");
      log("Kết thúc upload");
      setMessage("Vui lòng chọn file CSV.");
      setVariant("warning");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);

    const log = (msg) => {
      const timestamp = new Date().toISOString();
      onLogUpdate?.(`${timestamp} INFO - ${msg}`);
    };

    log("Bắt đầu upload...");

    try {
      const res = await api.post('/upload', formData);
      log(`Đã gửi file ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
      log("Server phản hồi: " + res.data.message);
      setMessage(res.data.message);
      setVariant("success");
    } catch (err) {
      log("Lỗi: " + (err.response?.data?.message || err.message));
      setMessage("Upload thất bại");
      setVariant("danger");
    } finally {
      log("Kết thúc upload");
      setLoading(false);
      setFile(null);
      document.querySelector('input[type="file"]').value = null;
    }
  };

  return (
    <Card className="shadow-sm p-4">
      <Form>
        <Form.Group>
          <Form.Control
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Form.Group>
        <Button
          className="mt-3 w-100"
          variant="primary"
          onClick={handleUpload}
          disabled={loading || !file}
        >
          {loading ? <Spinner animation="border" size="sm" /> : 'Upload'}
        </Button>
      </Form>
      {message && <Alert variant={variant} className="mt-3 mb-0">{message}</Alert>}
    </Card>
  );
};

export default UploadForm;