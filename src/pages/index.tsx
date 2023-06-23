import React, { useContext, useEffect, useState } from 'react';
import ScheduleList from '../components/schedule/ScheduleList'
import { AuthContext } from '../contexts/AuthContext';

const HomePage = () => {
    const authContext = useContext(AuthContext);
    const currentUser = authContext.currentUser();
    const [displayName, setDisplayName] = useState<string>(null);

    /* useEffect for capturing logged in user data */
    useEffect(
        () => {
            if (currentUser) {
                console.log("Is signed in");
                setDisplayName(currentUser.displayName);
            }
        },
        [currentUser]
    )
    /*SL: I have this piece of code that worked before, but now it's doing something weird with the arrangement?
    return (
        <>
        <div>
        {authContext.isAuthenticated() ?
            <div>Please log in</div>
        :
            <>
                <div>Welcome, {displayName}</div>
                <div>
                    <ScheduleList />
                </div>
            </>
        }
        </div >
        </>
    )
    */
    return (
        <ScheduleList />
    )
}

export default HomePage
