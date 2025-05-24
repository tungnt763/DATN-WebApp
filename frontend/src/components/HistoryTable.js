import React, { useEffect, useState } from 'react';
import api from '../api';
import { Table, Badge, Spinner, Card } from 'react-bootstrap';

const HistoryTable = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/history');
      setLogs(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy lịch sử:", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <Card className="shadow-sm p-4">
      <Card.Title className="mb-3 fw-semibold">📄 Lịch sử các lần upload</Card.Title>
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table bordered responsive hover>
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Tên file</th>
              <th>Dung lượng</th>
              <th>Trạng thái</th>
              <th>Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{log.filename}</td>
                <td>{(log.size / 1024).toFixed(2)} KB</td>
                <td>
                  <Badge bg={log.status === 'success' ? 'success' : 'danger'}>
                    {log.status}
                  </Badge>
                </td>
                <td>{log.uploaded_at}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Card>
  );
};

export default HistoryTable;