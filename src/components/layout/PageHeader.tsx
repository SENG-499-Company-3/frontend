import { Container, Paper } from "@mui/material";
import { PropsWithChildren } from "react";

const PageHeader = (props: PropsWithChildren) => {
    return (
        <Paper sx={{ py: 2 }} component='section' elevation={0}>
            <Container maxWidth='xl'>
                {props.children}
            </Container>
        </Paper>
    )
}

export default PageHeader