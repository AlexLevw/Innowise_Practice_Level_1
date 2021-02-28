import React from "react";
import { format, endOfMonth, addDays } from "date-fns";
import styles from "./_Calendar.module.scss";

interface ICalendarProps {
  selectedDate: Date;
  setSelectedDate(date: Date): void;
}

export default function Calendar({
  selectedDate,
  setSelectedDate,
}: ICalendarProps): JSX.Element {
  function createCalendar(): JSX.Element[] {
    const newDate = new Date();
    const daysLeft = endOfMonth(newDate).getDate() - newDate.getDate();
    const result: JSX.Element[] = [];
    for (let i = 0; i <= daysLeft; i += 1) {
      const currentDate = addDays(newDate, i);
      result.push(
        <button
          className={`${styles.calendarDay} ${
            format(selectedDate, "MM/dd/yyyy") ===
            format(currentDate, "MM/dd/yyyy")
              ? styles.active
              : ""
          }`}
          key={i}
          type="button"
          onClick={() => setSelectedDate(currentDate)}
        >
          <p>{format(currentDate, "eee")}</p>
          <p>{format(currentDate, "dd")}</p>
        </button>
      );
    }
    return result;
  }

  return <div className={styles.container}>{createCalendar()}</div>;
}
