import { AxiosInstance, AxiosResponse } from 'axios'

type Preferences = string;

const usePreferencesApi = (axios: AxiosInstance) => {
    const getPreferencesByUserId = async (userId: string): Promise<Preferences> => {
        const { data } = await axios.get(`/teacherpref?id=${userId}`);

        return data;
    }

    const listPreferences = async (): Promise<any[]> => {
        const { data } = await axios.get('/teacherpref/list');

        return data;
    }

    return {
        getPreferencesByUserId,
        listPreferences
    }
}

export default usePreferencesApi;
