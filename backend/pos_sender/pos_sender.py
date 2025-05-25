import os
import time
import requests
from dotenv import load_dotenv

load_dotenv()

API_URL = "http://localhost:5050/upload"
API_KEY = os.environ.get("FLASK_SECRET_KEY")
DATA_DIR = "/Users/tungnt763/Documents/WebApp/backend/pos_sender/data"
INTERVAL = 600  # 10 phút (test)

def send_file(filepath):
    with open(filepath, "rb") as f:
        files = {"file": (os.path.basename(filepath), f)}
        headers = {"X-API-KEY": API_KEY}
        response = requests.post(API_URL, files=files, headers=headers)
        print(f"📤 Sent {os.path.basename(filepath)} → {response.status_code} - {response.json()}")

if __name__ == "__main__":
    files = sorted([f for f in os.listdir(DATA_DIR) if f.endswith(".csv")])

    print("📦 POS file sync simulator started...\n")

    for file in files:
        filepath = os.path.join(DATA_DIR, file)
        send_file(filepath)
        time.sleep(INTERVAL)
