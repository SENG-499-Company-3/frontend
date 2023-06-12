import React, { PropsWithChildren, createContext } from 'react'
import { AuthenticatedUserType, IAuthenticatedUser } from '../types/auth.d'

interface IAuthContext {
    /**
     * The currently signed-in user.
     */
    currentUser: () => IAuthenticatedUser | null;

    /**
     * Updates the context to reflect the current user upon signing in.
     */
    setCurrentUser: (user: IAuthenticatedUser) => void;

    /**
     * The currently set user token.
     */
    userToken: () => string | null;

    /**
     * Updates the context to reflect the new user token.
     */
    setUserToken: (token: string) => void;

    /**
     * Removes the current user from the Auth context
     */
    resetCurrentUser: () => void;

    /**
     * Returns `true` if there is a user currently signed in; `false` otherwise.
     */
    isAuthenticated: () => boolean;

    /**
     * Returns `true` if the currently signed in user is an administrator; `false` otherwise.
     */
    isAdmin: () => boolean
}

export const AuthContext = createContext<IAuthContext>({
    currentUser: () => null,
    setCurrentUser: () => {},
    userToken: () => null,
    setUserToken: () => {},
    resetCurrentUser: () => {},
    isAuthenticated: () => false,
    isAdmin: () => false
});

export const AuthContextProvider = (props: PropsWithChildren) => {
    const [currentUser, setCurrentUser] = React.useState<IAuthenticatedUser | null>(null);
    const [userToken, setUserToken] = React.useState<string | null>(null);

    const authContext: IAuthContext = {
        currentUser: () => currentUser,
        setCurrentUser,
        userToken: () => userToken,
        setUserToken,
        resetCurrentUser: () => setCurrentUser(null),
        isAuthenticated: () => Boolean(currentUser),
        isAdmin: () => currentUser.type === AuthenticatedUserType.ADMIN
    }

    return (
        <AuthContext.Provider value={authContext}>
            {props.children}
        </AuthContext.Provider>
    )
}