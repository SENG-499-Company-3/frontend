import React, { useContext, useEffect } from 'react'
import { IAuthenticatedUser } from '../types/auth'
import { AuthContext } from '../contexts/AuthContext'
import { useRouter } from 'next/router'

const LoginPage = () => {
    const router = useRouter();
    const authContext = useContext(AuthContext);

    // This useEffect runs only once, when the component first mounts.
    useEffect(() => {
        // Check if the user is already signed in. If they are, redirec them to the home page.
        if (authContext.isAuthenticated()) {
            router.push('/'); // Redirect user
        }
    }, []);

    // When this callback runs, it sets the given user details into the Auth context.
    const handleSignIn = (userDetails: IAuthenticatedUser) => {
        authContext.setCurrentUser(userDetails);
    }

    return (
        <div>
            <h1>Hello world!</h1>
            <p>The login page will live here.</p>
        </div>
    )
}

export default LoginPage
