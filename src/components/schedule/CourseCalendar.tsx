import { EventObject, ExternalEventTypes, TZDate } from "@toast-ui/calendar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import {
  convertIntoReadableMonth,
  convertIntoReadableRange,
  useSmallScreen,
  convertToTime,
} from "../../utils/helper";
import { ViewType } from "../../types/calendar";
import { Course } from "../../types/course";
import Calendar from "@toast-ui/react-calendar";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";
import EventDetailModal from "./EventDetailModal";
import { calendarColours } from "../common/sampleData/courseSchedule";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddIcon from '@mui/icons-material/Add';
import AddEventModal from "./AddEventModal";


const viewModeOptions = [
  {
    title: "Monthly",
    value: "month",
  },
  {
    title: "Weekly",
    value: "week",
  },
];

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
var currentTerm = "Spring"

if (currentMonth > 7) {
  currentTerm = "Fall";
}
else if (currentMonth > 3) {
  currentTerm = "Summer";
}

const termStartDates = {
  Spring: `${(currentYear + 1).toString()}-1-1`,  // First week of January
  Summer: `${currentYear.toString()}-5-1`,        // First week of May
  Fall: `${currentYear.toString()}-9-1`,          // First week of September
};  

const termOptions = ["Summer", "Fall", "Spring"];
const initialCalendars = [
  {
    id: "1",
    name: "calendar-1",
    color: "#ffffff",
    // bgColor: "#9e5fff",
    // dragBgColor: "#9e5fff",
  },
];


