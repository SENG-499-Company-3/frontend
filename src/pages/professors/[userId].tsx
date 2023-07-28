import { useEffect, useState } from 'react'
import ProfessorProfile from "../../components/ProfessorProfile"

import { IUser } from '../../hooks/api/useUserApi';
import { useRouter } from 'next/router';
import LoadingSpinner from '../../components/layout/LoadingSpinner';
import { useApi } from '../../contexts/ApiContext';

const ProfessorPage = () => {
    const api = useApi();
    const router = useRouter();

    const [professor, setProfessor] = useState<IUser | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const userId = router.query.userId as string;

    useEffect(() => {
        if (!userId) {
            return;
        }

        setLoading(true);
        api.user.getUserById(userId)
            .then((user: IUser) => {
                setProfessor(user);
            })
            .catch(() => {
                console.error("Failed to get professor")
                setProfessor({ id: userId } as unknown as IUser);
            })
            .finally(() => {
                setLoading(false);
            })
    }, [userId])

    // @TODO remove shortcircuit
    if (true || !loading && professor) {
        return (
            <ProfessorProfile
                professor={professor}
                canEditCalendar={professor && professor.userrole === 'ADMIN'}
                canEditPreferences={false}
            />
            
        )
    }

    return (
        <LoadingSpinner />
    )
}

export default ProfessorPage

export async function generateStaticParams() {
    const users = [];

    return users.map((user) => ({
        userId: user.id
    }))
}
