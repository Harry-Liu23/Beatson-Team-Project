"""Module docstring.

This script initializes the Flask application and handles its execution.
"""
from application import app, session
from application import driver
import sys
import os

# Adjusting sys.path to include the project root
# This is necessary for subsequent imports to work correctly when the script is executed
# from a different directory.
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, '..'))
sys.path.insert(0, project_root)

# Now, import application components
def main():
    """Main function to run the Flask application."""
    try:
        # Runs app and ensures resources are released properly upon termination
        app.run(port=2020, host="127.0.0.1", debug=True)
    finally:
        print("Shutting down")
        driver.close()
        session.close()

if __name__ == "__main__":
    main()
