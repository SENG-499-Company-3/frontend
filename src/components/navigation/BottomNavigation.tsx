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
    )
}

export default BottomNavigation;