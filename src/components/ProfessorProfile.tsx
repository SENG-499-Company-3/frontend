import { Avatar, Box, Button, Paper, Tab, Tabs, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from 'react'
import AppPage from "./layout/AppPage"
import PageHeader from "./layout/PageHeader"
import dynamic from "next/dynamic";
import { courseScheduleData } from "./common/sampleData/courseSchedule";
import PageContent from "./layout/PageContent";
import PreferencesViewer from "./PreferencesViewer";
import PageHeaderActions from "./layout/PageHeaderActions";
import { IUser } from "../hooks/api/useUserApi";
import { IPreferences } from "../hooks/api/usePreferencesApi";
import { useApi } from "../contexts/ApiContext";

interface IProfessorProfileProps {
    professor: IUser | null;
    canEditPreferences: boolean;
    canEditCalendar: boolean;
}

const NoSsrCalendar = dynamic(() => import("./schedule/CourseCalendar"), {
    ssr: false,
});

const ProfessorProfile = (props: IProfessorProfileProps) => {
    const [tab, setTab] = useState<number>(0);
    const [preferences, setPreferences] = useState<IPreferences>(null)
    const [isEditingPreferences, setIsEditingPreferences] = useState<boolean>(false);
    const api = useApi();

    const profCourses = courseScheduleData.filter(course => course.ProfessorID === props.professor?.id);

    const professorId = useMemo(() => props.professor?.id, [props.professor]);
    useEffect(() => {
        api.preferences.getPreferencesByUserId(professorId)
            .then((preferences) => {
                setPreferences(preferences);
            })
    }, [professorId]);

    return (
        <AppPage>
            <PageHeader>
                <Box display='flex'>
                    <Box sx={{ display: 'flex', flexFlow: 'row nowrap', gap: 2 }}>
                        <Avatar alt="Jane Doe" sx={{ width: 64, height: 64 }} />
                        <Box sx={{ lineHeight: 0.5 }}>
                            <Typography variant="h5" sx={{ fontWeight: 600 }}>{props.professor?.name ?? ''}</Typography>
                            <Typography variant="h6">{props.professor?.email ?? ''}</Typography>
                        </Box>
                    </Box>
                </Box>
                
            </PageHeader>
            <Paper elevation={0} square>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
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
                </Box>
            </Paper>
            
            <Paper elevation={0} square sx={{ display: tab === 0 ? 'unset' : 'none'}}>
                <NoSsrCalendar view="week" courses={profCourses} canEdit={props.canEditCalendar}/>
            </Paper>

            <Box sx={{ display: tab === 1 ? 'unset' : 'none' }}>
                <PageHeader>
                    <Box display='flex'>
                        <Box flex='1'>
                            <Typography mb={1} variant='h4'>Professor Preferences</Typography>
                            <Typography>Enter your preferences for the given teaching term.</Typography>
                        </Box>
                        {props.canEditPreferences && (
                            <PageHeaderActions>
                                {isEditingPreferences ? (
                                    <>
                                        <Button
                                            variant='contained'
                                            onClick={() => setIsEditingPreferences(false)}
                                        >Save</Button>
                                        <Button
                                            variant='outlined'
                                            onClick={() => {
                                                setPreferences(null);
                                                setIsEditingPreferences(false);
                                            }}
                                        >Cancel</Button>
                                    </>
                                ) : (
                                    <Button variant='contained' onClick={() => setIsEditingPreferences(true)}>Edit Preferences</Button>
                                )}
                            </PageHeaderActions>
                        )}
                    </Box>
                </PageHeader>
                <PageContent>
                    <PreferencesViewer
                        preferences={preferences}
                        editing={props.canEditPreferences && isEditingPreferences}
                        onChange={setPreferences}
                    />
                </PageContent>
            </Box>
        </AppPage>
    )
}

export default ProfessorProfile
