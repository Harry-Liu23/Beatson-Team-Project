from application import app, session
from flask import Flask, flash, jsonify, redirect, request, url_for
from server.Infrastructure.dao.authentication.userDao import userDao
from server.Infrastructure.entity.authentication.userForm import userForm
from server.Infrastructure.entity.authentication.passwordForm import passwordForm
from server.Infrastructure.entity.authentication.loginForm import loginForm
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = loginForm(request.form)

    if request.method == 'POST' and form.validate():
        username = form.username.data
        password = form.password.data

        user = userDao.get_user(username)
        if userForm.verify_password(user, password):
            session['user'] = username
            flash('Login successful', 'success')
            # return redirect(url_for('profile'))
        else:
            flash('Invalid username or password', 'danger')



@app.route('/logout')
def logout():
    session.pop('user', None)
    flash('Logout successful', 'success')
    return redirect(url_for('login'))



@app.route('/register', methods=['GET', 'POST'])
def register():
    form = userForm(request.form)
    
    if request.method == 'POST' and form.validate():
        username = form.username.data
        password = form.password.data

        existing_user = userDao.get_user(username)
        if existing_user:
            return jsonify({"error": "Username already exists"}), 400
        
        userDao.create_user(username, password)
        jsonify({"message": "User registered successfully"}), 201
        return redirect(url_for('login'))
    return jsonify({"error": "Invalid form data"}), 400


# @app.route('/profile/<userid>', methods=['GET'])
# def profile(userid):
#     current_user = session.get('user')
#     target_user = userDao.get_user(userid)

#     if not target_user:
#         return jsonify({"error": "User not found"}), 404

#     return render_template('profile.html', current_user=current_user, target_user=target_user)


# @app.route('/update_password/<userid>', methods=['POST'])
# def update_password():
#     data = request.json()
#     form = passwordForm(data=data)

#     if form.validate():
#         old_password = form.old_password.data
#         new_password = form.new_password.data

#         # Assuming the user is authenticated and the username is stored in the session
#         user = userDao.get_user(userid)
#         if user and check_password_hash(user["u"]["password_hash"], old_password):
#             update_password_for_user(session['user'], new_password)
#             return jsonify({"message": "Password updated successfully"}), 200
#         else:
#             return jsonify({"error": "Incorrect old password"}), 401

#     return jsonify({"error": "Invalid form data"}), 400