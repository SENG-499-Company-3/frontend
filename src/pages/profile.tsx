import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { Avatar, Box, Button, Typography } from "@mui/material"

const Profile = () => {
    const userContext = useContext(AuthContext)

    const [displayName, setDisplayName] = useState<string>(null);
    const [showBanner, setShowBanner] = useState<boolean>(true);

    const currentUser = userContext.currentUser();

    /* useEffect for capturing logged in user data */
    useEffect(
        () => {
            if (currentUser) {
                console.log("Is signed in");
                setDisplayName(currentUser.displayName);
                setShowBanner(currentUser.isMissingPreferenceSubmission);
            }
        },
        [currentUser]
    )

    //TODO: Figure out a colour for dark mode and align things properly
    function Banner() {
        return (
            <div style={{ width: '100%' }}>
                <Box sx={{
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#33587A' : '#69B4FA'),
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div className="flex">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                        <div className="gap-2 px-4">You haven't filled out your annual survey yet.
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outlined" color="inherit">FILL SURVEY</Button>
                        <button onClick={() => { setShowBanner(false); }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                        </button>
                    </div>
                </Box>
            </div>
        )
    }

    return (
        <div className="flex flex-col w-full h-full md:px-32 py-8 gap-2">
            {/*Conditionally render submission reminder box: ADD !userContext.isAdmin() */ }
            {showBanner && <Banner />}
            <div className="flex h-[8rem] w-full justify-center">
                <div className="flex items-center">
                    {/* <Avatar alt={userContext.currentUser?.displayName} sx={{ width: 96, height: 96 }} /> */}
                    <Avatar alt="Jane Doe" sx={{ width: 128, height: 128 }} />
                </div>
                <div className="flex justify-center flex-col px-8 py-2">
                    {/* <Typography variant="h5" sx={{fontWeight: 600}}>{userContext.currentUser?.displayName} ({userContext.currentUser?.type})</Typography> */}
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>Jane Doe (Admin)</Typography>
                    {/* <Typography variant="h6">{userContext.currentUser?.emailAddress</Typography> */}
                    <Typography variant="h6">Jan.Doe@uvic.ca</Typography>
                </div>
            </div>
            <div className="flex w-full h-full">
                {/* userContext.isAdmin() */}
                {true ?
                    <div>
                        {/* TODO: add admin content for profile */}
                    </div>
                    :
                    <div>
                        {/* TODO: add professor content for profile */}
                    </div>
                }
            </div>
        </div>
    )
}

export default Profile
