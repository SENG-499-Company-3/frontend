import { PropsWithChildren } from 'react';
import { Toolbar } from '@mui/material'

const PageHeaderActions = (props: PropsWithChildren) => {
    return (
        <Toolbar sx={{ gap: 1 }}>{props.children}</Toolbar>
    )
}

export default PageHeaderActions
