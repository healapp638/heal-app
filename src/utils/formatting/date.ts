import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);


export const formattedDateOnly = (date: any) =>
  dayjs(date).format("DD/MM/YYYY");
