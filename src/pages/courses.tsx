import { useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import AppPage from '../components/layout/AppPage'
import PageHeader from '../components/layout/PageHeader'
import { Box, Button, Typography, Paper, Container } from '@mui/material'
import PageHeaderActions from '../components/layout/PageHeaderActions'
import PageContent from '../components/layout/PageContent'
import CoursesTable from '../components/CoursesTable';
import { withAuthGuard } from '../contexts/AuthContext';

const CoursesPage = () => {
    const [showNewCourseDialog, setShowNewCourseDialog] = useState<boolean>(false);

    return (
        <>
            
            <AppPage>
                <PageHeader>
                    <Box display='flex'>
                        <Box flex='1'>
                            <Typography mb={1} variant='h4'>Courses</Typography>
                            <Typography>Add and remove courses.</Typography>
                        </Box>
                        <PageHeaderActions>
                            <Button onClick={() => setShowNewCourseDialog(true)} startIcon={<AddIcon />} variant='contained'>Add Course</Button>
                        </PageHeaderActions>
                    </Box>
                </PageHeader>
                <PageContent>
                    <Container maxWidth='md'>
                        <Paper sx={{ p: 1 }}>
                            <CoursesTable
                                showNewCourseDialog={showNewCourseDialog}
                                onCloseNewCourseDialog={() => setShowNewCourseDialog(false)}
                                DataGridProps={{
                                    sx: {
                                        height: 600,
                                        border: 0
                                    }
                                }}
                            />
                        </Paper>
                    </Container>
                </PageContent>
            </AppPage>
        </>
    )
}

export default withAuthGuard(CoursesPage)
