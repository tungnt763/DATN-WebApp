import React, { useState, useEffect } from 'react';
import api from '../api';
import { Table, Badge, Spinner, Card, Form, Row, Col, Button } from 'react-bootstrap';

const HistoryPage = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/history', {
        params: {
          filename: search,
          status,
          start_date: startDate,
          end_date: endDate,
          page,
          limit
        }
      });
      setLogs(res.data.records);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Lỗi khi lấy lịch sử:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, limit]);

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <h4 className="mb-3">📁 Lịch sử tải lên</h4>

      <Form className="mb-3">
        <Row className="align-items-end">
          <Col md={3}>
            <Form.Label>Tên file</Form.Label>
            <Form.Control value={search} onChange={(e) => setSearch(e.target.value)} />
          </Col>
          <Col md={2}>
            <Form.Label>Trạng thái</Form.Label>
            <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Tất cả</option>
              <option value="success">Thành công</option>
              <option value="failed">Thất bại</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Label>Từ ngày</Form.Label>
            <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </Col>
          <Col md={2}>
            <Form.Label>Đến ngày</Form.Label>
            <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </Col>
          <Col md={1}>
            <Form.Label>&nbsp;</Form.Label>
            <Button className="w-100" onClick={() => { setPage(1); fetchLogs(); }}>Lọc</Button>
          </Col>
          <Col md={2}>
            <Form.Label>Số dòng/trang</Form.Label>
            <Form.Select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </Form.Select>
          </Col>
        </Row>
      </Form>

      <Card className="shadow-sm p-4">
        <Card.Title className="mb-3 fw-semibold">📄 Danh sách file đã upload</Card.Title>
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <Table bordered responsive hover>
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Tên file</th>
                <th>Đường dẫn GCS</th>
                <th>Dung lượng</th>
                <th>Trạng thái</th>
                <th>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={i}>
                  <td>{(page - 1) * limit + i + 1}</td>
                  <td>{log.filename}</td>
                  <td>{log.dest_path}</td>
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

        <div className="d-flex justify-content-between align-items-center mt-3">
          <span>{`Trang ${page} / ${totalPages}`}</span>
          <div>
            <Button
              className="me-2"
              variant="secondary"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Trước
            </Button>
            <Button
              variant="secondary"
              disabled={page === totalPages || total === 0}
              onClick={() => setPage(page + 1)}
            >
              Tiếp
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
};

export default HistoryPage;
