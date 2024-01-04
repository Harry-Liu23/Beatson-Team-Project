"use client";
import {useState } from 'react';
import styles from '../../styles/LoginForm.module.css';
import postFormToUrlAsJson from '../../services/postFormToUrlAsJson'

/* <LoginForm /> is a component for a form 
which has a username and password field
and a login button.
*/

/* postFormToUrlAsJson() is a async function that takes a 
FormEvent and url (string) that handles the post request and returns
the response.
*/

async function handleSubmit(event){

    const data = await postFormToUrlAsJson(event,'http://localhost:2020/login')
    console.log(JSON.stringify(data.json()))
}

const LoginForm = () => {

    /* saves the user's inputs */
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className={styles.container}>
            <form onSubmit={e => handleSubmit(e)}>
                <div className={styles.header}> 
                    Login
                </div>
                <br />
                <div className={styles.inputs}>
                    <input className={styles.input} 
                        type="text"
                        name = "username"
                        value={username}
                        placeholder="Enter username"
                        onChange={(event) => setUsername(event.target.value)}
                    />
                    <br /> 
                    <input className={styles.input} 
                        type="password"
                        name = "password"
                        value={password}
                        placeholder="Enter password"
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <br />
                    <button type="submit" className={styles.button}> 
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;