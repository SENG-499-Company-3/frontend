import { Box } from "@mui/material";
import { useRouter } from 'next/router';

interface ISideNavigationProps {
    isShown: boolean
}

export const SideNavigation = (props: ISideNavigationProps) => {
    const router = useRouter();

    return (
        <Box
            sx={{ backgroundColor: (theme) => theme.palette.mode === 'light' ? theme.palette.primary.light : '#444', color: "white" }}
            className={`fixed flex-col h-full z-40 flex transition-all duration-400 ease-out ${props.isShown ? 'w-64' : 'w-0 invisible'}`}
        >
            <button onClick={()=>router.push("/")} className={`btn btn-ghost m-2 flex flex-col content-start`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19h3v-6h6v6h3v-9l-6-4.5L6 10v9Zm0 2q-.825 0-1.413-.588T4 19v-9q0-.475.213-.9t.587-.7l6-4.5q.275-.2.575-.3T12 3.5q.325 0 .625.1t.575.3l6 4.5q.375.275.588.7T20 10v9q0 .825-.588 1.413T18 21h-5v-6h-2v6H6Zm6-8.75Z" /></svg>
                <div className={`text-lg normal-case ml-2 ${props.isShown ? 'block' : 'hidden'}`}>Dashboard</div>
            </button>
            {/* TODO: change to professors list link */}
            <button onClick={()=>router.push("/")} className={`btn btn-ghost m-2 flex flex-col content-start`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19h3v-6h6v6h3v-9l-6-4.5L6 10v9Zm0 2q-.825 0-1.413-.588T4 19v-9q0-.475.213-.9t.587-.7l6-4.5q.275-.2.575-.3T12 3.5q.325 0 .625.1t.575.3l6 4.5q.375.275.588.7T20 10v9q0 .825-.588 1.413T18 21h-5v-6h-2v6H6Zm6-8.75Z" /></svg>
                <div className={`text-lg normal-case ml-2 ${props.isShown ? 'block' : 'hidden'}`}>Professors</div>
            </button>
        </Box>
    )
}