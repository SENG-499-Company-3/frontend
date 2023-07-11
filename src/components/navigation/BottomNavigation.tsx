import { BottomNavigationAction, BottomNavigation as MUIBottomNavigation, Paper, styled } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import { useState } from "react";
import Link from "next/link";


const BottomNavigationActionWrapper = styled(BottomNavigationAction)(`
  color: white !important;
  &.Mui-selected {
    color: theme.palette.secondary.main;
  }
`);

const BottomNavigation = () => {
    // TODO: Add useContext for session data
    const sessionData = null;
    const [value, setValue] = useState(0);

    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <MUIBottomNavigation
                sx={{ backgroundColor: (theme) => theme.palette.primary.main, color: (theme) => theme.palette.secondary.main }}
                className="md:hidden"
                showLabels
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
            >
                <BottomNavigationActionWrapper 
                    label="Home" 
                    icon={<HomeIcon />} 
                />
            </MUIBottomNavigation>
        </Paper>
        // <div className="flex">
        //     {/* Bottom Navigation */}
        //     <div className="btm-nav bg-base-200 md:hidden">
        //         {/* Home */}
        //         <button className="hover:active">
        //             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19h3v-6h6v6h3v-9l-6-4.5L6 10v9Zm0 2q-.825 0-1.413-.588T4 19v-9q0-.475.213-.9t.587-.7l6-4.5q.275-.2.575-.3T12 3.5q.325 0 .625.1t.575.3l6 4.5q.375.275.588.7T20 10v9q0 .825-.588 1.413T18 21h-5v-6h-2v6H6Zm6-8.75Z" /></svg>
        //         </button>
        //         {/* Profile, if signed in */}
        //         {sessionData?.user &&
        //             <button className="hover:active">
        //                 {/* TODO: Add something here to show profile (Could be empty avatar?) */}
        //             </button>
        //         }
        //     </div>
        // </div>
    )
}

export default BottomNavigation;