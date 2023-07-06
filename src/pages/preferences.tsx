import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, Grid, Paper, Select, TextField, Typography } from "@mui/material"
import AppPage from '../components/layout/AppPage'
import PageHeader from "../components/layout/PageHeader"
import PageContent from "../components/layout/PageContent"
import Breadcrumbs from "../components/layout/Breadcrumbs"
import { DataGrid } from "@mui/x-data-grid"
import PageHeaderActions from "../components/layout/PageHeaderActions"

const preferences = [
    {
        courseName: 'CSC 115',
        willingness: 'WILLING',
        ability: 'ABLE'
    }
]

const coursePreferenceColumns = []

/*

        <Dialog open={true}>
            <DialogTitle>
                <span>Professor Preferences</span>
                <br />
                <Typography component='span' variant='overline'>Term: Sept-Dec 2023</Typography>
            </DialogTitle>
                    
            <DialogContent>
                <Typography>Enter your aptitude for instructing each course.</Typography>
            </DialogContent>
        </Dialog>
    */

const PreferencesPage = () => {
    return (
        <AppPage>
            <PageHeader>
                <Breadcrumbs returnHref='/' returnLabel='Back to Profile' />
                <Box display='flex'>
                    <Box flex='1'>
                        <Typography mb={1} variant='h4'>Professor Preferences</Typography>
                        <Typography>Enter your preferences for the given teaching term.</Typography>
                    </Box>
                    <PageHeaderActions>
                        <Select label='Term'></Select>
                        <Button variant='contained'>Save</Button>
                        <Button variant='outlined'>Cancel</Button>
                    </PageHeaderActions>
                </Box>
            </PageHeader>
            <PageContent>
                <Paper>
                    <Box>
                        <Grid container spacing={3}>
                            <Grid item xs={12} lg={4}>
                                <Typography variant="h5">Course Information</Typography>
                                <Box pt={1} pb={2} maxWidth="55ch">
                                    <Typography variant="body1" color="textSecondary">Enter your instruction preference and ability for all courses.</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} lg={8}>
                                <DataGrid
                                    sx={{ p: 0 }}
                                    columns={coursePreferenceColumns}
                                    rows={[]}
                                    autoHeight
                                />
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 6 }} />

                        <Grid container spacing={3}>
                            <Grid item xs={12} lg={4}>
                                <Typography variant="h5">Additional Information</Typography>
                                <Box pt={1} pb={2} maxWidth="55ch">
                                    <Typography variant="body1" color="textSecondary">Provide any additional information that may be important for scheduling this term (Optional).</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} lg={8}>
                                <Box>
                                    <TextField
                                        name='additionalPreferences'
                                        label='Additional Preferences'
                                        variant='outlined'
                                        multiline
                                        fullWidth
                                        rows={4}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </PageContent>
        </AppPage>
    )
}

export default PreferencesPage
