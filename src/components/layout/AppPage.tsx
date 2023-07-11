import { Box } from "@mui/material";
import { PropsWithChildren } from "react";

const AppPage = (props: PropsWithChildren) => {
    return <Box component='article'>{props.children}</Box>
}

export default AppPage
