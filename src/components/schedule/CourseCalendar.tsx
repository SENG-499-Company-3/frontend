import { EventObject, TZDate } from "@toast-ui/calendar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Select from '@mui/material/Select';
import { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { MenuItem, Typography } from "@mui/material";
import { createTheme } from '@mui/material/styles';
import {
  convertIntoReadableMonth,
  convertIntoReadableRange,
  useSmallScreen,
  createCalendarEvents,
  mergeCourses,
} from "../../utils/helper";
import { ViewType } from "../../types/calendar";
import { Course } from "../../types/course"
import Calendar from '@toast-ui/react-calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import { ThemeProvider } from "@emotion/react";

const buttoneGroupTheme = createTheme({
  palette: {
    primary: {
      main: '#000000',
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
  const calCourses = useMemo(() => createCalendarEvents(mergeCourses(courses)), [courses]);

  const calendarRef = useRef<typeof Calendar>(null);
  const [selectedDateRangeText, setSelectedDateRangeText] = useState("");
  const [selectedView, setSelectedView] = useState(view);

  const isSmallScreen = useSmallScreen();

  const initialCalendars = [{
    id: "1",
    name: "calendar-1",
    color: "#ffffff",
    // bgColor: "#9e5fff",
    // dragBgColor: "#9e5fff",
  }];

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
        events={ calCourses }
        view={selectedView}
        week={{
          showTimezoneCollapseButton: true,
          timezonesCollapsed: false,
          eventView: ['time'],
          taskView: false,
        }}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ref={calendarRef}
        useDetailPopup={true}
      />
    </Box>
  );
};

export default CourseCalendar;
