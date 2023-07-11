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
import { INewUserDetails } from '../types/auth.d'
import { AuthContext } from '../contexts/AuthContext'
import { useRouter } from 'next/router'
import useApi from '../hooks/useApi';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const RegisterPage = () => {
    const router = useRouter();
    const authContext = useContext(AuthContext);
    const api = useApi().user;

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

    //Variable for plaintext password
    const [name, setName] = useState('');
    const handleNameChange = (event) => {
        setName(event.target.value);
    }

    //Variable for plaintext password
    const [role, setRole] = useState<RoleType>("TEACHER");
    const handleRoleChange = (event) => {
        setRole(event.target.value);
    }

    // When this callback runs, it sets the given user details into the Auth context.
    const handleSignUp = (userDetails: INewUserDetails) => {
        api.create(userDetails.emailAddress, userDetails.password, userDetails.displayName, userDetails.type).then((response) => {
            setLoading(false)
            if (response.status !== 200) {
                setSuccess(false)
            }
            else {
                setSuccess(true)
                router.push('/login')
            }
        })
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
        if (!loading) {
            setSuccess(null);
            setLoading(true);

            //Spin
            timer.current = window.setTimeout(() => {
                setLoading(false);
            }, 2000);

            handleSignUp({ emailAddress: email, password: password, displayName: name, type: role });
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
                <div>
                    <TextField
                        id="outlined-basic"
                        label="Display Name"
                        type="text"
                        variant="outlined"
                        value={name}
                        onChange={handleNameChange}
                        fullWidth={true}
                    />
                </div>
                <br />
                <div>
                    <FormControl fullWidth>
                        <InputLabel id="role-select-label">Role</InputLabel>
                        <Select
                            labelId="role-select-label"
                            id="role-select"
                            value={role}
                            label="Role"
                            variant="outlined"
                            onChange={handleRoleChange}
                            fullWidth={true}
                        >
                            <MenuItem value={"ADMIN"}>Admin</MenuItem>
                            <MenuItem value={"TEACHER"}>Professor</MenuItem>
                            <MenuItem value={"RESEARCHER"}>Researcher</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <br />
                <Box sx={{ m: 1, position: 'relative' }}>
                    <Button
                        variant="contained"
                        disabled={loading}
                        onClick={handleClick}
                    >Register
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
                        <Alert severity="success">Register successful</Alert>
                    )}
                    {!loading && success === false && (
                        <Alert severity="error">Invalid account or password</Alert>
                    )}
                </Box>
            </div>
        </Container>
    )
}

export default RegisterPage