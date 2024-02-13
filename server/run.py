import sys
import os
 
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, '..'))
sys.path.insert(0, project_root)

from application import app
from application import driver
from application import session

# Runs app then runs finally block on CTRL-C (SINGINT)
try:
  app.run(port=2020,host="127.0.0.1",debug=True)
  
finally:
  print("shutting down")
  driver.close()
  session.close()