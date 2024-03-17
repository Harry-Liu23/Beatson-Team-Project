"use client";
import {useState } from 'react';
import styles from '../../styles/LoginForm.module.css';
import {
    Button,
    Grid,
    Card,
    TextField,
    MenuItem,
    InputLabel,
    FormControl,
    Select,
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


const LoginForm = () => {

    /* saves the user's inputs */
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [institution, setInstitution] = useState("");
    const [signup, setSignup] = useState(false);

    const handleLogin = (event) => {
        /* Backend implementation to be completed */
        console.log(email);
    }
    
    const handleSignup = (event) => {
        /* Backend implementation to be completed */
        console.log(email);
        console.log(institution);
    }

    const handleChange = () => {
        setInstitution(event.target.value);
    };
    
    const handleNoAccount = () => {
        setSignup(true);
    };

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
                            id="email"
                            label="Email"
                            variant="outlined"
                            onChange={() => setEmail(event.target.value)}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            id="password"
                            label="Password"
                            type="password"
                            variant="outlined"
                            onChange={() => setPassword(event.target.value)}
                        />
                    </Grid>

                    { !signup &&
                        <Grid item xs={6}>
                            <Button 
                                    color="inherit" 
                                    size="small" 
                                    variant="text"
                                    onClick= {() => {
                                        handleNoAccount();
                                    }}>
                                    Don&apos;t have an account?     
                                </Button> 
                        </Grid>
                    }
                    
                    {signup &&
                        <Grid item xs={6}>
                            <FormControl   sx={{ minWidth: 225}} >
                                <InputLabel id="select">
                                    Institution
                                </InputLabel>
                                <Select
                                    labelId="select-Label"
                                    id="institution"
                                    value={institution}
                                    label="Institution"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={"ICR"}>The Institute of Cancer Research</MenuItem>
                                    <MenuItem value={"CRUKScot"}>CRUK Scotland Institute</MenuItem>
                                    <MenuItem value={"MRCHGU"}>MRC Human Genetics Unit</MenuItem>
                                    <MenuItem value={"MRCHarwell"}>Mary Lyon Centre at MRC Harwell</MenuItem>
                                    <MenuItem value={"QueenSquare"}>Queen Square Insitute of Neurology</MenuItem>
                                    <MenuItem value={"UofG"}>University of Glasgow</MenuItem>
                                    <MenuItem value={"UofE"}>University of Edinburgh</MenuItem>
                                    <MenuItem value={"KCL"}>King&apos;s College London</MenuItem>
                                    <MenuItem value={"UofY"}>University of York</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    }

                    {signup &&
                        <Grid item xs={6}>
                            <Button 
                                className={styles.button}
                                color="inherit" 
                                size="large" 
                                variant="contained"
                                startIcon={<LoginIcon/>} 
                                onClick= {() => {
                                    handleSignup();
                                }}>
                                Sign Up      
                            </Button> 
                        </Grid>
                    }

                    {!signup &&
                        <Grid item xs={6}>
                            <Button 
                                className={styles.button}
                                color="inherit" 
                                size="large" 
                                variant="contained"
                                startIcon={<LoginIcon/>} 
                                onClick= {() => {
                                    handleLogin();
                                }}>
                                Login      
                            </Button> 
                        </Grid>
                    }

                </Grid>
            </Card>
        </div>
    );
}

export default LoginForm;
