import { Avatar, Box, Button, Paper, Tab, Tabs, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from 'react'
import AppPage from "./layout/AppPage"
import PageHeader from "./layout/PageHeader"
import dynamic from "next/dynamic";
import PageContent from "./layout/PageContent";
import PreferencesViewer from "./PreferencesViewer";
import PageHeaderActions from "./layout/PageHeaderActions";
import { IUser } from "../hooks/api/useUserApi";
import { IPreferences } from "../hooks/api/usePreferencesApi";
import { useApi } from "../contexts/ApiContext";
import { LoadingButton } from "@mui/lab";
import { defaultCourseScheduleData } from "./common/sampleData/courseSchedule";

interface IProfessorProfileProps {
    professor: IUser | null;
    canEditPreferences: boolean;
    canEditCalendar: boolean;
}

const NoSsrCalendar = dynamic(() => import("./schedule/CourseCalendar"), {
    ssr: false,
});

const ProfessorProfile = (props: IProfessorProfileProps) => {
    console.log('prof profile props:', props)
    const [tab, setTab] = useState<number>(1);
    const [preferences, setPreferences] = useState<IPreferences>(null);
    const [editablePreferences, setEditablePreferences] = useState<IPreferences>(null);
    const [saving, setSaving] = useState<boolean>(false)
    const [isEditingPreferences, setIsEditingPreferences] = useState<boolean>(false);
    const api = useApi();

    const profCourses = defaultCourseScheduleData.filter(course => course.ProfessorID === props.professor?._id);

    const professorEmail = useMemo(() => props.professor?.email, [props.professor]);

    const getPreferences = useCallback(() => {
        return api.preferences.getPreferencesByEmail(professorEmail).then((preferences) => {
                setPreferences(preferences);
                setEditablePreferences(preferences);
            })
        
    }, [professorEmail])

    useEffect(() => {
        getPreferences();
    }, [professorEmail]);

    const handleSavePreferences = () => {
        setSaving(true);

        api.preferences.savePreferences(editablePreferences)
            .then(() => {
                // getPreferences();
                setPreferences(editablePreferences);
            })
            .finally(() => {
                setIsEditingPreferences(false);
                setSaving(false);
            })   
    }

    const handleCancelEdit = () => {
        setEditablePreferences(preferences);
        setIsEditingPreferences(false);
    }

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
                                        <LoadingButton
                                            loading={saving}
                                            variant='contained'
                                            onClick={() => handleSavePreferences()}
                                        >Save</LoadingButton>
                                        <LoadingButton
                                            loading={saving}
                                            variant='outlined'
                                            onClick={() => handleCancelEdit()}
                                        >Cancel</LoadingButton>
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
                        preferences={editablePreferences}
                        editing={props.canEditPreferences && isEditingPreferences}
                        onChange={setEditablePreferences}
                    />
                </PageContent>
            </Box>
        </AppPage>
    )
}

export default ProfessorProfile
