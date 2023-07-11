import { Box, Button } from "@mui/material"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from "next/link";

interface IBreadcrumbsProps {
    returnHref: string
    returnLabel: string
}

const Breadcrumbs = (props: IBreadcrumbsProps) => {
    return (
        <Box mb={1} ml={-0.5}>
            <Button component={Link} href={props.returnHref} startIcon={<ArrowBackIcon />}>
                <strong>{props.returnLabel}</strong>
            </Button>
        </Box>
    );
}

export default Breadcrumbs
