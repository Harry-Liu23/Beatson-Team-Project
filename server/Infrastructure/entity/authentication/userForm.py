from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, validators
from werkzeug.security import generate_password_hash, check_password_hash

class userForm(FlaskForm):

    # User name min length 4, max length 25 (unit character/byte)
    username = StringField('Username', [validators.Length(min=4, max=25)])

    password = PasswordField('Password', [
        validators.DataRequired(),
        validators.EqualTo('confirm', message='Passwords must match')
        ])
    confirm = PasswordField('Repeat Password')


    def verify_password(user, password):
        if user:
            return check_password_hash(user["u"]["password_hash"], password)
        return False