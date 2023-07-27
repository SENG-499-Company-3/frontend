import { AxiosInstance, AxiosResponse } from 'axios'
import { IAuthenticatedUser } from '../../types/auth.d';
import { AuthContext } from '../../contexts/AuthContext';
import React, { useContext, useEffect, useMemo } from 'react';
import { IUser } from './useUserApi';

export const USER_TOKEN = 'USER_TOKEN';

const useAuthApi = (axios: AxiosInstance) => {
    /**
     * Signs the user into the application by returning their user token
     */
    const login = async (email: string, password: string): Promise<void> => {
        const { data } = await axios.post('/auth/login', { email, password});

        return data
    }

    /**
     * Fetches the currently authenticated user
     */
    const self = async (): Promise<IUser> => {
        const { data } = await axios.post('/auth/self')

        return data;
    }

    return {
        login,
        self
    }
}

export default useAuthApi;
