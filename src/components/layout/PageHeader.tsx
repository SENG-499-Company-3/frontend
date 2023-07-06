import { Box, Container } from "@mui/material";
import { PropsWithChildren } from "react";

const PageHeader = (props: PropsWithChildren) => {
    return (
        <Box py={2} component='section'>
            <Container maxWidth='xl' sx={{}}>
                {props.children}
            </Container>
        </Box>
    )
}

export default PageHeader