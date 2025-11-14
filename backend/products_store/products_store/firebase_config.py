import firebase_admin
from firebase_admin import credentials

# Path to your service account key
cred = credentials.Certificate("../firebase-key.json")

# Initialize Firebase App
default_app = firebase_admin.initialize_app(cred)
