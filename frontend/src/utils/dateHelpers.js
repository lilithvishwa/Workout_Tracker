import { format } from "date-fns";

export const todayStr = () => format(new Date(), "yyyy-MM-dd");
export const currentMonthStr = () => format(new Date(), "yyyy-MM");
export const formatDate = (date, fmt = "yyyy-MM-dd") => format(date, fmt);
