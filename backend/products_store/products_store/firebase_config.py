import os
import json
import firebase_admin
from firebase_admin import credentials

if not firebase_admin._apps:
    # Load Firebase credentials from environment variable
    firebase_key_json = os.environ.get("FIREBASE_KEY")

    if firebase_key_json is None:
        raise ValueError("FIREBASE_KEY environment variable not set")

    firebase_key = json.loads(firebase_key_json)

    cred = credentials.Certificate(firebase_key)
    firebase_admin.initialize_app(cred)
