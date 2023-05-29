import { AxiosInstance } from 'axios'

const useAuthApi = (axios: AxiosInstance) => {
    const login = async (username: string, password: string) => {
        return axios.post('/api/login', { username, password})
            .then((response) => {
                return response.data
            });
    }

    return {
        login
    }
}
