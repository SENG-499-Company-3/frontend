import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { Avatar, Typography } from "@mui/material"

const Profile = () => {
    const userContext = useContext(AuthContext)

    return (
        <div className="flex flex-col w-full h-full md:px-32 py-8 gap-2">
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
