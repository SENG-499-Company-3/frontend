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
import { useState, useContext, Fragment } from 'react';

import AppPage from './layout/AppPage'
import PageHeader from "./layout/PageHeader"
import PageContent from "./layout/PageContent"
import Breadcrumbs from "./layout/Breadcrumbs"
import PageHeaderActions from "./layout/PageHeaderActions"
import { ICourse } from "../hooks/api/useCoursesApi";
import { getMonthStringFromNumber, makeCourseName, pluralize } from "../utils/helper";
import { ICoursePreference, IPreferences } from "../hooks/api/usePreferencesApi";
import { ITerm } from "../hooks/api/useTermsApi";
import { TermsContext, defaultTerms } from "../contexts/TermsContext";

const DEFAULT_MAX_COURSES = 6;

export const getDefaultCoursePreferences = (courses: ICourse[]): ICoursePreference[] => courses.map((course: ICourse) => ({
    courseId: course._id,
    courseName: makeCourseName(course),
    willingness: 'WILLING',
    ability: 'ABLE'
}));

export const getDefaultPreferences = (courses: ICourse[], terms: ITerm[]): IPreferences => ({
    coursePreferences: getDefaultCoursePreferences(courses),
    additionalDetails: '',
    availability: terms.map((term) => ({
        termId: term.id,
        isAvailable: true
    })),
    load: terms
        .reduce((years, term) => {
            if (!years.includes(term.year)) {
                years.push(term.year);
            }
            return years;
        }, [])
        .map((year) => ({ year, maxCourses: DEFAULT_MAX_COURSES }))
})


interface IPreferencesViewerProps {
    preferences: IPreferences | null
    onChange: (preferences: IPreferences) => void
    editing: boolean
}

const PreferencesViewer = (props: IPreferencesViewerProps) => {
    const termsContext = useContext(TermsContext);
    const termYears = termsContext.terms()
        .reduce((years, term) => {
            if (!years.includes(term.year)) {
                years.push(term.year);
            }

            return years;
        }, []);

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
                    const updatedCoursePreferences = [...props.preferences?.coursePreferences];
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
                    const updatedCoursePreferences = [...props.preferences?.coursePreferences];
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
                            rows={props.preferences?.coursePreferences || []}
                            disableRowSelectionOnClick
                        />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 6 }} />

                <Grid container spacing={3}>
                    <Grid item xs={12} lg={4}>
                        <Typography variant="h5">Term Availability and Course Load</Typography>
                        <Box pt={1} pb={2} maxWidth="55ch">
                            <Typography variant="body1" color="textSecondary">Indicate your availability and course load for the upcoming teaching terms.</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} lg={8}>
                        <Box>
                            {termYears.map((termYear: number, index: number) => {
                                const handleChangeLoad = (event, year) => {
                                    const maxCourses = event.target.value;
                                    const newLoad = [...props.preferences?.load];
                                    const yearIndex = newLoad.findIndex((load) => load.year === year)
                                    newLoad[yearIndex] = { year, maxCourses };

                                    props.onChange({
                                        ...props.preferences,
                                        load: newLoad
                                    });
                                }

                                const maxCourses = props.preferences?.load.find((load) => load.year === termYear)?.maxCourses;

                                return (
                                    <Fragment key={`year-${termYear}`}>
                                        {termsContext
                                            .terms()
                                            .filter((term) => term.year === termYear)
                                            .map((term) => {
                                                const termName = `${getMonthStringFromNumber(term.month)} ${termYear}`;

                                                const handleChangeAvailability = (event, updatedTerm: ITerm) => {
                                                    const isAvailable: boolean = event.target.value !== 'false';
                                                    const newAvailability = [...props.preferences?.availability];
                                                    const termIndex = newAvailability.findIndex((availability) => availability.termId === updatedTerm.id)
                                                    newAvailability[termIndex] = {
                                                        termId: updatedTerm.id,
                                                        isAvailable
                                                    };
                
                                                    props.onChange({
                                                        ...props.preferences,
                                                        availability: newAvailability
                                                    });
                                                }

                                                const isAvailable = props.preferences?.availability.find((availability) => availability.termId === term.id)?.isAvailable

                                                return (                                
                                                    <Box key={`term-${term.id}`} mb={2}>
                                                        <Typography variant="h6">
                                                            {termName}
                                                        </Typography>
                                                        <Typography color="textSecondary">
                                                            {`Are you available to instruct for the ${termName} term?`}
                                                        </Typography>
                                                        <Box mt={1}>
                                                            {props.editing ? (
                                                                <RadioGroup
                                                                    name={`term-${term.id}`}
                                                                    onChange={(event) => handleChangeAvailability(event, term)}
                                                                    value={isAvailable ? 'true' : 'false'}
                                                                    sx={{ flexFlow: 'row wrap', pl: 1 }}>
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
                                                            ) : (
                                                                <Typography>
                                                                    <strong>{isAvailable ? 'Yes' : 'No'}</strong>
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </Box>
                                                )
                                            })
                                        }
                                       
                                       <Box mt={2}>
                                            <Typography variant="h6">
                                                Course Load for {termYear}
                                            </Typography>
                                            <Typography color="textSecondary">
                                                Enter your maximum course load for the {termYear} teaching year
                                            </Typography>
                                            <Box mt={2}>
                                                {props.editing ? (
                                                    <TextField
                                                        name={`load-${termYear}`}
                                                        size='small'
                                                        type='number'
                                                        // InputProps={{ inputProps: { min: 0, max: 6 }}}
                                                        value={maxCourses}
                                                        onChange={(event) => handleChangeLoad(event, termYear)}
                                                        label='Course Load'
                                                        required
                                                    />
                                                ) : (
                                                    <Typography>
                                                        <strong>{pluralize(maxCourses, `${maxCourses} course`)}</strong>
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                        
                                        {index < termYears.length - 1 && (
                                            <Divider sx={{ my: 3 }} />
                                        )}
                                    </Fragment>
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
                                value={props.preferences?.additionalDetails || ''}
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
