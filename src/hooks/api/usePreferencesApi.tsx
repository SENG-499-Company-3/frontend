import { AxiosInstance, AxiosResponse } from 'axios'

export interface ICoursePreference {
    courseId: number;
    courseName: string;
    willingness: 'WILLING' | 'UNWILLING' | 'VERY_WILLING'
    ability: 'ABLE' |'WITH_DIFFICULTY';
}

export interface IAvailability {
    termId: number
    isAvailable: boolean
}

export interface ILoad {
    year: number
    maxCourses: number
}

export interface IPreferences {
    coursePreferences: ICoursePreference[]
    additionalDetails: string
    availability: IAvailability[]
    load: ILoad[]
}

const usePreferencesApi = (axios: AxiosInstance) => {
    const getPreferencesByUserId = async (userId: string): Promise<IPreferences> => {
        const { data } = await axios.get<string>(`/preferences/${userId}`);

        let preferences: IPreferences = null;
        try {
            preferences = JSON.parse(data) as IPreferences;
        } catch {
            // Do nothing.
        }

        return preferences;
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
