import axios from 'axios';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import useAuthApi from './api/useAuthApi';
import { AuthContext } from '../contexts/AuthContext';
import useUserApi from './api/useUserApi';
import useClassroomApi from './api/useClassroomApi';

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
			},
			baseURL
		});
	}, [authContext, baseURL]);

	const axiosUserInstance = useMemo(() => {
		return axios.create({
			baseURL
		});
	}, [baseURL]);

	const auth = useAuthApi(axiosInstance);
	const user = useUserApi(axiosUserInstance);
	const classroom = useClassroomApi(axiosInstance);

	return {

		auth,
		user,
		classroom
	}
}

export default useApi
