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

interface ICoursePreference {
    courseName: string;
    willingness: 'WILLING' | 'UNWILLING'
    ability: 'ABLE' | 'WITH_DIFFICULTY' | 'UNABLE'
}

export interface IPreferences {
    coursePreferences: ICoursePreference[]
    additionalDetails: string
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

export const defaultCoursePreferences: ICoursePreference[] = COURSES.map((course) => ({
    courseName: course,
    willingness: 'WILLING',
    ability: 'ABLE'
}));

export const defaultPreferences: IPreferences = {
    coursePreferences: defaultCoursePreferences,
    additionalDetails: ''
}


interface IPreferencesViewerProps {
    preferences: IPreferences
    onChange: (preferences: IPreferences) => void
    editing: boolean
}

const PreferencesViewer = (props: IPreferencesViewerProps) => {
    const coursePreferenceColumns: GridColDef<ICoursePreference>[] = [
        {
            field: 'courseName',
            headerName: 'Course',
            flex: 1
        },
        {
            field: 'willingness',
            headerName: 'Willingness',
            flex: 1,
            valueFormatter: !props.editing && ((params) => {
                return {
                    'WILLING': 'Willing',
                    'UNWILLING': 'Unwilling'
                }[params.value]
            }),
            renderCell: props.editing && ((params) => {
                const handleChange = (event: SelectChangeEvent) => {
                    const willingness = event.target.value as ICoursePreference['willingness'];
                    const updatedCoursePreferences = [...props.preferences.coursePreferences];
                    updatedCoursePreferences.find((preference) => preference.courseName === params.row.courseName).willingness = willingness;
                    props.onChange({ ...props.preferences, coursePreferences: updatedCoursePreferences });
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
            })
        },
        {
            field: 'ability',
            headerName: 'Ability',
            flex: 1,
            valueFormatter: !props.editing && ((params) => {
                return {
                    'ABLE': 'Able',
                    'WITH_DIFFICULTY': 'With Difficulty',
                    'UNABLE': 'Unable'
                }[params.value]
            }),
            renderCell: props.editing && ((params) => {
                const handleChange = (event: SelectChangeEvent) => {
                    const ability = event.target.value as ICoursePreference['ability'];
                    const updatedCoursePreferences = [...props.preferences.coursePreferences];
                    updatedCoursePreferences.find((preference) => preference.courseName === params.row.courseName).ability = ability;
                    props.onChange({ ...props.preferences, coursePreferences: updatedCoursePreferences });
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
            })
        }
    ];

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
                            getRowId={(row: ICoursePreference) => row.courseName}
                            sx={{ p: 0, height: 500 }}
                            columns={coursePreferenceColumns}
                            rows={props.preferences.coursePreferences}
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
                                disabled={!props.editing}
                                value={props.preferences.additionalDetails}
                                onChange={(event) => {
                                    props.onChange({ ...props.preferences, additionalDetails: event.target.value });
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    )
}

export default PreferencesViewer
