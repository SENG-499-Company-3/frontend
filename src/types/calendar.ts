export type ViewType = "month" | "week" | "day";

export type SelectDateTimeInfo = {
  start: Date;
  end: Date;
  isAllday: boolean;
  nativeEvent?: MouseEvent;
  gridSelectionElements: Element[];
};