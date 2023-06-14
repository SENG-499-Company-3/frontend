import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Avatar } from "@mui/material";

interface IBottomNavigationProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export const BottomNavigation = (props: IBottomNavigationProps) => {
    const router = useRouter()
    const userContext = useContext(AuthContext)

    const handleClick = (location) => {
        router.push(location)
        props.setActiveTab(location)
    }

    return (
        <div className="flex">
            {/* Bottom Navigation */}
            <div className="btm-nav bg-base-200 md:hidden">
                {/* Home */}
                <button className={`hover:active ${props.activeTab == "/" ? "active" : ""}`} onClick={() => handleClick("/")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19h3v-6h6v6h3v-9l-6-4.5L6 10v9Zm0 2q-.825 0-1.413-.588T4 19v-9q0-.475.213-.9t.587-.7l6-4.5q.275-.2.575-.3T12 3.5q.325 0 .625.1t.575.3l6 4.5q.375.275.588.7T20 10v9q0 .825-.588 1.413T18 21h-5v-6h-2v6H6Zm6-8.75Z" /></svg>
                </button>
                {/* Profile, if signed in */}
                {userContext.currentUser &&
                    <button className={`hover:active ${props.activeTab == "/profile" ? "active" : ""}`} onClick={() => handleClick("/profile")}>
                        <Avatar alt={"Jane Doe"} sx={{ width: 24, height: 24 }} />
                    </button>
                }
            </div>
        </div>
    )
}