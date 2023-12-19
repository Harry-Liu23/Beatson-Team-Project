"use client";
import { useState } from 'react';
import './LoginForm.css';

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
        <div className="container">
            <form onSubmit={handleSubmit}>
                <div className="header"> 
                    Login
                </div>
                <br />
                <div className="inputs">
                    <input className="input" 
                        type="text"
                        value={username}
                        placeholder="Enter username"
                        onChange={(event) => setUsername(event.target.value)}
                    />
                    <br /> 
                    <input className="input" 
                        type="password"
                        value={password}
                        placeholder="Enter password"
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <br />
                    <button type="submit" className="button"> 
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;