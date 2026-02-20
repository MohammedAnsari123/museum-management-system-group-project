from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
import datetime
from db import db, admins_col, visitors_col, password_resets_col

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/auth/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logged out successfully'})

@auth_bp.route('/api/auth/admin/register', methods=['POST'])
def admin_register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'error': 'Missing fields'}), 400

    if admins_col.find_one({'username': username}):
        return jsonify({'error': 'Username already exists'}), 409

    if admins_col.find_one({'email': email}):
        return jsonify({'error': 'Email already registered'}), 409

    hashed_password = generate_password_hash(password)
    new_admin = {'username': username, 'email': email, 'password': hashed_password}
    result = admins_col.insert_one(new_admin)
    return jsonify({'message': 'Admin registered successfully', 'user': {'username': username, 'email': email, 'id': str(result.inserted_id)}})

@auth_bp.route('/api/auth/admin/login', methods=['POST'])
def admin_login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = admins_col.find_one({'username': username})
    
    if user:
        if check_password_hash(user['password'], password):
            session['admin_id'] = str(user['_id'])
            return jsonify({'message': 'Login successful', 'user': {'username': user['username'], 'email': user['email'], 'id': str(user['_id'])}})
        elif user['password'] == password: # Legacy fallback
            new_hash = generate_password_hash(password)
            admins_col.update_one({'_id': user['_id']}, {'$set': {'password': new_hash}})
            session['admin_id'] = str(user['_id'])
            return jsonify({'message': 'Login successful (migrated)', 'user': {'username': user['username'], 'email': user['email'], 'id': str(user['_id'])}})
            
    return jsonify({'error': 'Invalid credentials'}), 401

@auth_bp.route('/api/auth/visitor/register', methods=['POST'])
def visitor_register_api():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'error': 'Missing fields'}), 400

    if visitors_col.find_one({'username': username}):
        return jsonify({'error': 'Username already exists'}), 409

    if visitors_col.find_one({'email': email}):
        return jsonify({'error': 'Email already registered'}), 409

    hashed_password = generate_password_hash(password)
    new_visitor = {'username': username, 'email': email, 'password': hashed_password}
    result = visitors_col.insert_one(new_visitor)
    return jsonify({'message': 'Visitor registered successfully', 'user': {'username': username, 'email': email, 'id': str(result.inserted_id)}})

@auth_bp.route('/api/auth/visitor/login', methods=['POST'])
def visitor_login_api():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = visitors_col.find_one({'username': username})
    if user:
        if check_password_hash(user['password'], password):
            session['visitor_id'] = str(user['_id'])
            return jsonify({'message': 'Login successful', 'user': {'username': user['username'], 'email': user['email'], 'id': str(user['_id'])}})
        elif user['password'] == password: # Legacy fallback
            new_hash = generate_password_hash(password)
            visitors_col.update_one({'_id': user['_id']}, {'$set': {'password': new_hash}})
            session['visitor_id'] = str(user['_id'])
            return jsonify({'message': 'Login successful (migrated)', 'user': {'username': user['username'], 'email': user['email'], 'id': str(user['_id'])}})

    return jsonify({'error': 'Invalid credentials'}), 401

@auth_bp.route('/api/auth/forgot-password', methods=['POST'])
def forgot_password():
    data = request.json
    email = data.get('email')
    user_type = data.get('type', 'visitor')
    
    collection = admins_col if user_type == 'admin' else visitors_col
    user = collection.find_one({'email': email})
    
    if not user:
        return jsonify({'message': 'If an account exists, a reset link has been sent.'})
        
    token = str(uuid.uuid4())
    expiry = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=15)
    
    password_resets_col.insert_one({
        'email': email,
        'user_type': user_type,
        'token': token,
        'created_at': datetime.datetime.now(datetime.timezone.utc),
        'expires_at': expiry
    })
    
    print(f"RESET LINK for {email}: /visitor/reset_password.html?token={token}")
    
    return jsonify({'message': 'If an account exists with that email, a reset link has been sent.'})

@auth_bp.route('/api/auth/reset-password', methods=['POST'])
def reset_password_api():
    data = request.json
    token = data.get('token')
    new_password = data.get('new_password')
    
    reset_doc = password_resets_col.find_one({'token': token})
    
    if not reset_doc:
        return jsonify({'error': 'Invalid or expired token'}), 400
        
    if reset_doc['expires_at'].replace(tzinfo=datetime.timezone.utc) < datetime.datetime.now(datetime.timezone.utc):
         return jsonify({'error': 'Token expired'}), 400
         
    collection = admins_col if reset_doc['user_type'] == 'admin' else visitors_col
    hashed = generate_password_hash(new_password)
    
    collection.update_one({'email': reset_doc['email']}, {'$set': {'password': hashed}})
    password_resets_col.delete_one({'_id': reset_doc['_id']})
    
    return jsonify({'message': 'Password updated successfully'})
