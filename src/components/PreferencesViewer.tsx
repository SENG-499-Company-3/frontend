import {
    Box,
    Divider,
    Grid,
    Paper,
    MenuItem,
    Select,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    RadioGroup,
    Radio,
    FormControlLabel
} from "@mui/material"
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { SelectChangeEvent } from '@mui/material/Select';
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { useState, useContext } from 'react';

import AppPage from './layout/AppPage'
import PageHeader from "./layout/PageHeader"
import PageContent from "./layout/PageContent"
import Breadcrumbs from "./layout/Breadcrumbs"
import PageHeaderActions from "./layout/PageHeaderActions"
import { ICourse } from "../hooks/api/useCoursesApi";
import { getMonthStringFromNumber, makeCourseName } from "../utils/helper";
import { ICoursePreference, IPreferences } from "../hooks/api/usePreferencesApi";
import { ITerm } from "../hooks/api/useTermsApi";
import useApi from "../hooks/useApi";
import { TermsContext } from "../contexts/TermsContext";

const defaultCourses: ICourse[] = [
    {
        courseId: 1,
        courseCode: 'CSC',
        courseNumber: '111',
        courseName: 'Course name',
    },
    {
        courseId: 2,
        courseCode: 'CSC',
        courseNumber: '115',
        courseName: 'Course name',
    },
    {
        courseId: 3,
        courseCode: 'CSC',
        courseNumber: '226',
        courseName: 'Course name',
    },
    {
        courseId: 4,
        courseCode: 'CSC',
        courseNumber: '225',
        courseName: 'Course name',
    },
    {
        courseId: 5,
        courseCode: 'CSC',
        courseNumber: '230',
        courseName: 'Course name',
    },
    {
        courseId: 6,
        courseCode: 'CSC',
        courseNumber: '320',
        courseName: 'Course name',
    },
    {
        courseId: 7,
        courseCode: 'CSC',
        courseNumber: '370',
        courseName: 'Course name',
    },
    {
        courseId: 8,
        courseCode: 'CSC',
        courseNumber: '360',
        courseName: 'Course name',
    },
    {
        courseId: 9,
        courseCode: 'MATH',
        courseNumber: '101',
        courseName: 'Course name',
    },
    {
        courseId: 10,
        courseCode: 'MATH',
        courseNumber: '110',
        courseName: 'Course name',
    },
    {
        courseId: 11,
        courseCode: 'MATH',
        courseNumber: '122',
        courseName: 'Course name',
    },
    {
        courseId: 12,
        courseCode: 'SENG',
        courseNumber: '265',
        courseName: 'Course name',
    },
    {
        courseId: 13,
        courseCode: 'SENG',
        courseNumber: '310',
        courseName: 'Course name',
    },
    {
        courseId: 14,
        courseCode: 'SENG',
        courseNumber: '275',
        courseName: 'Course name',
    },
    {
        courseId: 15,
        courseCode: 'SENG',
        courseNumber: '350',
        courseName: 'Course name',
    },
    {
        courseId: 16,
        courseCode: 'SENG',
        courseNumber: '360',
        courseName: 'Course name',
    },
    {
        courseId: 17,
        courseCode: 'ENGR',
        courseNumber: '110',
        courseName: 'Course name',
    }
]

export const defaultCoursePreferences: ICoursePreference[] = defaultCourses.map((course: ICourse) => ({
    courseId: course.courseId,
    courseName: makeCourseName(course),
    willingness: 'WILLING',
    ability: 'ABLE'
}));

export const defaultPreferences: IPreferences = {
    coursePreferences: defaultCoursePreferences,
    additionalDetails: '',
    availability: [
        {
            termId: 1,
            isAvailable: false
        },
        {
            termId: 2,
            isAvailable: true
        },
        {
            termId: 3,
            isAvailable: true
        }
    ],
    load: [
        {
            year: 2023,
            maxCourses: 4
        },
        {
            year: 2024,
            maxCourses: 4
        }
    ]
}


interface IPreferencesViewerProps {
    preferences: IPreferences
    onChange: (preferences: IPreferences) => void
    editing: boolean
}

const PreferencesViewer = (props: IPreferencesViewerProps) => {
    const terms = useContext(TermsContext).terms();

    console.log({ terms })

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
                    'UNWILLING': 'Unwilling',
                    'VERY_WILLING': 'Very willing'
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
                        <MenuItem value='VERY_WILLING'>Very willing</MenuItem>
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
                            disableRowSelectionOnClick
                        />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 6 }} />

                <Grid container spacing={3}>
                    <Grid item xs={12} lg={4}>
                        <Typography variant="h5">Term Availability</Typography>
                        <Box pt={1} pb={2} maxWidth="55ch">
                            <Typography variant="body1" color="textSecondary">Indicate your availability for the upcoming teaching terms.</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} lg={8}>
                        <Box>
                            {terms.map((term) => {
                                const termName = `${getMonthStringFromNumber(term.month)} ${term.year}`;

                                const handleChange = (event, term: ITerm) => {
                                    const isAvailable: boolean = event.target.value !== false;
                                    const newAvailability = [...props.preferences.availability];
                                    const termIndex = newAvailability.findIndex((availability) => availability.termId === term.id)
                                    newAvailability[termIndex] = {
                                        termId: term.id,
                                        isAvailable
                                    };

                                    props.onChange({
                                        ...props.preferences,
                                        availability: newAvailability
                                    });
                                }

                                return (                                
                                    <Box key={term.id} mb={2}>
                                        <Typography component="legend" variant="h6">
                                            {termName}
                                        </Typography>
                                        <Typography color="textSecondary">
                                            {`Are you available to instruct for the ${termName} term?`}
                                        </Typography>
                                        <Box mt={1} pl={1}>
                                            <RadioGroup
                                                name={`term-${term.id}`}
                                                onChange={(event) => handleChange(event, term)}
                                                sx={{ flexFlow: 'row wrap' }}>
                                                <FormControlLabel
                                                    value="false"
                                                    control={<Radio required={true} color="primary" size="small" />}
                                                    label="No"
                                                />
                                                <FormControlLabel
                                                    value="true"
                                                    control={<Radio required={true} color="primary" size="small" />}
                                                    label="Yes"
                                                />
                                            </RadioGroup>
                                        </Box>
                                    </Box>
                                )
                            })}
                        </Box>
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
