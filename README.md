# 🧪 Mô phỏng quá trình phát sinh và xử lý dữ liệu bán lẻ

Hướng dẫn thiết lập hệ thống mô phỏng dữ liệu từ hệ thống POS/ERP qua WebApp, trigger DAG Airflow thông qua Pub/Sub và Cloud Function.

---

## 🧭 Tổng quan quy trình

1. Người dùng upload file `.csv` qua giao diện web (Frontend + Backend).
2. File được lưu lên GCS (hoặc MinIO).
3. Cloud Function nhận thông điệp Pub/Sub khi có file mới → gọi REST API trigger DAG tương ứng trong Airflow.
4. Airflow thực thi pipeline ETL → xử lý và phân tích dữ liệu.

---

## ⚙️ Bước 1: Clone mã nguồn ứng dụng web

```bash
git clone https://github.com/tungnt763/DATN-WebApp.git
cd DATN-WebApp
```

---

## ⚙️ Bước 2: Thiết lập Backend (Flask)

### 2.1. Tạo Client ID trên GCP

- Truy cập [Google Cloud Console → OAuth 2.0 Credentials](https://console.cloud.google.com/apis/credentials)
- Tạo **OAuth 2.0 Client ID** cho ứng dụng web
- Authorized redirect URI: `http://localhost:8082/api/auth/callback` (sử dụng cho frontend)

### 2.2. Cấu hình môi trường backend

```bash
cd backend
touch .env
```

Nội dung file `.env`:

```env
GCP_BUCKET_NAME=retailing_data
GCP_CREDENTIAL_PATH=/path/to/your/service_account.json
DATABASE_URL=postgresql://airflow:airflow@localhost:5432/airflow
FLASK_SECRET_KEY=your_flask_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
ALLOWED_GOOGLE_DOMAINS=@gmail.com
```

### 2.3. Chạy ứng dụng backend

```bash
flask run --host=0.0.0.0 --port=5050
```

---

## ⚙️ Bước 3: Thiết lập Frontend (React)

```bash
cd ../frontend
touch .env
```

Nội dung `.env`:

```env
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

Chạy giao diện web:

```bash
npm install
npm start
```

Giao diện sẽ chạy tại `http://localhost:3000`

---

## ⚙️ Bước 4: Thiết lập ngrok và Cloud Function

### 4.1. Khởi chạy ngrok để expose Airflow API

```bash
brew install --cask ngrok
ngrok config add-authtoken <your_ngrok_token>
ngrok http http://localhost:8082
```

Ghi lại `https://<random>.ngrok.io` để sử dụng cho bước sau.

### 4.2. Cấu hình Cloud Function

```bash
cd ../cloud-function
touch .env.yaml
```

Nội dung `.env.yaml`:

```yaml
AIRFLOW_API_URL: "https://<ngrok_id>.ngrok.io/api/v1/dags"
AIRFLOW_API_TOKEN: ""
USE_BASIC_AUTH: "true"
BASIC_AUTH_USER: "admin"
BASIC_AUTH_PASS: "admin"
```

Triển khai Cloud Function:

```bash
gcloud functions deploy gcs_trigger_dag \                                   
  --runtime python310 \
  --entry-point trigger_dag \
  --trigger-topic gcs-trigger-topic \
  --env-vars-file .env.yaml \
  --region asia-southeast1
```

> 💡 Cloud Function sẽ được gọi mỗi khi có file mới đến GCS để kích hoạt DAG tương ứng qua Airflow API.

---

## ⚙️ Bước 5: Mô phỏng phát sinh dữ liệu POS

```bash
cd ../backend
python pos_sender/pos_sender.py
```

Script này sẽ tự động gửi các file `.csv` lên GCS định kỳ (mỗi 10 giây hoặc tùy chỉnh), giả lập quá trình phát sinh giao dịch từ hệ thống POS thực tế.

---

✅ **Sau khi hoàn tất:** bạn có thể theo dõi:
- Trạng thái DAG chạy tại `http://localhost:8082`
- File trên GCS
- Dashboard Superset tại `http://localhost:8088`
