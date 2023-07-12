import { useContext } from "react"
import ProfessorProfile from "../components/ProfessorProfile"
import { AuthContext } from "../contexts/AuthContext"
import { IAuthenticatedUser } from "../types/auth";

const ProfessorProfilePage = () => {
    const authContext = useContext(AuthContext);
    const currentUser: IAuthenticatedUser | null = authContext.currentUser();

    return (
        <ProfessorProfile
            name={currentUser?.name ?? ''}
            email={currentUser?.email ?? ''}
            canEditCalendar={false}
            canEditPreferences={true}
        />
    )
}

export default ProfessorProfilePage