const CourseCalendar = ({
  view,
  courses,
  canEdit,
}: {
  view: ViewType;
  courses: Course[];
  canEdit: boolean;
}) => {
  const calendarRef = useRef<typeof Calendar>(null);
  const [selectedDateRangeText, setSelectedDateRangeText] = useState("");
  const [selectedView, setSelectedView] = useState(view);
  const [selectedEvent, setSelectedEvent] = useState<EventObject | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedTerm, setSelectedTerm] = useState(currentTerm);
  const [allCourses, setAllCourses] = useState<Course[]>(addUniqueIds(courses));
  const [allCalendarEvents, setAllCalendarEvents] = useState<EventObject[]>([]);
  const [isEventDetailOpen, setIsEventDetailOpen] = useState(false);
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);

  const isSmallScreen = useSmallScreen();

  useEffect(() => {
    const calendarEvents: EventObject[] = [];
    var colorIndex = 0;

    allCourses.forEach((course) => {
      calendarEvents.push(...createCalendarEvents(course, colorIndex++));
      colorIndex = colorIndex % 7;
    });
    
    setAllCalendarEvents(calendarEvents);
  }, []); // set all the calendar events when the component first mounts

  const onEventDetailOpen = () => {
    setIsEventDetailOpen(true);
  };

  const onEventDetailClose = () => {
    setIsEventDetailOpen(false);
  };

  const handleCourseUpdate = (updatedCourse: Course) => {
    const updatedCourses = allCourses.map((course) => {
      if ((course.id) === updatedCourse.id) {
        return updatedCourse;
      }
      return course;
    });

    const updatedCalendarEvents = updateCalendarEvents(updatedCourse, allCalendarEvents);
    
    setAllCalendarEvents(updatedCalendarEvents);
    setAllCourses(updatedCourses);

  };

  const handleCourseDelete = (deletedCourse: Course) => {
    const deletedCourseId = deletedCourse.id;
  
    const updatedCourses = allCourses.filter((course) => course.id !== deletedCourseId);
    const updatedCalendarEvents = allCalendarEvents.filter((event) => event.id !== deletedCourseId);
    setAllCourses(updatedCourses);
    setAllCalendarEvents(updatedCalendarEvents);
  };
  

  const getCalInstance = useCallback(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    () => calendarRef.current?.getInstance?.(),
    []
  );

  const updateRenderRangeText = useCallback(() => {
    const calInstance = getCalInstance();
    if (!calInstance) {
      setSelectedDateRangeText("");
    }

    const viewName = calInstance.getViewName();
    const calDate = calInstance.getDate();
    const rangeStart = calInstance.getDateRangeStart();
    const rangeEnd = calInstance.getDateRangeEnd();

    let year = calDate.getFullYear();
    let month = calDate.getMonth() + 1;
    let date = calDate.getDate();
    let dateRangeText: string;

    switch (viewName) {
      case "month": {
        dateRangeText = `${year}-${month}`;
        break;
      }
      case "week": {
        year = rangeStart.getFullYear();
        month = rangeStart.getMonth() + 1;
        date = rangeStart.getDate();
        const endYear = rangeEnd.getFullYear();
        const endMonth = rangeEnd.getMonth() + 1;
        const endDate = rangeEnd.getDate();

        const start = `${year}-${month < 10 ? "0" : ""}${month}-${
          date < 10 ? "0" : ""
        }${date}`;
        const end = `${endYear}-${endMonth < 10 ? "0" : ""}${endMonth}-${
          endDate < 10 ? "0" : ""
        }${endDate}`;
        dateRangeText = `${start} ~ ${end}`;
        break;
      }
      default: {
        dateRangeText = `${year}-${month}-${date}`;
      }
    }
    setSelectedDateRangeText(dateRangeText);
  }, [getCalInstance]);

  const onClickNav = (option: "prev" | "next" | "today") => {
    getCalInstance()[option]();
    updateRenderRangeText();
    updateTerm();
  };

  const onChangeSelect = (event: SelectChangeEvent) => {
    setSelectedView(event.target.value as ViewType);
  };

  const onClickEvent: ExternalEventTypes["clickEvent"] = (res) => {
    const course = allCourses.find((course) => course.id === res.event.id);

    setSelectedEvent(res.event);
    setSelectedCourse(course);
    onEventDetailOpen();
  };

  const setStartDate = (term) => {
    const calInstance = getCalInstance();
    calInstance.setDate(termStartDates[term]);
  };

  const updateTerm = () => {
    const calInstance = getCalInstance();
    const currentMonth = calInstance.getDate().getMonth();
    var currentTerm = selectedTerm;

    if (currentMonth > 7) {
      currentTerm = "Fall";
    }
    else if (currentMonth > 3) {
      currentTerm = "Summer";
    }
    else {
      currentTerm = "Spring";
    }

    setSelectedTerm(currentTerm);
  };

  const onClickTerm = (term) => {
    setSelectedTerm(term.target.value);
    setStartDate(term.target.value);
    updateRenderRangeText();
  };

  const onAddCourseModalOpen = () => {
    setIsAddCourseOpen(true);
  };

  const onAddCourseModalClose = () => {
    setIsAddCourseOpen(false);
  };

  const onAddCourse = (newCourse: Course) => {
    const randColorIndex = Math.floor(Math.random() * 7);
    const updatedCourses = [...allCourses, newCourse];
    const updatedCalendarEvents = [...allCalendarEvents, ...createCalendarEvents(newCourse, randColorIndex)];

    setAllCourses(updatedCourses);
    setAllCalendarEvents(updatedCalendarEvents);
  };

  useEffect(() => {
    setSelectedView(view);
  }, [view]);

  useEffect(() => {
    updateRenderRangeText();
  }, [selectedView, updateRenderRangeText]);

  return (
    <Box display="flex" flexDirection="column" height="100%" width="100%"> {/* Calendar's max width is 1536px */}
      <Stack padding={2} direction={isSmallScreen ? "column" : "row"} justifyContent="flex-end">
          <Stack py={isSmallScreen ? 2: 0} direction="row" width="100%">

            <Button 
              variant="outlined" 
              onClick={() => onClickNav("today")} 
              sx={{ 
                marginY: "4px", 
                marginRight: "8px", 
                color: "black", 
                borderColor: "gray", 
                ":hover": { borderColor: "gray", bgcolor: "#F0F0F0" }  }}>
              Today
            </Button>
            <Button 
              onClick={() => onClickNav("prev")} 
              sx={{ 
                marginY: "4px", 
                color: "black", 
                ":hover": { bgcolor: "#F0F0F0" } }}>
              <ArrowBackIosIcon />
            </Button>
            <Button 
              onClick={() => onClickNav("next")} 
              sx={{ 
                marginY: "4px", 
                color: "black", 
                ":hover": { bgcolor: "#F0F0F0" } }}>
              <ArrowForwardIosIcon />
            </Button>

            <Box>
              <Typography variant="h5" sx={{ display: "flex", height: '100%', alignItems: 'center', marginLeft: "10px" }}>
                {selectedDateRangeText && selectedView === "month"
                  ? convertIntoReadableMonth(selectedDateRangeText)
                  : convertIntoReadableRange(selectedDateRangeText)}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" width="100%" justifyContent={isSmallScreen ? "left": "right"} gap="15px">
            <ToggleButtonGroup
                value={selectedTerm}
                exclusive
                onChange={(term) => onClickTerm(term)}
              >
                {termOptions.map((term, index) => (
                  <ToggleButton 
                    key={index} 
                    value={term}
                    sx={{ flex: 1, minWidth: 0 }}
                  >
                    {term}
                  </ToggleButton>
                ))}
            </ToggleButtonGroup>
            <Select
              sx={{ width: isSmallScreen ? "100%" : "30%", maxWidth: "200px" }}
              variant="outlined"
              onChange={onChangeSelect}
              value={selectedView}
            >
              {viewModeOptions.map((option, index) => (
                <MenuItem value={option.value} key={index}>
                  {option.title}
                </MenuItem>
              ))}
            </Select>
            {/* {
            canEdit && <Button
              variant="contained"
              onClick={onAddCourseModalOpen}
              sx={{ width: isSmallScreen ? "100%" : "30%", maxWidth: "70px" }}
              >
                <AddIcon/>
            </Button>  
            }           */}

            
          </Stack>
      </Stack>
      <Calendar
        height="1100px"
        calendars={initialCalendars}
        month={{ startDayOfWeek: 0 }}
        events={allCalendarEvents}
        view={selectedView}
        week={{
          showTimezoneCollapseButton: true,
          timezonesCollapsed: false,
          eventView: ["time"],
          taskView: false,
          hourStart: 7,
          hourEnd: 21,
        }}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ref={calendarRef}
        template={{
          timegridDisplayPrimaryTime({ time }) {
            return `${time.getHours()}:${time.getMinutes()}0`;
          },
        }}
        onClickEvent={onClickEvent}
      />{
        selectedEvent && (
          <EventDetailModal
            calendarEvent={selectedEvent}
            initialCourse={selectedCourse}
            isOpen={isEventDetailOpen}
            onClose={onEventDetailClose}
            onDelete={handleCourseDelete}
            onCourseUpdate={handleCourseUpdate}
            canEdit={canEdit}
          />
        )
      }
      {/* {
      canEdit && <AddEventModal
        isOpen={isAddCourseOpen}
        onClose={onAddCourseModalClose}
        onCreate={onAddCourse}
      />
      } */}
    </Box>
  );
};

