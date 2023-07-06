import { Box, Container } from "@mui/material";
import { PropsWithChildren } from "react";

const PageContent = (props: PropsWithChildren) => {

    return (
        <Box py={4} component='section' sx={{ backgroundColor: '#EEE' }}>
            <Container maxWidth='xl'>
                {props.children}
            </Container>
        </Box>
    )
}

export default PageContent
