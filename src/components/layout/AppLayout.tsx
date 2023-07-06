import { PropsWithChildren } from "react";
import { TopNavigation } from "../navigation/TopNavigation";
import { Box, Container } from "@mui/material";

interface ILayoutProps {
    onToggleThemeMode: () => void
}

const AppLayout = (props: PropsWithChildren<ILayoutProps>) => {
    return (
        <Box>
            <TopNavigation onToggleThemeMode={props.onToggleThemeMode} />
            <Box component='main'>
                {props.children}
            </Box>
        </Box>
    );
}

export default AppLayout;
