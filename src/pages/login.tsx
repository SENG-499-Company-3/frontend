// Login page boilerplate!

import React, { useContext, useEffect } from 'react'
import { useState } from 'react';
import { redirect } from 'next/navigation';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { IExistingUserDetails } from '../types/auth.d'
import { AuthContext } from '../contexts/AuthContext'
import { useRouter } from 'next/router'
import useApi from '../hooks/useApi';
import { LoadingButton } from '@mui/lab';

const LoginPage = () => {
    const router = useRouter();
    const authContext = useContext(AuthContext);
    const api = useApi();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        setError(false);
    }
    
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setError(false);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        api.auth.login(email, password)
            .then(() => {
                router.push('/'); // Redirect user
            })
            .finally(() => {
                setLoading(false)
            })
            .catch(() => {
                setError(true);
            });
    }

    return (
        //Constraining UI within container; also used for wider input fields
        <Container maxWidth="sm">
            <Paper component='form' onSubmit={handleSubmit} sx={{ p: 6, m: 4}}>
                <Typography variant='h4' sx={{ textAlign: 'center', mb: 4 }}>Scheduler Login</Typography>
                <Box>
                    <TextField
                        id="outlined-basic"
                        label="Email"
                        name="scheduler-email"
                        type="text"
                        variant="outlined"
                        value={email}
                        onChange={handleEmailChange}
                        fullWidth={true}
                        error={error}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        id="outlined-password-input"
                        label="Password"
                        name="scheduler-password"
                        type="password"
                        variant="outlined"
                        value={password}
                        onChange={handlePasswordChange}
                        fullWidth={true}
                        error={error}
                        helperText={error ? 'Invalid account or password' : undefined}
                        sx={{ mb: 2 }}
                    />
                    <LoadingButton
                        variant="contained"
                        type='submit'
                        loading={loading}
                    >Login
                    </LoadingButton>
                </Box>
            </Paper>
        </Container>
    )
}

export default LoginPage