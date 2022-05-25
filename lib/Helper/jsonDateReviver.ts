import { isDate, isValid, parseJSON } from "date-fns";

export function jsonDateReviver(key: string, value: any): any | Date {
  if (typeof value === "string") {
    const date = parseJSON(value);
    if (isDate(date) && isValid(date)) {
      return date;
    }
  }

  return value;
}
