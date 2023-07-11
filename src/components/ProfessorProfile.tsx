import { Avatar, Box, Paper, Tab, Tabs, Typography } from "@mui/material"
import { useState } from 'react'
import AppPage from "./layout/AppPage"
import PageHeader from "./layout/PageHeader"
import dynamic from "next/dynamic";
import { courseScheduleData } from "./common/sampleData/courseSchedule";
import PageContent from "./layout/PageContent";
import PreferencesViewer from "./PreferencesViewer";

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
    const [tab, setTab] = useState<number>(0);

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
                    value={tab}
                    indicatorColor="secondary"
                    textColor="inherit"
                    variant="fullWidth"
                    onChange={(_event, value) => setTab(value)}
                    >
                    <Tab label="Schedule" />
                    <Tab label="Preferences" />
                </Tabs>
            </Paper>
            {tab === 0 && (
                <Paper elevation={0} square>
                    <NoSsrCalendar view="week" courses={courseScheduleData} />
                </Paper>
            )}
            {tab === 1 && (
                <PageContent>
                    <PreferencesViewer initialPreferences={null} editable={props.canEditPreferences} />
                </PageContent>
            )}
        </AppPage>
    )
}

export default ProfessorProfile
