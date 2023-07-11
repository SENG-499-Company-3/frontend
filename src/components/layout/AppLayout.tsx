import { PropsWithChildren, useContext, useState } from "react";
import { TopNavigation } from "../navigation/TopNavigation";
import { Box, Container } from "@mui/material";
import { SideNavigation } from "../navigation/SideNavigation";
import BottomNavigation from "../navigation/BottomNavigation";
import { AuthContext } from "../../contexts/AuthContext";

interface ILayoutProps {
    onToggleThemeMode: () => void
}

const AppLayout = (props: PropsWithChildren<ILayoutProps>) => {
    const authContext = useContext(AuthContext);
    const [isSideNavigationShown, setIsSideNavigationShown] = useState(false);

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: (theme) => theme.palette.mode === 'light' ? '#EEE' : '#444' }}>
            <TopNavigation onToggleSideNav={() => {setIsSideNavigationShown(prev => !prev)}} onToggleThemeMode={props.onToggleThemeMode} />
            {authContext.isAuthenticated() &&
                <>
                    <SideNavigation isShown={isSideNavigationShown} />
                    <BottomNavigation />
                </>
            }
            <Box component='main'>
                {props.children}
            </Box>
        </Box>
    );
}

export default AppLayout;
