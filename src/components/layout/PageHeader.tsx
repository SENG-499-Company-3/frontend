import { Container, Paper, PaperProps } from "@mui/material";

const PageHeader = (props: Partial<PaperProps>) => {

    const paperProps: PaperProps = {
        sx: {
            pt: 5, pb: 3
        },
        square: true,
        elevation: 0,
        ...props
    }
    return (
        <Paper {...paperProps} component='section'>
            <Container maxWidth='xl'>
                {props.children}
            </Container>
        </Paper>
    )
}

export default PageHeader