import { AxiosInstance, AxiosResponse } from 'axios'

export interface ITerm {
    id: number
    year: number
    month: number
}


const useTermsApi = (axios: AxiosInstance) => {
    const listTerms = async (): Promise<ITerm[]> => {
        const { data } = await axios.get('/terms');

        return data;
    }

    return {
        listTerms
    }
}

export default useTermsApi;
