import React, { PropsWithChildren, createContext, useEffect, useContext, useCallback, Fragment } from 'react'
import { AuthenticatedUserType, IAuthenticatedUser } from '../types/auth.d'
import { useRouter } from 'next/router';
import { USER_TOKEN } from '../hooks/api/useAuthApi';
import { useApi } from './ApiContext';
import { IUser } from '../hooks/api/useUserApi';

interface IAuthContext {
    /**
     * The currently signed-in user.
     */
    currentUser: () => IUser | null;

    /**
     * Fetches the currently signed in user and updates the context.
     */
    fetchSelf: () => void;

    /**
     * Logs out the user and redirects them to the login page
     */
    logout: () => void;

    /**
     * The currently set user token.
     */
    //userToken: () => string | null;

    /**
     * Updates the context to reflect the new user token.
     */
    //setUserToken: (token: string) => void;

    /**
     * Returns `true` if there is a user currently signed in; `false` otherwise.
     */
    isAuthenticated: () => boolean;

    /**
     * Returns `true` if the currently signed in user is an administrator; `false` otherwise.
     */
    isAdmin: () => boolean;

    /**
     * Returns string displayed in user avatar
     */
    avatarInitials: () => string;
}

export const AuthContext = createContext<IAuthContext>({
    currentUser: () => null,
    fetchSelf: () => {},
    logout: () => {},
    //userToken: () => null,
    //setUserToken: () => {},
    isAuthenticated: () => false,
    isAdmin: () => false,
    avatarInitials: () => ''
});

export const AuthGuard = (props: PropsWithChildren) => {
    const authContext = useContext(AuthContext);
    // const api = useApi();

    return (
        authContext.isAuthenticated()
            ? <>{props.children}</>
            : <></>
    )
}

export const withAuthGuard = (WrappedComponent) => {
    return (props) => (
      <AuthGuard>
        <WrappedComponent {...props} />
      </AuthGuard>
    );
  };

export const AuthContextProvider = (props: PropsWithChildren) => {
    const [currentUser, setCurrentUser] = React.useState<IUser | null>(null);
    const router = useRouter();
    const api = useApi();

    const fetchSelf = () => {
        api.auth.self().then((user) => {
            setCurrentUser(user);
        });
    }

    const authContext: IAuthContext = {
        currentUser: useCallback(() => currentUser, [currentUser]),
        fetchSelf,
        logout: () => {
            setCurrentUser(null);
            api.setUserToken(null);
            localStorage.removeItem(USER_TOKEN);
            router.push('/login');
        },
        isAuthenticated: () => Boolean(currentUser) && Boolean(api.userToken),
        isAdmin: () => currentUser.userrole === AuthenticatedUserType.ADMIN,
        avatarInitials: () => {
            if (!currentUser?.name) {
                return '';
            }

            const stringParts = currentUser.name.split(' ');

            return stringParts
                .slice(0, Math.max(stringParts.length - 2, 2))
                .map((stringPart) => stringPart.charAt(0))
                .join('')
                .toLocaleUpperCase();
        }
    }

    useEffect(() => {
        // console.log('api.userToken changed to:', api.userToken)
        // If user has not been fetched yet, attempt fetch. If it fails, the token has expired
        if (api.userToken && !currentUser) {
            fetchSelf();
        }
    }, [api.userToken])

    // On first render, load token from localStorage
    useEffect(() => {
        const existingToken = localStorage.getItem(USER_TOKEN)
        console.log('setting api.userToken to:', existingToken)
        if (existingToken) {
            api.setUserToken(existingToken)
        }
    }, []);

    return (
        <AuthContext.Provider value={authContext}>
            {props.children}
        </AuthContext.Provider>
    )
}
