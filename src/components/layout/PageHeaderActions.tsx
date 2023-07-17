import { PropsWithChildren } from 'react';
import { Toolbar } from '@mui/material'

const PageHeaderActions = (props: PropsWithChildren) => {
    return (
        <Toolbar disableGutters sx={{ gap: 1, ml: 4 }}>{props.children}</Toolbar>
    )
}

export default PageHeaderActions
