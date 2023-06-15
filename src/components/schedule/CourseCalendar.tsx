import { EventObject, ExternalEventTypes, TZDate } from "@toast-ui/calendar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Select from "@mui/material/Select";
import { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
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
import { ThemeProvider } from "@emotion/react";
import EventDetailModal from "./EventDetailModal";
import { calendarColours } from "../common/sampleData/courseSchedule";

const buttoneGroupTheme = createTheme({
  palette: {
    primary: {
      main: "#000000",
    },
  },
});

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

const CourseCalendar = ({
  view,
  courses,
}: {
  view: ViewType;
  courses: Course[];
}) => {
  const calCourses = useMemo(
    () => createCalendarEvents(mergeCourses(courses)),
    [courses]
  );

  const calendarRef = useRef<typeof Calendar>(null);
  const [selectedDateRangeText, setSelectedDateRangeText] = useState("");
  const [selectedView, setSelectedView] = useState(view);
  const [selectedEvent, setSelectedEvent] = useState<EventObject | null>(null);

  const isSmallScreen = useSmallScreen();

  const initialCalendars = [
    {
      id: "1",
      name: "calendar-1",
      color: "#ffffff",
      // bgColor: "#9e5fff",
      // dragBgColor: "#9e5fff",
    },
  ];

  const useDisclosure = () => {
    const [isOpen, setIsOpen] = useState(false);

    const onOpen = () => {
      setIsOpen(true);
    };

    const onClose = () => {
      setIsOpen(false);
    };

    return { isOpen, onOpen, onClose };
  };

  const {
    isOpen: isEventDetailOpen,
    onOpen: onEventDetailOpen,
    onClose: onEventDetailClose,
  } = useDisclosure();

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
        const endMonth = rangeEnd.getMonth() + 1;
        const endDate = rangeEnd.getDate();

        const start = `${year}-${month < 10 ? "0" : ""}${month}-${
          date < 10 ? "0" : ""
        }${date}`;
        const end = `${year}-${endMonth < 10 ? "0" : ""}${endMonth}-${
          endDate < 10 ? "0" : ""
        }${endDate}`;
        dateRangeText = `${start} ~ ${end}`;
        break;
      }
      default:
        dateRangeText = `${year}-${month}-${date}`;
    }

    setSelectedDateRangeText(dateRangeText);
  }, [getCalInstance]);

  const onClickNav = (option: "prev" | "next" | "today") => {
    getCalInstance()[option]();
    updateRenderRangeText();
  };

  const onChangeSelect = (event: SelectChangeEvent) => {
    setSelectedView(event.target.value as ViewType);
  };

  const onClickEvent: ExternalEventTypes["clickEvent"] = (res) => {
    console.group("onClickEvent");
    console.log("MouseEvent : ", res.nativeEvent);
    console.log("Event Info : ", res.event);
    console.groupEnd();
    setSelectedEvent(res.event);
    onEventDetailOpen();
  };

  useEffect(() => {
    setSelectedView(view);
  }, [view]);

  useEffect(() => {
    updateRenderRangeText();
  }, [selectedView, updateRenderRangeText]);

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Stack padding={2} direction={isSmallScreen ? "column" : "row"} alignContent="center" gap={4}>
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
        <Stack direction="row" width="100%" justifyContent="space-between">
          <ThemeProvider theme={buttoneGroupTheme}>
            <ButtonGroup variant="outlined">
              <Button onClick={() => onClickNav("today")}>Today</Button>
              <Button onClick={() => onClickNav("prev")}>Prev</Button>
              <Button onClick={() => onClickNav("next")}>Next</Button>
            </ButtonGroup>
          </ThemeProvider>

          <Box>
            <Typography variant="h5" sx={{ display: "flex", height: '100%', alignItems: 'center' }}>
              {selectedDateRangeText && selectedView === "month"
                ? convertIntoReadableMonth(selectedDateRangeText)
                : convertIntoReadableRange(selectedDateRangeText)}
            </Typography>
          </Box>
        </Stack>
      </Stack>
      <Calendar
        height="900px"
        calendars={initialCalendars}
        month={{ startDayOfWeek: 1 }}
        events={calCourses}
        view={selectedView}
        week={{
          showTimezoneCollapseButton: true,
          timezonesCollapsed: false,
          eventView: ["time"],
          taskView: false,
        }}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ref={calendarRef}
        // useDetailPopup={true}
        onClickEvent={onClickEvent}
      />{
        selectedEvent && (
          <EventDetailModal
            event={selectedEvent}
            isOpen={isEventDetailOpen}
            onClose={onEventDetailClose}
          />
        )
      }
    </Box>
  );
};

export default CourseCalendar;


// Create all the course events that recur weekly
function createCalendarEvents(courseScheduleData: Course[]): EventObject[] {
  const events: EventObject[] = [];
  var colorIndex = 0;

  courseScheduleData.forEach(course => {
    const startDate = new Date(course.StartDate);
    const endDate = new Date(course.EndDate);

    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      var dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      dayOfWeek = (dayOfWeek === "THU") ? "R" : dayOfWeek.charAt(0); // convert weekday to one letter
    
      if (course.Days.includes(dayOfWeek)) {
        const startTime = convertToTime(course.Begin);
        const eventStart = currentDate.setHours(parseInt(startTime.split(":")[0]), parseInt(startTime.split(":")[1]), 0);
        
        const endTime = convertToTime(course.End);
        const eventEnd = currentDate.setHours(parseInt(endTime.split(":")[0]), parseInt(endTime.split(":")[1]), 0);
        
        const event: EventObject = {
          id: course.Term.toString() + course.Subj + course.Num.toString() + course.Section, // generate a unique id
          calendarId: "1",
          title: course.Subj + ' ' + course.Num.toString() + ' ' + course.Section,
          body: course.Title,
          location: course.Bldg + ' ' + course.Room,
          attendees: [course.Instructor],
          category: "time",
          backgroundColor: calendarColours[colorIndex % calendarColours.length].color, 
          borderColor: calendarColours[colorIndex % calendarColours.length].color,
          dragBackgroundColor: calendarColours[colorIndex % calendarColours.length].darkColor,
          start: addDate(new TZDate(eventStart)).toDate().toISOString(),
          end: addDate(new TZDate(eventEnd)).toDate().toISOString(),
          isReadOnly: true,
        };

        events.push(event);
      }

      currentDate.setDate(currentDate.getDate() + 1);
      colorIndex++;
    }
  });

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

function addDate(d: TZDate) {
  const date = clone(d);
  date.setDate(d.getDate());

  return date;
};

function clone (date: TZDate): TZDate {
  return new TZDate(date);
};
