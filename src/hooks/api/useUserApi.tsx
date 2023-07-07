import { AxiosInstance, AxiosResponse } from 'axios'
import { IAuthenticatedUser } from '../../types/auth.d';

const useUserApi = (axios: AxiosInstance) => {

    /**
     * Registers the user into the application
     */
    const create = async (email: string, password: string, name: string, role: RoleType): Promise<AxiosResponse> => {
        return axios
            .post('/user/create', { email, password, name, role})
            .then((response: AxiosResponse<void>) => {
                if (response.status !== 200) {
                    console.log("Error creating user")
                    console.log(response.statusText)
                }

                return response
            });
    }

    return {
        create,
    }
}

export default useUserApi;
