import { PropsWithChildren, createContext, useState, useEffect } from 'react'
import useApi from '../hooks/useApi'
import { ITerm } from '../hooks/api/useTermsApi';

interface ITermsContext {
    terms: () => ITerm[]
}

export const TermsContext = createContext<ITermsContext>({
    terms: () => []
});

const defaultTerms: ITerm[] = [
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

    const termsContext: ITermsContext = {
        terms: () => terms
    }
    
    useEffect(() => {
        /*
        api.terms.listTerms().then((terms) => {
            setTerms(terms);
        });
        */
       setTerms(defaultTerms)
    }, []);

    return (
        <TermsContext.Provider value={termsContext}>
            {props.children}
        </TermsContext.Provider>
    )
}

