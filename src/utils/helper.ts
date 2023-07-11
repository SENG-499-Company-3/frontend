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
      month: getMonthName(month - 1),
      day,
      year,
    };
  }

  const [startDate, endDate] = rangeString.split(" ~ ");
  const start = formatDate(startDate);
  const end = formatDate(endDate);

  if (start.year !== end.year) {
    return `${getShortMonthName(start.month)} ${start.year} - ${getShortMonthName(end.month)} ${end.year}`;
  }
  else if (start.month !== end.month) {
    return `${getShortMonthName(start.month)} - ${getShortMonthName(end.month)}, ${end.year}`;
  }

  return `${start.month}, ${start.year}`;
};

// get string month from month index
function getMonthName(monthIndex: number): string {
  const date = new Date();
  date.setMonth(monthIndex);
  return date.toLocaleString('en-us', { month: 'long' });
}

function getShortMonthName(month: string): string {
  const date = new Date(`${month} 1, 2023`); // put random day and year
  const monthIndex = date.getMonth();
  date.setMonth(monthIndex);
  return date.toLocaleString('en-us', { month: 'short' });
}

// convert time from hhmm to hh:mm
export const convertToTime = (time: number): string => {
  var timeString = time.toString();

  const formatString = timeString.length === 3 ? 'Hmm' : 'HHmm';

  const parsedTime = parse(timeString, formatString, new Date());
  const formattedTime = format(parsedTime, 'HH:mm');

  return formattedTime;
};
