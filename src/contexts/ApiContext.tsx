import axios from 'axios';
import { createContext, useContext, useCallback, useEffect, useMemo, useState, PropsWithChildren } from 'react';
import useAuthApi, { USER_TOKEN } from '../hooks/api/useAuthApi';
import { AuthContext } from '../contexts/AuthContext';
import useUserApi from '../hooks/api/useUserApi';
import usePreferencesApi from '../hooks/api/usePreferencesApi';
import useClassroomApi from '../hooks/api/useClassroomApi';
import useScheduleApi from '../hooks/api/useScheduleApi';
import useCoursesApi from '../hooks/api/useCoursesApi';
import useTermsApi from '../hooks/api/useTermsApi';

interface IApiContext {
    auth: ReturnType<typeof useAuthApi>
    user: ReturnType<typeof useUserApi>
    preferences: ReturnType<typeof usePreferencesApi>
    classroom: ReturnType<typeof useClassroomApi>
    courses: ReturnType<typeof useCoursesApi>
    schedule: ReturnType<typeof useScheduleApi>
    terms: ReturnType<typeof useTermsApi>
    userToken: string
    setUserToken: (token: string) => void
}

const ApiContext = createContext<IApiContext>({} as IApiContext)

export const useApi = () => {
    const apiContext = useContext(ApiContext)
    return apiContext;
}

export const ApiContextProvider = (props: PropsWithChildren) => {
	const [userToken, setUserToken] = useState<string | null>();
	console.log('useApi.userToken:', userToken)

	/**
	 * For now, we'll use a hardcoded API host. But in the future, we will need to pull this in
	 * from an environment variable of some kind.
	 */
	const API_HOST = 'http://localhost:3001';// 'http://52.39.88.189:3001';
	const baseURL = `${API_HOST}`; // To be changed later if needed

	const axiosInstance = axios.create({
		headers: {
			// Authorization: `Bearer ${authContext.userToken()}`
			Authorization: userToken
		},
		baseURL
	})

	const auth = useAuthApi(axiosInstance);
	const user = useUserApi(axiosInstance);
	const preferences = usePreferencesApi(axiosInstance);
	const classroom = useClassroomApi(axiosInstance);
	const courses = useCoursesApi(axiosInstance);
	const schedule = useScheduleApi(axiosInstance);
	const terms = useTermsApi(axiosInstance);

    const apiContext: IApiContext = ({
		// _axiosInstance: axiosInstance,
		auth,
		user,
		classroom,
		preferences,
		courses,
		schedule,
		terms,
		userToken,
		setUserToken
	})

    return <ApiContext.Provider value={apiContext}>
        {props.children}
    </ApiContext.Provider>
}
