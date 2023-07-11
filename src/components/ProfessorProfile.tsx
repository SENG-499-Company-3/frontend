import { Avatar, Box, Paper, Tab, Tabs, Typography } from "@mui/material"
import AppPage from "./layout/AppPage"
import PageHeader from "./layout/PageHeader"
import dynamic from "next/dynamic";
import { courseScheduleData } from "./common/sampleData/courseSchedule";

interface IProfessorProfileProps {
    name: string;
    email: string;
    canEditPreferences: boolean;
    canEditCalendar: boolean;
}

const NoSsrCalendar = dynamic(() => import("./schedule/CourseCalendar"), {
    ssr: false,
});

const ProfessorProfile = (props: IProfessorProfileProps) => {
    return (
        <AppPage>
            <PageHeader>
                <Box display='flex'>
                    <Box sx={{ display: 'flex', flexFlow: 'row nowrap', gap: 2 }}>
                        <Avatar alt="Jane Doe" sx={{ width: 64, height: 64 }} />
                        <Box sx={{ lineHeight: 0.5 }}>
                            <Typography variant="h5" sx={{ fontWeight: 600 }}>{props.name}</Typography>
                            <Typography variant="h6">{props.email}</Typography>
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
