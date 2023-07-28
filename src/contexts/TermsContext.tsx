import { PropsWithChildren, createContext, useState, useEffect } from 'react'
import { ITerm } from '../hooks/api/useTermsApi';
import { useApi } from './ApiContext';

interface ITermsContext {
    terms: () => ITerm[];
    fetchTerms: () => Promise<void>
}

export const TermsContext = createContext<ITermsContext>({
    terms: () => [],
    fetchTerms: () => Promise.resolve()
});

export const defaultTerms: ITerm[] = [
    {
        id: 1,
        month: 5,
        year: 2023
    },
    {
        id: 2,
        month: 9,
        year: 2023
    },
    {
        id: 3,
        month: 1,
        year: 2024
    }
]

export const TermsContextProvider = (props: PropsWithChildren) => {
    const [terms, setTerms] = useState<ITerm[]>([]);
    const api = useApi();

    const fetchTerms = async () => {
        return api.terms.listTerms()
            .then((terms) => {
                setTerms(terms);
            })
            .catch(() => {
                setTerms(defaultTerms)
            })
    }

    const termsContext: ITermsContext = {
        terms: () => terms,
        fetchTerms
    }
    
    useEffect(() => {
        fetchTerms();
    }, []);

    return (
        <TermsContext.Provider value={termsContext}>
            {props.children}
        </TermsContext.Provider>
    )
}

