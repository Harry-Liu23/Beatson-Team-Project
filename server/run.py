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