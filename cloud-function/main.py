import base64
import json
import os
import requests
from datetime import datetime

AIRFLOW_API_URL = os.getenv("AIRFLOW_API_URL")  # e.g., http://localhost:8082/api/v1/dags
AIRFLOW_TOKEN = os.getenv("AIRFLOW_API_TOKEN")
USE_BASIC_AUTH = os.getenv("USE_BASIC_AUTH", "false").lower() == "true"
BASIC_AUTH_USER = os.getenv("BASIC_AUTH_USER")
BASIC_AUTH_PASS = os.getenv("BASIC_AUTH_PASS")

def trigger_dag(event, context):
    payload = base64.b64decode(event['data']).decode("utf-8")
    data = json.loads(payload)
    file_path = data.get("name")  # full GCS path e.g. retail_ingest/transactions_20240525T153210.csv

    if not file_path:
        print("❌ No GCS file path found in event")
        return

    file_name = os.path.basename(file_path)
    dag_id = f"dag_{file_name.split('_')[0]}"

    try:
        ts_str = file_name.split("_")[1].replace(".csv", "")  # 20240525T153210
        dt = datetime.strptime(ts_str, "%Y%m%dT%H%M%S")
        loaded_batch = int(dt.timestamp())
    except:
        loaded_batch = int(datetime.utcnow().timestamp())

    conf = {
        "file_path": file_path,
        "loaded_batch": loaded_batch
    }

    url = f"{AIRFLOW_API_URL}/{dag_id}/dagRuns"

    headers = {"Content-Type": "application/json"}
    auth = None
    if USE_BASIC_AUTH:
        auth = (BASIC_AUTH_USER, BASIC_AUTH_PASS)
    else:
        headers["Authorization"] = f"Bearer {AIRFLOW_TOKEN}"

    response = requests.post(url, headers=headers, json={"conf": conf}, auth=auth)

    print(f"📨 Triggered DAG {dag_id} with {conf}")
    print("Status:", response.status_code)
    print(response.text)
