import os
from google.cloud import storage
from dotenv import load_dotenv
from datetime import datetime
load_dotenv()

def upload_file_to_gcs(file_stream, filename):
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.getenv("GCP_CREDENTIAL_PATH")
    client = storage.Client()
    bucket = client.bucket(os.getenv("GCP_BUCKET_NAME"))
    blob_path = f"raw/{filename}/{filename}_{datetime.now().strftime('%Y%m%dT%H%M%S')}.csv"
    blob = bucket.blob(blob_path)
    blob.upload_from_file(file_stream)

    return blob.size, blob_path
