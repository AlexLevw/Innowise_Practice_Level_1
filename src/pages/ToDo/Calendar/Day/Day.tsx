import React, { memo } from "react";
import { format } from "date-fns";
import { IDayStatuses } from "@events/dbEvents";
import styles from "./_Day.module.scss";

interface IDayProps {
  isSelected: boolean;
  currentDate: Date;
  setSelectedDate: (date: Date) => void;
  dayStatuses: IDayStatuses | undefined;
}

function DayInner({
  isSelected,
  currentDate,
  setSelectedDate,
  dayStatuses,
}: IDayProps): JSX.Element {
  return (
    <>
      <button
        className={styles.calendarDay + (isSelected ? " active" : "")}
        type="button"
        onClick={() => setSelectedDate(currentDate)}
        disabled={isSelected}
      >
        <div className={styles.center}>
          <p>{format(currentDate, "eee")}</p>
          <p>{format(currentDate, "dd")}</p>
        </div>
      </button>
      <div className={styles.markers}>
        {dayStatuses && dayStatuses.haveUncompleted ? (
          <span className={styles.uncompleted}> </span>
        ) : null}
        {dayStatuses && dayStatuses.haveCompleted ? (
          <span className={styles.completed}> </span>
        ) : null}
      </div>
    </>
  );
}

const Day = memo(DayInner);

export default Day;
