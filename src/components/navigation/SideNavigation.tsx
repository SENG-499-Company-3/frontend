import { useState } from "react";

export const SideNavigation = () => {
    // TODO: Add useContext for session data
    const sessionData = null;

    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            className={`fixed flex-col h-full pt-[4rem] z-40 bg-base-200 hidden md:flex transition-all duration-400 ease-out ${isExpanded ? 'w-64' : 'w-[4.6rem]'}`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            {/* Home */}
            <button className={`btn btn-ghost m-2 flex flex-col content-start`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19h3v-6h6v6h3v-9l-6-4.5L6 10v9Zm0 2q-.825 0-1.413-.588T4 19v-9q0-.475.213-.9t.587-.7l6-4.5q.275-.2.575-.3T12 3.5q.325 0 .625.1t.575.3l6 4.5q.375.275.588.7T20 10v9q0 .825-.588 1.413T18 21h-5v-6h-2v6H6Zm6-8.75Z" /></svg>
                <div className={`text-lg normal-case ml-2 ${isExpanded ? 'block' : 'hidden'}`}>Home</div>
            </button>
            {/* Profile, if signed in */}
            {sessionData?.user &&
                <button className={`btn btn-ghost m-2 flex flex-col content-start`}>
                    <div className={`text-lg normal-case ml-2 ${isExpanded ? 'block' : 'hidden'}`}>Profile</div>
                </button>
            }
        </div>
    )
}