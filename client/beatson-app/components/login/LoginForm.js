"use client";
import {useState } from 'react';
import styles from '../../styles/LoginForm.module.css';
import postFormAsJSON from '../../services/BackendAPI'
import {
    Button,
    Grid,
    Typography,
    Card,
    TextField,
    spacing,
    button,
  } from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';

/* <LoginForm /> is a component for a form 
which has a username and password field
and a login button.
*/

/* postFormToUrlAsJson() is a async function that takes a 
FormEvent and url (string) that handles the post request and returns
the response.
*/

async function handleSubmit(event){

    const data = await postFormAsJSON(event,'http://localhost:2020/login')
    console.log(JSON.stringify(data.json()))
}

const LoginForm = () => {

    /* saves the user's inputs */
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [institution, setInstitution] = useState("");

    return (
        <div>
            <Card variant="outlined" sx={{ padding:10 }} > 
                <Grid
                    container
                    rowGap={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    spacing={2}
                >
                    <Grid item xs={6}>
                        <TextField
                            id="username"
                            label="Username"
                            variant="outlined"
                            onChange={() => setUsername(event.target.value)}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            id="password"
                            label="Password"
                            variant="outlined"
                            onChange={() => setPassword(event.target.value)}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <Button 
                            className={styles.button}
                            color="inherit" 
                            size="large" 
                            variant="contained"
                            startIcon={<LoginIcon/>} 
                            onClick= {() => {
                                handleSubmit();
                            }}>
                            Login      
                        </Button> 
                    </Grid>

                </Grid>
            </Card>
        </div>
    );
}

export default LoginForm;
