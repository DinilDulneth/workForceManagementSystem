import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

// Static Events
const events = [
  //   {
  //     title: "Team Meeting",
  //     start: new Date("2025-04-15T10:00:00"),
  //     end: new Date("2025-04-15T11:00:00")
  //   },
  //   {
  //     title: "Project Deadline",
  //     start: new Date("2025-04-20T23:59:59"),
  //     end: new Date("2025-04-20T23:59:59")
  //   },
  //   {
  //     title: "Training Session",
  //     start: new Date("2025-04-18T14:00:00"),
  //     end: new Date("2025-04-18T16:00:00")
  //   }
];

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  return (
    <div>
      <h1>Workforce Management Calendar</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "80vh", margin: "50px" }}
      />
    </div>
  );
};

export default MyCalendar;
