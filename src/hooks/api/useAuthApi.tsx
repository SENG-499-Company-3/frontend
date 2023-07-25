import { AxiosInstance, AxiosResponse } from 'axios'
import { IAuthenticatedUser } from '../../types/auth.d';
import { AuthContext } from '../../contexts/AuthContext';
import React, { useContext, useEffect, useMemo } from 'react';

export const USER_TOKEN = 'USER_TOKEN';

const useAuthApi = (axios: AxiosInstance) => {
    const authContext = useContext(AuthContext);

    /**
     * Signs the user into the application by returning their user token
     */
    const login = async (email: string, password: string): Promise<void> => {
        return axios
            .post('/auth/login', { email, password})
            .then((response: AxiosResponse<string>) => {
                authContext.setUserToken(response.data)
                console.log('setting user_token to:', response.data)
                localStorage.setItem(USER_TOKEN, response.data)
            })
    }

    /**
     * Fetches the currently authenticated user
     */
    const self = async (): Promise<IAuthenticatedUser> => {
        return axios
            .post('/auth/self')
            .then((response: AxiosResponse<IAuthenticatedUser>) => {
                authContext.setCurrentUser(response.data)

                return response.data
            })
    }

    const logout = async (): Promise<void> => {
        authContext.resetCurrentUser()
        authContext.setUserToken(null)
        localStorage.removeItem(USER_TOKEN)
    }

    return {
        login,
        self,
        logout
    }
}

export default useAuthApi;
