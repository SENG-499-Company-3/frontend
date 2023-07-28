import { AxiosInstance, AxiosResponse } from 'axios'
import { IAuthenticatedUser } from '../../types/auth.d';

export interface IUser {
    id: string;
    email: string;
    name: string;
    userrole: string;
    submittedPreferences: boolean;
}

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

    const getUserById = async (id: string): Promise<IUser> => {
        const { data } = await axios.get(`/user/${id}`);

        return data;
    }

    const listUsers = async (): Promise<IUser[]> => {
        const { data } = await axios.get('/user/list');
        return data;
    }

    return {
        create,
        listUsers,
        getUserById
    }
}

export default useUserApi;
