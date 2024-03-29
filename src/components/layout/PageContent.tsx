import { Box, Container } from "@mui/material";
import { PropsWithChildren } from "react";

const PageContent = (props: PropsWithChildren) => {

    return (
        <Box py={4} component='section'>
            <Container maxWidth='xl' sx={{ position: 'relative' }}>
                {props.children}
            </Container>
        </Box>
    )
}

export default PageContent
