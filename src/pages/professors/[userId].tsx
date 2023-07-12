import ProfessorProfile from "../../components/ProfessorProfile"

const ProfessorPage = () => {

    const professor = {
        user: 'Jane Doe',
        email: 'janedoe@uvic.ca'
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

export default ProfessorPage
