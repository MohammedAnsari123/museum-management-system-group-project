from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from bson.objectid import ObjectId
import os
from db import db, admins_col, visitors_col, museums_col, bookings_col, ratings_col
from routes.auth_routes import auth_bp
from routes.chatbot_routes import chatbot_bp, load_model

app = Flask(__name__)
app.secret_key = 'your_secret_key_here' # Replace with a strong secret key in production

# Register Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(chatbot_bp)

# Helper to serialize MongoDB documents
def serialize_doc(doc):
    if not doc:
        return None
    doc['id'] = str(doc['_id'])
    del doc['_id']
    return doc

# Helper to serialize list of docs
def serialize_cursor(cursor):
    return [serialize_doc(doc) for doc in cursor]

# Route Protection Middleware
@app.before_request
def check_auth():
    # Admin Protection
    if request.path.startswith('/admin/'):
        if request.path == '/admin/admin_auth.html':
            return None # Allow access to login page
        if 'admin_id' not in session:
            return redirect('/admin/admin_auth.html')
            
    # Visitor Protection
    if request.path.startswith('/visitor/'):
        allowed_routes = [
            '/visitor/visitor_login.html', 
            '/visitor/visitor_register.html', 
            '/visitor/forgot_password.html', 
            '/visitor/reset_password.html'
        ]
        if request.path in allowed_routes:
            return None
        if 'visitor_id' not in session:
            return redirect('/visitor/visitor_login.html')

# Route for the landing page
@app.route('/')
@app.route('/index.html')
def index():
    return render_template('index.html')

# Visitor Routes
@app.route('/visitor/VisitorsHomePage.html')
def visitor_home():
    return render_template('visitor/VisitorsHomePage.html')

@app.route('/visitor/gallery.html')
def visitor_gallery():
    return render_template('visitor/gallery.html')

@app.route('/visitor/museum_map.html')
def visitor_map():
    return render_template('visitor/museum_map.html')

@app.route('/visitor/chatbot.html')
def visitor_chatbot():
    return render_template('visitor/chatbot.html')

@app.route('/visitor/visitor_login.html')
def visitor_login():
    return render_template('visitor/visitor_login.html')

@app.route('/visitor/visitor_register.html')
def visitor_register():
    return render_template('visitor/visitor_register.html')

@app.route('/visitor/forgot_password.html')
def visitor_forgot_password():
    return render_template('visitor/forgot_password.html')

@app.route('/visitor/reset_password.html')
def visitor_reset_password():
    return render_template('visitor/reset_password.html')

# Admin Routes
@app.route('/admin/admin_auth.html')
def admin_auth():
    return render_template('admin/admin_auth.html')

@app.route('/admin/admin_dashboard.html')
def admin_dashboard():
    return render_template('admin/admin_dashboard.html')

@app.route('/admin/analytics.html')
def admin_analytics():
    return render_template('admin/analytics.html')

@app.route('/admin/manage_bookings.html')
def admin_bookings():
    return render_template('admin/manage_bookings.html')

@app.route('/admin/manage_exhibits.html')
def admin_exhibits():
    return render_template('admin/manage_exhibits.html')

@app.route('/admin/ml_modules.html')
def admin_ml():
    return render_template('admin/ml_modules.html')

@app.route('/admin/admin_ratings.html')
def admin_ratings():
    return render_template('admin/admin_ratings.html')


# --- Admin APIs (MongoDB) ---

@app.route('/api/admin/analytics')
def api_analytics():
    # In a real scenario, calculate these from DB
    return jsonify({
        'booking_stats': {'confirmed': 150, 'cancelled': 20, 'pending': 10},
        'museum_stats': {'history': 5, 'art': 8, 'science': 3},
        'visitors_by_month': {'labels': ['Jan', 'Feb', 'Mar'], 'data': [100, 120, 150]},
        'museum_types': {'labels': ['History', 'Art', 'Science'], 'data': [5, 8, 3]}
    })

@app.route('/api/admin/museums', methods=['GET', 'POST'])
def api_museums():
    if request.method == 'POST':
        data = request.json
        result = museums_col.insert_one(data)
        data['id'] = str(result.inserted_id)
        del data['_id']
        return jsonify(data)
    
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    skip = (page - 1) * per_page
    
    cursor = museums_col.find().skip(skip).limit(per_page)
    items = serialize_cursor(cursor)
    total = museums_col.count_documents({})
    
    return jsonify({'items': items, 'page': page, 'per_page': per_page, 'total': total, 'total_pages': (total // per_page) + 1})

@app.route('/api/admin/museums/<id>', methods=['DELETE', 'PUT'])
def api_museum_detail(id):
    try:
        obj_id = ObjectId(id)
    except:
        return jsonify({'error': 'Invalid ID'}), 400

    if request.method == 'DELETE':
        museums_col.delete_one({'_id': obj_id})
        return jsonify({'status': 'deleted'})
    if request.method == 'PUT':
        data = request.json
        museums_col.update_one({'_id': obj_id}, {'$set': data})
        return jsonify({'status': 'updated'})

@app.route('/api/admin/bookings')
def api_bookings():
    bookings = serialize_cursor(bookings_col.find())
    return jsonify(bookings)

@app.route('/api/admin/bookings/<id>/status', methods=['POST'])
def api_booking_status(id):
    status = request.json.get('status')
    
    # Try finding by TicketID first (legacy mock data)
    result = bookings_col.update_one({'TicketID': id}, {'$set': {'Attended': status}})
    if result.matched_count == 0:
        # Try finding by ObjectId
        try:
            bookings_col.update_one({'_id': ObjectId(id)}, {'$set': {'Attended': status}})
        except:
             return jsonify({'error': 'Not found'}), 404
             
    return jsonify({'status': 'updated'})

@app.route('/api/admin/ratings')
def api_ratings():
    ratings = serialize_cursor(ratings_col.find())
    return jsonify({'items': ratings, 'page': 1, 'total_pages': 1})

@app.route('/api/personalized')
def api_personalized():
    # Mock ML recommendation
    museum = museums_col.find_one()
    return jsonify([serialize_doc(museum)] if museum else [])

if __name__ == '__main__':
    # Preload auth or db if needed logic exists
    # Model loading happens on demand or via background thread in chatbot route
    app.run(debug=True, port=5000)
