import React, { useState, useEffect, useRef } from "react";

const Month = () => {
  const monthNames = [
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

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  const [currentMonth, setCurrentMonth] = useState(() => {
    const savedMonth = parseInt(localStorage.getItem("currentMonth"), 10);
    return isNaN(savedMonth) ? new Date().getMonth() : savedMonth;
  });

  const [currentYear, setCurrentYear] = useState(() => {
    const savedYear = parseInt(localStorage.getItem("currentYear"), 10);
    return isNaN(savedYear) ? new Date().getFullYear() : savedYear;
  });

  const [events, setEvents] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const dragRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("currentMonth", currentMonth);
    localStorage.setItem("currentYear", currentYear);
  }, [currentMonth, currentYear]);

  const goToNextMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth + 1) % 12);
    if (currentMonth === 11) {
      setCurrentYear((prevYear) => prevYear + 1);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
    if (currentMonth === 0) {
      setCurrentYear((prevYear) => prevYear - 1);
    }
  };

  const resources = [
    "Resource B",
    "Resource C",
    "Resource D",
    "Resource E",
    "Resource F",
    "Resource G",
    "Resource H",
    "Resource I",
    "Resource J",
    "Resource K",
    "Resource L",
  ];

  const daysArray = Array.from(
    { length: daysInMonth(currentMonth, currentYear) },
    (_, i) => new Date(currentYear, currentMonth, i + 1)
  );

  const getCellDate = (dayIndex) => {
    const date = daysArray[dayIndex];
    return new Date(currentYear, currentMonth, date.getDate());
  };

  const handleMouseDown = (resourceIndex, dayIndex, event) => {
    setIsDragging(true);
    const cellHeight = event.currentTarget.clientHeight;
    const offsetY = event.nativeEvent.offsetY;
    const startHour = Math.floor((offsetY / cellHeight) * 24);
    setDragStart({ resourceIndex, dayIndex, startHour });
    dragRef.current = { resourceIndex, dayIndex, startHour };
  };

  const handleMouseUp = () => {
    if (isDragging && dragStart && dragEnd) {
      const startDate = getCellDate(dragStart.dayIndex);
      startDate.setHours(dragStart.startHour);
      const endDate = getCellDate(dragEnd.dayIndex);
      endDate.setHours(dragEnd.endHour);

      // Generate a random color for the new event
      const randomColor = `hsl(${Math.random() * 360}, 100%, 75%)`;

      const newEvent = {
        resource: resources[dragStart.resourceIndex],
        start: startDate,
        end: endDate,
        title: "New Event",
        color: randomColor,
      };

      setEvents((prevEvents) => [...prevEvents, newEvent]);
    }
    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
  };

  const handleMouseMove = (resourceIndex, dayIndex, event) => {
    if (isDragging) {
      const cellHeight = event.currentTarget.clientHeight;
      const offsetY = event.nativeEvent.offsetY;
      const endHour = Math.floor((offsetY / cellHeight) * 24);
      setDragEnd({ resourceIndex, dayIndex, endHour });
    }
  };

  return (
    <div className="w-screen" onMouseUp={handleMouseUp}>
      <div className="bg-gray-300 w-full text-blue-700 flex justify-between text-xl p-2 absolute  left-0 top-0 z-20">
        <div>
          {monthNames[currentMonth]} {currentYear}
        </div>
        <div>
          <button onClick={goToPreviousMonth} className="px-2">
            Previous
          </button>
          <button onClick={goToNextMonth}>Next</button>
        </div>
      </div>
      <div className="overflow-x-auto w-full left-0 absolute mt-2">
        <table className="table-fixed border-collapse w-full">
          <thead className="sticky z-10">
            <tr>
              <th className="w-32 sticky p-2 border">Resources</th>
              {daysArray.map((date) => (
                <th key={date} className="p-2 border text-center w-32">
                  {dayNames[date.getDay()]} {date.getDate()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {resources.map((resource, resourceIndex) => (
              <tr key={resource}>
                <td className="p-2 border sticky left-0 bg-white z-10">
                  {resource}
                </td>
                {daysArray.map((date, dayIndex) => (
                  <td
                    key={dayIndex}
                    className="p-2 border relative w-32 h-24"
                    onMouseDown={(e) =>
                      handleMouseDown(resourceIndex, dayIndex, e)
                    }
                    onMouseMove={(e) =>
                      handleMouseMove(resourceIndex, dayIndex, e)
                    }
                  >
                    {events
                      .filter(
                        (event) =>
                          event.resource === resource &&
                          event.start.getDate() === date.getDate() &&
                          event.start.getMonth() === currentMonth &&
                          event.start.getFullYear() === currentYear
                      )
                      .map((event, eventIndex) => (
                        <div
                          key={eventIndex}
                          className="absolute w-full text-xs p-1"
                          style={{
                            backgroundColor: event.color,
                            top: `${(event.start.getHours() / 24) * 100}%`,
                            height: `${
                              ((event.end - event.start) /
                                (1000 * 60 * 60 * 24)) *
                              100
                            }%`,
                          }}
                        >
                          {event.title}
                          <br />
                          {event.start.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          -{" "}
                          {event.end.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      ))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Month;
