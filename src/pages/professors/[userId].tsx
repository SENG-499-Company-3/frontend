import { useContext } from "react"
import { AuthContext } from "../../contexts/AuthContext"
import { Avatar, Box, Paper, Tab, Tabs, Typography } from "@mui/material"
import AppPage from "../../components/layout/AppPage"
import PageHeader from "../../components/layout/PageHeader"
import PageHeaderActions from "../../components/layout/PageHeaderActions"
import PageContent from "../../components/layout/PageContent"
import { courseScheduleData } from "../../components/common/sampleData/courseSchedule"
import dynamic from "next/dynamic"

const NoSsrCalendar = dynamic(() => import("../../components/schedule/CourseCalendar"), {
    ssr: false,
});

const ProfessorProfile = () => {
    return (
        <AppPage>
            <PageHeader>
                <Box display='flex'>
                    <Box sx={{ display: 'flex', flexFlow: 'row nowrap', gap: 2 }}>
                        <Avatar alt="Jane Doe" sx={{ width: 64, height: 64 }} />
                        <Box sx={{ lineHeight: 0.5 }}>
                            <Typography variant="h5" sx={{ fontWeight: 600 }}>Jane Doe (Admin)</Typography>
                            <Typography variant="h6">Jan.Doe@uvic.ca</Typography>
                        </Box>
                    </Box>
                </Box>
                
            </PageHeader>
            <Paper elevation={0} square>
                <Tabs
                    value={0}
                    indicatorColor="secondary"
                    textColor="inherit"
                    variant="fullWidth"
                    >
                    <Tab label="Schedule" />
                    <Tab label="Preferences" />
                </Tabs>
            </Paper>
            <Paper elevation={0} square>
                <NoSsrCalendar view="week" courses={courseScheduleData} />
            </Paper>
        </AppPage>
    )
}

export default ProfessorProfile
