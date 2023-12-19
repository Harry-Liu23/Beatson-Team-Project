import { useState } from 'react';

/* <LoginForm /> is a component for a form 
which has a username and password field
and a login button.
*/

const LoginForm = () => {
    /* saves the user's inputs */
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    /* handles the user pressing login button */
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Username: " + username);
        console.log("Password: " + password);
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label> 
                    Username   
                    <input
                        type="text"
                        value={username}
                        placeholder="Enter username"
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </label>
                <br />
                <label> 
                    Password   
                    <input
                        type="password"
                        value={password}
                        placeholder="Enter password"
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </label>
                <br />
                <button type="submit"> Login </button>
            </form>
        </div>
    );
}

export default LoginForm;