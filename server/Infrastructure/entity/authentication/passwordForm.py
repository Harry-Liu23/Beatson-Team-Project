from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, validators

class passwordForm(FlaskForm):
    old_password = PasswordField('Old Password', [validators.DataRequired()])
    new_password = PasswordField('New Password', [validators.DataRequired()])
    confirm_password = PasswordField('Confirm Password', [
        validators.DataRequired(),
        validators.EqualTo('new_password', message='Passwords must match')
    ])