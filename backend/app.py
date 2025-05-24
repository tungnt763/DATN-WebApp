from flask import Flask, request, jsonify
from flask_cors import CORS
from models import UploadLog, SessionLocal
from gcs_utils import upload_file_to_gcs
from datetime import datetime
from sqlalchemy import and_

app = Flask(__name__)
CORS(app)

@app.route("/upload", methods=["POST"])
def upload():
    if "file" not in request.files:
        return jsonify({"message": "Không có file"}), 400

    file = request.files["file"]
    if not file:
        return jsonify({"message": "File rỗng"}), 400

    try:
        size, dest_path = upload_file_to_gcs(file.stream, file.filename.split(".")[0].split("_")[0])
        log = UploadLog(filename=file.filename, dest_path=dest_path, size=size, status="success", uploaded_at=datetime.utcnow())
    except Exception as e:
        log = UploadLog(filename=file.filename, dest_path="", size=0, status="failed", uploaded_at=datetime.utcnow())
        return jsonify({"message": f"Lỗi upload: {e}"}), 500

    session = SessionLocal()
    session.add(log)
    session.commit()
    session.close()

    return jsonify({"message": "Upload thành công"}), 200

@app.route("/history", methods=["GET"])
def history():
    session = SessionLocal()

    # Query params
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 10))
    search = request.args.get("filename", "").strip()
    status = request.args.get("status", "").strip()
    start_date = request.args.get("start_date", "")
    end_date = request.args.get("end_date", "")

    # Base query
    query = session.query(UploadLog)

    # Apply filters
    filters = []

    if search:
        filters.append(UploadLog.filename.ilike(f"%{search}%"))

    if status:
        filters.append(UploadLog.status == status)

    if start_date:
        try:
            start_dt = datetime.strptime(start_date, "%Y-%m-%d")
            filters.append(UploadLog.uploaded_at >= start_dt)
        except ValueError:
            pass  # invalid date format ignored

    if end_date:
        try:
            end_dt = datetime.strptime(end_date, "%Y-%m-%d")
            filters.append(UploadLog.uploaded_at <= end_dt)
        except ValueError:
            pass

    if filters:
        query = query.filter(and_(*filters))

    total = query.count()
    logs = query.order_by(UploadLog.uploaded_at.desc()) \
                .offset((page - 1) * limit) \
                .limit(limit).all()

    session.close()

    return jsonify({
        "total": total,
        "page": page,
        "limit": limit,
        "records": [{
            "filename": log.filename,
            "size": log.size,
            "status": log.status,
            "dest_path": log.dest_path,
            "uploaded_at": log.uploaded_at.strftime("%Y-%m-%d %H:%M:%S")
        } for log in logs]
    })

