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
import { useState, useContext, Fragment, useEffect, useMemo } from 'react';

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
import { CourseContext } from "../contexts/CourseContext";

const DEFAULT_MAX_COURSES = 6;

export const getDefaultCoursePreferences = (courses: ICourse[]): ICoursePreference[] => courses.map((course: ICourse) => ({
    courseYear: Number(course.CourseYear || String(course.Num)[0]),
    courseName: makeCourseName(course),
    willingness: 'WILLING',
    ability: 'ABLE'
}));

export const getDefaultPreferences = (courses: ICourse[], terms: ITerm[]): IPreferences => ({
    email: '',
    coursePreferences: getDefaultCoursePreferences(courses),
    additionalDetailes: '',
    availability: terms.map((term) => ({
        term,
        isAvailable: true
    })),
    load: DEFAULT_MAX_COURSES
})


interface IPreferencesViewerProps {
    preferences: IPreferences | null
    onChange: (preferences: IPreferences) => void
    editing: boolean
}

const PreferencesViewer = (props: IPreferencesViewerProps) => {
    console.log('props.preferences:', props.preferences);
    const termsContext = useContext(TermsContext);
    const courseContext = useContext(CourseContext);

    useEffect(() => {
        courseContext.fetchCourses();
        termsContext.fetchTerms();
    }, []);

    const allCourses = courseContext.courses();
    const allTerms = termsContext.terms();
    const yearForLoad = new Date().getFullYear();

    console.log('allTerms:', allTerms)

    const defaultPrefrencesObject = useMemo(() => {
        return getDefaultPreferences(allCourses, allTerms);
    }, [allCourses, allTerms]);

    const termYears = termsContext.terms()
        .reduce((years, term) => {
            if (!years.includes(term.year)) {
                years.push(term.year);
            }

            return years;
        }, []);

    const preferencesObject: IPreferences = {
        ...(props.preferences || defaultPrefrencesObject),
        coursePreferences: [
            ...defaultPrefrencesObject.coursePreferences.filter((defaultCoursePref) => {
                return props.preferences?.coursePreferences
                    ? (!props.preferences.coursePreferences.some((userCoursePref) => defaultCoursePref.courseName === userCoursePref.courseName))
                    : true
            }),
            ...(props.preferences?.coursePreferences ?? [])
        ],
        load: props.preferences?.load || defaultPrefrencesObject.load,
        availability: [
            ...defaultPrefrencesObject.availability.filter((defaultAvilability) => {
                return props.preferences?.availability
                    ? (!props.preferences.availability.some((userAvailability) => userAvailability.term.id === defaultAvilability.term.id))
                    : true
            }),
            ...(props.preferences?.availability ?? [])
        ],
    }    

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
                    const updatedCoursePreferences = [...preferencesObject.coursePreferences];
                    updatedCoursePreferences.find((preference) => preference.courseName === params.row.courseName).willingness = willingness;
                    props.onChange({ ...preferencesObject, coursePreferences: updatedCoursePreferences });
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
                    const updatedCoursePreferences = [...preferencesObject.coursePreferences];
                    updatedCoursePreferences.find((preference) => preference.courseName === params.row.courseName).ability = ability;
                    props.onChange({ ...preferencesObject, coursePreferences: updatedCoursePreferences });
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

    console.log('preferencesObject:', preferencesObject);

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
                            rows={preferencesObject.coursePreferences}
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
                                const handleChangeLoad = (event) => {
                                    const newLoad = event.target.value;

                                    props.onChange({
                                        ...preferencesObject,
                                        load: newLoad
                                    });
                                }

                                return (
                                    <Fragment key={`year-${termYear}`}>
                                        {termsContext
                                            .terms()
                                            .filter((term) => term.year === termYear)
                                            .map((term) => {
                                                const termName = `${getMonthStringFromNumber(term.month)} ${termYear}`;

                                                const handleChangeAvailability = (event, updatedTerm: ITerm) => {
                                                    const isAvailable: boolean = event.target.value !== 'false';
                                                    const newAvailability = [...preferencesObject.availability];
                                                    const termIndex = newAvailability.findIndex((availability) => availability.term.id === updatedTerm.id)
                                                    newAvailability[termIndex] = {
                                                        term: updatedTerm,
                                                        isAvailable
                                                    };
                
                                                    props.onChange({
                                                        ...preferencesObject,
                                                        availability: newAvailability
                                                    });
                                                }

                                                const isAvailable = preferencesObject.availability.find((availability) => availability.term.id === term.id)?.isAvailable

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
                                       {termYear === yearForLoad && (
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
                                                            value={preferencesObject.load}
                                                            onChange={(event) => handleChangeLoad(event)}
                                                            label='Course Load'
                                                            required
                                                        />
                                                    ) : (
                                                        <Typography>
                                                            <strong>{pluralize(preferencesObject.load, `${preferencesObject.load} course`)}</strong>
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                       )}
                                        
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
                                value={props.preferences?.additionalDetailes || ''}
                                onChange={(event) => {
                                    props.onChange({ ...props.preferences, additionalDetailes: event.target.value });
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
