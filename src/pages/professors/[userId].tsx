import ProfessorProfile from "../../components/ProfessorProfile"

const ProfessorPage = () => {

    const professor = {
        user: 'Celina Berg',
        email: 'celinaberg@uvic.ca'
    }

    return (
        <ProfessorProfile
            name={professor.user}
            email={professor.email}
            canEditCalendar={true}
            canEditPreferences={false}
        />
    )
}

export default ProfessorPage;
