from werkzeug.security import generate_password_hash, check_password_hash


class userDao:

    def __init__(self, driver):
        self.driver = driver

    def create_user(self, username, password, userid):
        password_hash = generate_password_hash(password)
        create_user_query = (
            "CREATE (s:User{"
            "userid:$userid, username:$username, password:$password_hash})"
        )

        parameters = {
            'userid':userid,
            'username':username,
            'password':password_hash
        }

        with self.driver.session() as session:
            result = session.run(create_user_query,parameters=parameters)
            return result.single()



    def get_user(self, userid):
        get_user_query = ("MATCH (u:User {userid: $userid}) RETURN u")
        
        parameters = {
            'userid':userid,
        }
        
        with self.driver.session() as session:
            result = session.run(get_user_query,parameters=parameters)
            return result.single()
        
    
    def update_username(self, userid, username):
        update_user_query = (
            "MATCH (s:User {userid:$userid})"
            "SET s.username = $username,"
            "RETURN s"
            )
        
        parameters = {
            'userid' :userid,
            'username' : username
        }
        with self.driver.session() as session:
            result = session.run(update_user_query,parameters=parameters)
            updated_user = result.single()
            if updated_user:
                session.close()
                return updated_user['s']
            else:
                session.close()
                return None


    def update_password(self,userid,new_password):
        query = (
        "MATCH (u:User {userid: $userid}) "
        "SET u.password_hash = $password_hash"
        )
        parameters = {
            "userid": userid,
            "password_hash": generate_password_hash(new_password),
        }
        with self.driver.session() as session:
            result = session.run(query, parameters)
            if result.summary().counters.nodes_created == 1:
                return True
            else:
                return False