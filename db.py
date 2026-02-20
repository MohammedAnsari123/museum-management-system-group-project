from pymongo import MongoClient
import os

# MongoDB Connection
# Use environment variable or default to localhost
MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URI)
db = client['miuzeum_db']

# Collections
admins_col = db['admins']
visitors_col = db['visitors']
museums_col = db['museums']
bookings_col = db['bookings']
ratings_col = db['ratings']
password_resets_col = db['password_resets']

def init_db(app):
    # If we need to attach anything to app, do it here
    pass
