import React from 'react'
import ScheduleList from '../components/schedule/ScheduleList'
import AppPage from '../components/layout/AppPage'
import PageHeader from '../components/layout/PageHeader'
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import PageHeaderActions from '../components/layout/PageHeaderActions'
import PageContent from '../components/layout/PageContent'

const HomePage = () => {
    return (
        <AppPage>
            <PageHeader>
                <Box display='flex'>
                    <Box flex='1'>
                        <Typography mb={1} variant='h4'>Admin Dashboard</Typography>
                        <Typography>View current course schedules.</Typography>
                    </Box>
                    <PageHeaderActions>
                        <FormControl>
                            <InputLabel id='term-select-label'>Term</InputLabel>
                            <Select
                                label='Term'
                                value='FALL2023'
                                labelId='term-select-label'
                                variant="outlined"
                            >
                                <MenuItem value='FALL2023'>Fall 2023</MenuItem>
                            </Select>
                        </FormControl>
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
