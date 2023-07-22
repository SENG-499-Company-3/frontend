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
import { IExistingUserDetails } from '../types/auth.d'
import { AuthContext } from '../contexts/AuthContext'
import { useRouter } from 'next/router'
import useApi from '../hooks/useApi';

const LoginPage = () => {
    const router = useRouter();
    const authContext = useContext(AuthContext);
    const api = useApi();
    
    //Variable for plaintext email
    const [email, setEmail] = useState('');
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    //Variable for plaintext password
    const [password, setPassword] = useState('');
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    // When this callback runs, it sets the given user details into the Auth context.
    const handleSignIn = async (userDetails: IExistingUserDetails) => {
        await api.auth.login(userDetails.emailAddress, userDetails.password)
    }

    //Variables for loading spinner
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(null);
    // This useEffect runs only once, when the component first mounts.
    useEffect(() => {
        if (authContext.userToken() != null && authContext.currentUser() == null) {
            api.auth.self()
        }
        // Check if the user is already signed in. If they are, redirec them to the home page.
        if (authContext.isAuthenticated()) {
            router.push('/'); // Redirect user
        }
    }, [authContext]);

    //Timer variables for testing spinner - remove once authentication complete unless you want the spinner regardless
    const timer = React.useRef<number>();
    React.useEffect(() => {
        return () => {
            clearTimeout(timer.current);
        };
    }, []);

    function handleClick() {
        if (!loading) {
            setSuccess(null);
            setLoading(true);

            //Spin
            timer.current = window.setTimeout(() => {
                setLoading(false);
            }, 2000);

            handleSignIn({ emailAddress: email, password: password});
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
                        label="Email"
                        type="text"
                        variant="outlined"
                        value={email}
                        onChange={handleEmailChange}
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
                        value={password}
                        onChange={handlePasswordChange}
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
                    {!loading && success && (
                        <Alert severity="success">Login successful</Alert>
                    )}
                    {!loading && success === false && (
                        <Alert severity="error">Invalid account or password</Alert>
                    )}
                </Box>
            </div>
        </Container>
    )
}

export default LoginPage