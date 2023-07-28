import { AxiosInstance, AxiosResponse } from 'axios'

export interface ITerm {
    id: number
    year: number
    month: number
}


const useTermsApi = (axios: AxiosInstance) => {
    const listTerms = async (): Promise<ITerm[]> => {
        const { data } = await axios.get('/terms');

        return data
            .map(term => {
                let month = 1;
                switch (term.term) {
                    case 'Spring':
                        month = 1;
                        break;
                    case 'Fall':
                        month = 9;
                        break;
                    case 'Summer':
                        month = 5;
                        break
                }

                return {
                    id: term._id,
                    year: term.year,
                    month
                }
            })
            .filter(term => term.year >= 2023);
    }

    return {
        listTerms
    }
}

export default useTermsApi;
