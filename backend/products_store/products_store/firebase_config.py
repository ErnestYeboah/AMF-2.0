import os
import json
import firebase_admin
from firebase_admin import credentials
import tempfile

if not firebase_admin._apps:
    firebase_key_json = os.environ.get("FIREBASE_KEY")
    if firebase_key_json is None:
        raise ValueError("FIREBASE_KEY environment variable not set")

    firebase_key = json.loads(firebase_key_json)

    # Write temp file for Firebase
    with tempfile.NamedTemporaryFile(delete=False, suffix=".json", mode="w") as temp:
        json.dump(firebase_key, temp)
        temp_path = temp.name

    cred = credentials.Certificate(temp_path)
    firebase_admin.initialize_app(cred)
