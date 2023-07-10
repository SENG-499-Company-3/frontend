import { Container, Paper } from "@mui/material";
import { PropsWithChildren } from "react";

const PageHeader = (props: PropsWithChildren) => {
    return (
        <Paper sx={{ pt: 5, pb: 3 }} component='section' square elevation={0}>
            <Container maxWidth='xl'>
                {props.children}
            </Container>
        </Paper>
    )
}

export default PageHeader