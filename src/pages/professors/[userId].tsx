import { useEffect, useState } from 'react'
import ProfessorProfile from "../../components/ProfessorProfile"
import useApi from "../../hooks/useApi";
import { IUser } from '../../hooks/api/useUserApi';
import { useRouter } from 'next/router';
import LoadingSpinner from '../../components/layout/LoadingSpinner';

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

        console.log({ userId })

        setLoading(true);
        api.user.getUserById(userId)
            .then((user: IUser) => {
                setProfessor(user);
            })
            .catch(() => {
                console.error("Failed to get professor")
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
                canEditCalendar={professor && professor.role === 'ADMIN'}
                canEditPreferences={false}
            />
            
        )
    }

    return (
        <LoadingSpinner />
    )
}

export default ProfessorPage;
