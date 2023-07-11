import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import ScheduleList from '../../components/schedule/ScheduleList'
import AppPage from '../../components/layout/AppPage'
import PageHeader from '../../components/layout/PageHeader'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import PageHeaderActions from '../../components/layout/PageHeaderActions'
import PageContent from '../../components/layout/PageContent'

const HomePage = () => {
    return (
        <AppPage>
            <PageHeader>
                <Box display='flex'>
                    <Box flex='1'>
                        <Typography mb={1} variant='h4'>Professors</Typography>
                    </Box>
                    <PageHeaderActions>
                        <Button startIcon={<AddIcon />} variant='contained'>Add User</Button>
                    </PageHeaderActions>
                </Box>
            </PageHeader>
            <PageContent>
                <ScheduleList />
            </PageContent>
        </AppPage>
    )
}

export default HomePage
