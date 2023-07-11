import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, Grid, Paper, MenuItem, Select, TextField, Typography, FormControl, InputLabel } from "@mui/material"
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { SelectChangeEvent } from '@mui/material/Select';
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { useState } from 'react';

import AppPage from './layout/AppPage'
import PageHeader from "./layout/PageHeader"
import PageContent from "./layout/PageContent"
import Breadcrumbs from "./layout/Breadcrumbs"
import PageHeaderActions from "./layout/PageHeaderActions"

interface IPreference {
    courseName: string;
    willingness: 'WILLING' | 'UNWILLING'
    ability: 'ABLE' | 'WITH_DIFFICULTY' | 'UNABLE'
}

const COURSES = [
    'CSC 111',
    'CSC 115',
    'CSC 226',
    'CSC 225',
    'CSC 230',
    'CSC 320',
    'CSC 370',
    'CSC 360',
    'MATH 101',
    'MATH 110',
    'MATH 122',
    'SENG 265',
    'SENG 310',
    'SENG 275',
    'SENG 350',
    'SENG 360',
    'ENGR 110',
];

const initialPreferences: IPreference[] = COURSES.map((course) => ({
    courseName: course,
    willingness: 'WILLING',
    ability: 'ABLE'
}));


interface IPreferencesViewerProps {
    initialPreferences: {
        coursePreferences: IPreference[]
        additionalDetails: string
    }
    // onChange: (preferences: any) => void
    editable: boolean
}

const PreferencesViewer = (props: IPreferencesViewerProps) => {
    const [preferences, setPreferences] = useState<IPreference[]>(initialPreferences);
    const [additionalDetails, setAdditionalDetails] = useState<string>();
    
    const coursePreferenceColumns: GridColDef<IPreference>[] = [
        {
            field: 'courseName',
            headerName: 'Course',
            flex: 1
        },
        {
            field: 'willingness',
            headerName: 'Willingness',
            flex: 1,
            renderCell: (params) => {
                const handleChange = (event: SelectChangeEvent) => {
                    const willingness = event.target.value as IPreference['willingness'];
                    const updatedPreferences = [...preferences];
                    updatedPreferences.find((preference) => preference.courseName === params.row.courseName).willingness = willingness;
                    setPreferences(updatedPreferences)
                };

                return (
                    <Select
                        name='willingness'
                        value={params.row.willingness}
                        onChange={handleChange}
                        variant='standard'
                    >
                        <MenuItem value='WILLING'>Willing</MenuItem>
                        <MenuItem value='UNWILLING'>Unilling</MenuItem>
                    </Select>
                )
            }
        },
        {
            field: 'ability',
            headerName: 'Ability',
            flex: 1,
            renderCell: (params) => {
                const handleChange = (event: SelectChangeEvent) => {
                    const ability = event.target.value as IPreference['ability'];
                    const updatedPreferences = [...preferences];
                    updatedPreferences.find((preference) => preference.courseName === params.row.courseName).ability = ability;
                    setPreferences(updatedPreferences)
                };

                return (
                    <Select
                        name='ability'
                        value={params.row.ability}
                        onChange={handleChange}
                        variant='standard'
                    >
                        <MenuItem value='ABLE'>Able</MenuItem>
                        <MenuItem value='WITH_DIFFICULTY'>With Difficulty</MenuItem>
                        <MenuItem value='UNABLE'>Unable</MenuItem>
                    </Select>
                )
            }
        }
    ];

    const handleSave = () => {
        const savedPreferences = JSON.stringify({
            preferences,
            additionalDetails
        });

        console.log({ savedPreferences })
    }

    const handleCancel = () => {

    }

    const PageActions = () => <>
        <Button variant='contained' onClick={() => handleSave()}>Save</Button>
        <Button variant='outlined' onClick={() => handleCancel()}>Cancel</Button>
    </>

    return (
        <Paper>
            <Box p={4}>
                <Grid container spacing={3}>
                    <Grid item xs={12} lg={4}>
                        <Typography variant="h5">Course Information</Typography>
                        <Box pt={1} pb={2} maxWidth="55ch">
                            <Typography variant="body1" color="textSecondary">Enter your instruction preference and ability for all courses.</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} lg={8}>
                        <DataGrid
                            getRowId={(row: IPreference) => row.courseName}
                            sx={{ p: 0, height: 500 }}
                            columns={coursePreferenceColumns}
                            rows={preferences}
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
                                value={additionalDetails}
                                onChange={(event) => setAdditionalDetails(event.target.value)}
                            />
                        </Box>
                    </Grid>
                </Grid>

                <Box pt={4} sx={{ display: 'flex', gap: 1, justifyContent: "flex-end" }}>
                    <PageActions />
                </Box>
            </Box>
        </Paper>
    )
}

export default PreferencesViewer
