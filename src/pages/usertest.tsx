import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"

const UserTestPage = () => {
    const userContext = useContext(AuthContext);

    return (
        <div>
            <h1>User context test</h1>
            <p>Here is the data for the currently signed-in user:</p>
            <div>{JSON.stringify(userContext.currentUser)}</div>
        </div>
    )
}

export default UserTestPage
