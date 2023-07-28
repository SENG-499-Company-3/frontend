import { AxiosInstance, AxiosResponse } from 'axios'
import { ITerm } from './useTermsApi';

export interface ICoursePreference {
    courseYear: number;
    courseName: string;
    willingness: 'WILLING' | 'UNWILLING' | 'VERY_WILLING'
    ability: 'ABLE' |'WITH_DIFFICULTY';
}

export interface IAvailability {
    term: ITerm
    isAvailable: boolean
}

export interface ILoad {
    year: number
    maxCourses: number
}

export interface IPreferences {
    email: string;
    coursePreferences: ICoursePreference[]
    additionalDetailes: string
    availability: IAvailability[]
    load: number
}

const usePreferencesApi = (axios: AxiosInstance) => {
    const getPreferencesByEmail = async (email: string): Promise<IPreferences> => {
        const { data } = await axios.get<IPreferences>(`/preferences/email?teacherEmail=${email}`);
        
        return data;
    }

    const listPreferences = async (): Promise<any[]> => {
        const { data } = await axios.get('/teacherpref/list');

        return data;
    }

    const savePreferences = async (newPreferences: IPreferences): Promise<any[]> => {
        return Promise.resolve(null);
        const { data } = await axios.put('/preferences/update', newPreferences);

        return data;
    }

    return {
        getPreferencesByEmail,
        listPreferences,
        savePreferences
    }
}

export default usePreferencesApi;
