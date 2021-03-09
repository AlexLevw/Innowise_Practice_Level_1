import React from "react";
import { format, endOfMonth, addDays } from "date-fns";
import Slider from "react-slick";
import { IDayStatuses } from "@events/dbEvents";
import styles from "./_Calendar.module.scss";
import Day from "./Day/Day";

interface ICalendarProps {
  selectedDate: Date;
  setSelectedDate(date: Date): void;
  daysStatuses: IDayStatuses[];
}

export default function Calendar({
  selectedDate,
  setSelectedDate,
  daysStatuses,
}: ICalendarProps): JSX.Element {
  const sliderAdaptive = [
    {
      breakpoint: 660,
      settings: {
        slidesToShow: 6,
        slidesToScroll: 6,
      },
    },
    {
      breakpoint: 400,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 5,
      },
    },
  ];

  function createCalendar(): JSX.Element[] {
    const newDate: Date = new Date();
    const daysLeft: number = endOfMonth(newDate).getDate() - newDate.getDate();
    const result: JSX.Element[] = [];
    for (let i = 0; i <= daysLeft; i += 1) {
      const currentDate: Date = addDays(newDate, i);
      const isSelected: boolean =
        format(selectedDate, "MM/dd/yyyy") ===
        format(currentDate, "MM/dd/yyyy");
      const currentStatuses: IDayStatuses | undefined = daysStatuses.find(
        (elem) =>
          format(new Date(elem.date), "MM/dd/yyyy") ===
          format(currentDate, "MM/dd/yyyy")
      );
      result.push(
        <Day
          key={i}
          isSelected={isSelected}
          currentDate={currentDate}
          setSelectedDate={setSelectedDate}
          dayStatuses={currentStatuses}
        />
      );
    }
    return result;
  }

  return (
    <div className={styles.container}>
      <Slider
        dots
        speed={500}
        slidesToShow={8}
        slidesToScroll={8}
        infinite={false}
        responsive={sliderAdaptive}
      >
        {createCalendar()}
      </Slider>
    </div>
  );
}
