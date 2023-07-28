import { useContext } from "react"
import ProfessorProfile from "../components/ProfessorProfile"
import { AuthContext, withAuthGuard } from "../contexts/AuthContext"
import { IAuthenticatedUser } from "../types/auth";
import LoadingSpinner from "../components/layout/LoadingSpinner";
import { IUser } from "../hooks/api/useUserApi";

const ProfessorProfilePage = () => {
    const authContext = useContext(AuthContext);
    const currentUser = authContext.currentUser() as unknown as IUser | null;

    if (!currentUser) {
        return <LoadingSpinner />
    }

    return (
        <ProfessorProfile
            professor={currentUser}
            canEditCalendar={false}
            canEditPreferences={true}
        />
    )
}

export default withAuthGuard(ProfessorProfilePage)
