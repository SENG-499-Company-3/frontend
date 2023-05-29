import { AxiosInstance, AxiosResponse } from 'axios'

const useAuthApi = (axios: AxiosInstance) => {
    const login = (username: string, password: string) => {
        return axios.post('/api/login', { username, password})
            .then((response: AxiosResponse<unknown>) => {
                return response.data
            });
    }

    return {
        login
    }
}

export default useAuthApi;
