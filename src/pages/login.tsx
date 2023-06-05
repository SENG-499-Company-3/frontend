// Login page boilerplate!

import React, { useContext, useEffect } from 'react'
import { useState } from 'react';
import { redirect } from 'next/navigation';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { IAuthenticatedUser } from '../types/auth.d'
import { AuthContext } from '../contexts/AuthContext'
import { useRouter } from 'next/router'

const LoginPage = () => {
    const router = useRouter();
    const authContext = useContext(AuthContext);
    
    //Variable for plaintext username
    const [account, setAccount] = useState('');
    const handleAccountChange = (event) => {
        setAccount(event.target.value);
    }

    //Variable for plaintext password
    const [pw, setPW] = useState('');
    const handlePWChange = (event) => {
        setPW(event.target.value);
    }

    // When this callback runs, it sets the given user details into the Auth context.
    const handleSignIn = (userDetails: IAuthenticatedUser) => {
        authContext.setCurrentUser(userDetails);
    }

    //Variables for loading spinner
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(null);

    // This useEffect runs only once, when the component first mounts.
    useEffect(() => {
        // Check if the user is already signed in. If they are, redirec them to the home page.
        if (authContext.isAuthenticated()) {
            router.push('/'); // Redirect user
        }
    }, []);

    //Timer variables for testing spinner - remove once authentication complete unless you want the spinner regardless
    const timer = React.useRef<number>();
    React.useEffect(() => {
        return () => {
            clearTimeout(timer.current);
        };
    }, []);

    function handleClick() {
        //For testing, have data output into console
        console.log({ account });
        console.log({ pw });
        
        if (!loading) {
            setSuccess(null);
            setLoading(true);

            //Spin
            timer.current = window.setTimeout(() => {
                setLoading(false);
            }, 2000);

            //TODO: authentication of entered data
            //testing auth with response messages
            if (pw == 'wee') {
                setSuccess(true);
                console.log('Wee!');
            } else {
                setSuccess(false);
                console.log('Not wee');
            }
        }
    }

    return (
        //Constraining UI within container; also used for wider input fields
        <Container maxWidth="sm">
            <div>
                <h1>Scheduler Login</h1>
                <div>
                    <TextField
                        id="outlined-basic"
                        label="Account"
                        type="text"
                        variant="outlined"
                        value={account}
                        onChange={handleAccountChange}
                        fullWidth={true}
                    />
                </div>
                <br />
                <div>
                    <TextField
                        id="outlined-password-input"
                        label="Password"
                        type="password"
                        variant="outlined"
                        value={pw}
                        onChange={handlePWChange}
                        fullWidth={true}
                    />
                </div>
                <br />
                <Box sx={{ m: 1, position: 'relative' }}>
                    <Button
                        variant="contained"
                        disabled={loading}
                        onClick={handleClick}
                    >Login
                    </Button>
                    {loading && (
                    <CircularProgress
                        size={24}
                        sx={{
                            position: 'absolute',
                            top: '45%',
                            left: '7%',
                            marginTop: '-12px',
                            marginLeft: '-12px',
                            }}
                        />
                    )}
                    { !loading && success && (
                        <Alert severity="success">Login successful</Alert>
                    )}
                    { !loading && success === false && (
                        <Alert severity="error">Invalid account or password</Alert>
                    )}
                </Box>
            </div>
        </Container>
    )
}

export default LoginPage