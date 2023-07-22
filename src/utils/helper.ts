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

export const convertTimeToNumber = (timeString: string): number => {
    const valueTime = timeString.replace(/:/, '');
    const numTime = Number(valueTime);
    return numTime;
};

const year = new Date().getFullYear();
export const termOptions = [
  {
    title: "Summer " + year.toString(),
    value: parseInt(year.toString() + "05"),
    startDate: "01 May " + year.toString(),
    endDate: "31 Jul " + year.toString(),
  },
  {
    title: "Fall " + year.toString(),
    value: parseInt(year.toString() + "09"),
    startDate: "01 Sep " + year.toString(),
    endDate: "30 Nov " + year.toString(),
  },
  {
    title: "Spring " + (year + 1).toString(),
    value: parseInt((year + 1).toString() + "01"),
    startDate: "01 Jan " + (year + 1).toString(),
    endDate: "31 Mar " + (year + 1).toString(),
  }
];

export const courseBlocks = [
    'MR 08:30 09:50', //A
    'MR 10:00 11:20', //B
    'MR 11:30 12:50', //C
    'MR 13:00 14:20', //D
    'MWR 14:30 15:20', //E
    'MWR 15:30 16:20', //F
    'MW 16:30 17:50', //G
    'TWF 08:30 09:20', //H
    'TWF 09:30 10:20', //I
    'TWF 10:30 11:20', //J
    'TWF 11:30 12:20', //K
    'TWF 12:30 13:20', //L
    'TWF 13:30 14:20', //M
    'TF 14:30 16:30', //N
    'TR 16:30 17:50', //O
];
