import axios from 'axios';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import useAuthApi, { USER_TOKEN } from './api/useAuthApi';
import { AuthContext } from '../contexts/AuthContext';
import useUserApi from './api/useUserApi';
import usePreferencesApi from './api/usePreferencesApi';
import useClassroomApi from './api/useClassroomApi';
import useScheduleApi from './api/useScheduleApi';
import useCoursesApi from './api/useCoursesApi';
import useTermsApi from './api/useTermsApi';

interface IApiHostContext {
	REACT_API_HOST: string;
}

const ApiHostContext = createContext<IApiHostContext>({
	REACT_API_HOST: ''
});

const useApi = () => {
	/**
	 * For now, we'll use a hardcoded API host. But in the future, we will need to pull this in
	 * from an environment variable of some kind.
	 */
	const API_HOST = 'http://localhost:3001';
	const baseURL = `${API_HOST}`; // To be changed later if needed

	const authContext = useContext(AuthContext);

	const axiosInstance = useMemo(() => {
		return axios.create({
			headers: {
				Authorization: `Bearer ${authContext.userToken()}`
				// Authorization: `Bearer ${localStorage ? localStorage.getItem(USER_TOKEN) : authContext.userToken()}`
			},
			baseURL
		});
	}, [authContext.userToken, baseURL]);

	const axiosUserInstance = useMemo(() => {
		return axios.create({
			baseURL
		});
	}, [baseURL]);

	const auth = useAuthApi(axiosInstance);
	const user = useUserApi(axiosUserInstance);
	const preferences = usePreferencesApi(axiosInstance);
	const classroom = useClassroomApi(axiosInstance);
	const courses = useCoursesApi(axiosInstance);
	const schedule = useScheduleApi(axiosInstance);
	const terms = useTermsApi(axiosInstance);

	useEffect(() => {
		if (!authContext.currentUser()) {
			auth.self();
		}
	}, [axiosInstance])
	
	return {
		// _axiosInstance: axiosInstance,
		auth,
		user,
		classroom,
		preferences,
		courses,
		schedule,
		terms
	}
}

export default useApi
