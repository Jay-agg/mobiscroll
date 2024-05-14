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
  const [dragSelection, setDragSelection] = useState(null);
  const [dragColor, setDragColor] = useState("");
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
    const cellWidth = event.currentTarget.clientWidth;
    const offsetX = event.nativeEvent.offsetX;
    const startHour = Math.floor((offsetX / cellWidth) * 24);
    setDragStart({ resourceIndex, dayIndex, startHour });
    dragRef.current = { resourceIndex, dayIndex, startHour };

    // Generate a random color for the drag selection and event
    const randomColor = `hsl(${Math.random() * 360}, 100%, 75%)`;
    setDragColor(randomColor);
  };

  const handleMouseUp = () => {
    if (isDragging && dragStart && dragEnd) {
      const startDate = getCellDate(dragStart.dayIndex);
      startDate.setHours(dragStart.startHour);
      const endDate = getCellDate(dragEnd.dayIndex);
      endDate.setHours(dragEnd.endHour);

      const newEvent = {
        resource: resources[dragStart.resourceIndex],
        start: startDate,
        end: endDate,
        title: "New Event",
        color: dragColor,
      };

      setEvents((prevEvents) => [...prevEvents, newEvent]);
    }
    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
    setDragSelection(null);
    setDragColor("");
  };

  const handleMouseMove = (resourceIndex, dayIndex, event) => {
    if (isDragging) {
      const cellRect = event.currentTarget.getBoundingClientRect();
      const offsetX = Math.min(
        Math.max(event.clientX - cellRect.left, 0),
        cellRect.width
      );
      const cellWidth = cellRect.width;
      const endHour = Math.floor((offsetX / cellWidth) * 24);
      setDragEnd({ resourceIndex, dayIndex, endHour });

      // Set drag selection area
      setDragSelection({
        resourceIndex,
        dayIndex,
        startHour: dragStart.startHour,
        endHour,
      });
    }
  };

  const formatEventTime = (start, end) => {
    return `${start.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })} - ${end.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  return (
    <div className="w-screen" onMouseUp={handleMouseUp}>
      <div className="bg-gray-200 w-full text-blue-700 flex justify-between text-xl p-2 absolute left-0 top-0 z-20">
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
        <table className="table-fixed border border-black w-full">
          <thead className="sticky top-0 z-10 ">
            <tr>
              <th className="w-32 p-2 border  font-normal"></th>
              {daysArray.map((date) => (
                <th
                  key={date}
                  className="p-2 border text-center w-32 font-normal"
                >
                  {dayNames[date.getDay()]} {date.getDate()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {resources.map((resource, resourceIndex) => (
              <tr key={resource}>
                <td className="p-2 border sticky left-0 bg-white z-10 font-bold text-left">
                  {resource}
                </td>
                {daysArray.map((date, dayIndex) => (
                  <td
                    key={dayIndex}
                    className="p-2 border relative w-32 h-20"
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
                          className="absolute text-xs p-1 rounded"
                          style={{
                            backgroundColor: event.color,
                            left: `${(event.start.getHours() / 24) * 100}%`,
                            width: `${
                              ((event.end - event.start) /
                                (1000 * 60 * 60 * 24)) *
                              100
                            }%`,
                            height: "auto",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <div className="font-bold">{event.title}</div>
                          <div>{formatEventTime(event.start, event.end)}</div>
                        </div>
                      ))}
                    {isDragging &&
                      dragSelection &&
                      dragSelection.resourceIndex === resourceIndex &&
                      dragSelection.dayIndex === dayIndex && (
                        <div
                          className="absolute opacity-50 rounded text-xs p-1"
                          style={{
                            backgroundColor: dragColor,
                            left: `${(dragSelection.startHour / 24) * 100}%`,
                            width: `${
                              ((dragSelection.endHour -
                                dragSelection.startHour) /
                                24) *
                              100
                            }%`,
                            height: "2em",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <div className="font-bold">New Event</div>
                          <div>
                            {formatEventTime(
                              new Date(
                                currentYear,
                                currentMonth,
                                date.getDate(),
                                dragSelection.startHour
                              ),
                              new Date(
                                currentYear,
                                currentMonth,
                                date.getDate(),
                                dragSelection.endHour
                              )
                            )}
                          </div>
                        </div>
                      )}
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
