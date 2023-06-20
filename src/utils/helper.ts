import { useEffect, useState } from "react";
import { format, parse } from "date-fns";

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

// convert time from hhmm to hh:mm
export const convertToTime = (time: number): string => {
  var timeString = time.toString();

  const formatString = timeString.length === 3 ? 'Hmm' : 'HHmm';

  const parsedTime = parse(timeString, formatString, new Date());
  const formattedTime = format(parsedTime, 'HH:mm');

  return formattedTime;
};
