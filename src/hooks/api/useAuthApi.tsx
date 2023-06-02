import { AxiosInstance, AxiosResponse } from 'axios'
import { IAuthenticatedUser } from '../../types/auth';

const useAuthApi = (axios: AxiosInstance) => {

    /**
     * Signs the user into the application by returning their user token
     */
    const login = async (username: string, password: string): Promise<{ token: string}> => {
        return axios
            .post('/api/login', { username, password})
            .then((response: AxiosResponse<string>) => {
                return { token: response.data }
            });
    }

    /**
     * Fetches the currently authenticated user
     */
    const self = async (): Promise<IAuthenticatedUser> => {
        return axios
            .get('/api/self')
            .then((response: AxiosResponse<IAuthenticatedUser>) => {
                return response.data
            })
    }

    return {
        login,
        self
    }
}

export default useAuthApi;