export default CourseCalendar;


// Create the calendar events that recur weekly
function createCalendarEvents(course: Course, colorIndex: number): EventObject[] {
  const events: EventObject[] = [];

  const startDate = new Date(course.StartDate);
  const endDate = new Date(course.EndDate);

  let currentDate = new Date(startDate);
  let bgColour = calendarColours[colorIndex].color;
  let darkColour = calendarColours[colorIndex].darkColor;

  while (currentDate <= endDate) {
    var dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    dayOfWeek = (dayOfWeek === "THU") ? "R" : dayOfWeek.charAt(0); // convert weekday to one letter

    if (course.Days.includes(dayOfWeek)) {
      const startTime = convertToTime(course.Begin);
      const eventStart = currentDate.setHours(parseInt(startTime.split(":")[0]), parseInt(startTime.split(":")[1]), 0);

      const endTime = convertToTime(course.End);
      const eventEnd = currentDate.setHours(parseInt(endTime.split(":")[0]), parseInt(endTime.split(":")[1]), 0);

      const event: EventObject = {
        id: course.id,
        calendarId: "1",
        title: course.Subj + ' ' + course.Num.toString() + ' ' + course.Section,
        body: course.Title,
        location: course.Bldg + ' ' + course.Room,
        attendees: [course.Instructor],
        category: "time",
        backgroundColor: bgColour,
        borderColor: bgColour,
        dragBackgroundColor: darkColour,
        start: addDate(new TZDate(eventStart)).toDate().toISOString(),
        end: addDate(new TZDate(eventEnd)).toDate().toISOString(),
        isReadOnly: true,
      };

      events.push(event);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return events;
}


// Courses with two sections that are taught by the same professor are merged 
function mergeCourses(events: EventObject[]): EventObject[] {
  const uniqueEvents: EventObject[] = [];

  events.forEach(event => {
    const isDuplicate = uniqueEvents.some(uniqueEvent =>
      uniqueEvent.Title === event.Title &&
      uniqueEvent.Term === event.Term &&
      uniqueEvent.Subj === event.Subj &&
      uniqueEvent.Num === event.Num &&
      uniqueEvent.Instructor === event.Instructor &&
      uniqueEvent.Bldg === event.Bldg &&
      uniqueEvent.Room === event.Room &&
      uniqueEvent.Begin === event.Begin &&
      uniqueEvent.End === event.End &&
      uniqueEvent.Days === event.Days
    );

    if (!isDuplicate) {
      uniqueEvents.push(event);
    } else {
      const existingEvent = uniqueEvents.find(uniqueEvent =>
        uniqueEvent.Title === event.Title &&
        uniqueEvent.Term === event.Term &&
        uniqueEvent.Subj === event.Subj &&
        uniqueEvent.Num === event.Num &&
        uniqueEvent.Instructor === event.Instructor &&
        uniqueEvent.Bldg === event.Bldg &&
        uniqueEvent.Room === event.Room &&
        uniqueEvent.Begin === event.Begin &&
        uniqueEvent.End === event.End &&
        uniqueEvent.Days === event.Days
      );

      if (existingEvent) {
        // Merge lectures by combining the Sections
        existingEvent.Section += `/${event.Section}`;
      }
    }
  });

  return uniqueEvents;
}

function updateCalendarEvents(updatedCourse: Course, allCalendarEvents: EventObject[]): EventObject[] {
  const updatedEvents: EventObject[] = allCalendarEvents.filter((event) => event.id !== updatedCourse.id);
  const color = allCalendarEvents.find(event => event.id === updatedCourse.id).backgroundColor;
  const colorIndex = calendarColours.findIndex(colors => colors.color === color);
  
  updatedEvents.push(...createCalendarEvents(updatedCourse, colorIndex))

  return updatedEvents;
}


function addDate(d: TZDate) {
  const date = clone(d);
  date.setDate(d.getDate());

  return date;
};

function clone (date: TZDate): TZDate {
  return new TZDate(date);
};

function addUniqueIds (courses: Course[]): Course[] {
  return courses.map((course) => {
    const courseId = course.Subj + (course.Num).toString() + course.Section;
    return { id: courseId, ...course };
  });
};