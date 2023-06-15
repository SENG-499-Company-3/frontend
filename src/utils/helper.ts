import { useEffect, useState } from "react";
import { EventObject, TZDate } from "@toast-ui/calendar";
import { format, parse } from "date-fns";
import { Course } from "../types/course";
import { calendarColours } from "../components/common/sampleData/courseSchedule";

export const useSmallScreen = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 900) {
        setIsSmallScreen(true);
      } else {
        setIsSmallScreen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isSmallScreen;
};

export const convertIntoReadableMonth = (dateString: string): string => {
  const months: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [year, month] = dateString.split("-");

  return `${months[parseInt(month, 10) - 1]} ${year}`;
};

export const convertIntoReadableRange = (rangeString: string): string => {
  if (!rangeString) {
    return "";
  }
  const monthsShort: string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  function formatDate(date: string): {
    month: string;
    day: number;
    year: number;
  } {
    if (!date) {
      return {
        month: "",
        day: 0,
        year: 0,
      };
    }

    const [year, month, day] = date.split("-").map((x) => parseInt(x, 10));
    return {
      month: monthsShort[month - 1],
      day,
      year,
    };
  }

  const [startDate, endDate] = rangeString.split(" ~ ");
  const start = formatDate(startDate);
  const end = formatDate(endDate);

  return `${start.month} ${start.day} - ${end.day}, ${start.year}`;
};

export const addDate = (d: TZDate) => {
  const date = clone(d);
  date.setDate(d.getDate());

  return date;
};

export const clone = (date: TZDate): TZDate => {
  return new TZDate(date);
};

// convert time from hhmm to hh:mm
export const convertToTime = (time: number): string => {
  var timeString = time.toString();

  const formatString = timeString.length === 3 ? 'Hmm' : 'HHmm';

  const parsedTime = parse(timeString, formatString, new Date());
  const formattedTime = format(parsedTime, 'HH:mm');

  return formattedTime;
};

// Create all the course events that recur weekly
export const createCalendarEvents = (courseScheduleData: Course[]): EventObject[] => {
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
export const mergeCourses = (events: EventObject[]): EventObject[] => {
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
