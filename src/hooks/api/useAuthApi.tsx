import { AxiosInstance, AxiosResponse } from 'axios'
import { IAuthenticatedUser } from '../../types/auth.d';
import { AuthContext } from '../../contexts/AuthContext';
import React, { useContext, useEffect, useMemo } from 'react';

const useAuthApi = (axios: AxiosInstance) => {
    const authContext = useContext(AuthContext);

    /**
     * Signs the user into the application by returning their user token
     */
    const login = async (email: string, password: string): Promise<{ token: string}> => {
        return axios
            .post('/auth/login', { email, password})
            .then((response: AxiosResponse<string>) => {
                authContext.setUserToken(response.data)

                return { token: response.data }
            })
    }

    /**
     * Fetches the currently authenticated user
     */
    const self = async (email: string, password: string): Promise<IAuthenticatedUser> => {
        return axios
            .post('/auth/self', {email, password})
            .then((response: AxiosResponse<IAuthenticatedUser>) => {
                authContext.setCurrentUser(response.data)

                return response.data
            })
    }

    const logout = async (): Promise<void> => {
        authContext.resetCurrentUser()
        authContext.setUserToken(null)
    }

    return {
        login,
        self,
        logout
    }
}

export default useAuthApi;
