import { PropsWithChildren, useContext, useState, useEffect } from "react";
import { TopNavigation } from "../navigation/TopNavigation";
import { Box, Container } from "@mui/material";
import { AuthContext } from "../../contexts/AuthContext";
import { useApi } from "../../contexts/ApiContext";


interface ILayoutProps {
    onToggleThemeMode: () => void
}

const AppLayout = (props: PropsWithChildren<ILayoutProps>) => {
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
