import { PropsWithChildren, useContext, useState, useEffect } from "react";
import { TopNavigation } from "../navigation/TopNavigation";
import { Box, Container } from "@mui/material";
import { AuthContext } from "../../contexts/AuthContext";
import useApi from "../../hooks/useApi";

interface ILayoutProps {
    onToggleThemeMode: () => void
}

const AppLayout = (props: PropsWithChildren<ILayoutProps>) => {
    const authContext = useContext(AuthContext);
    const authApi = useApi().auth;
    const [isSideNavigationShown, setIsSideNavigationShown] = useState(false);

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: (theme) => theme.palette.mode === 'light' ? '#EEE' : '#444' }}>
            <TopNavigation onToggleThemeMode={props.onToggleThemeMode} />
            <Box component='main'>
                {props.children}
            </Box>
        </Box>
    );
}

export default AppLayout;
