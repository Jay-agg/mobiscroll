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

  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem("events");
    return savedEvents
      ? JSON.parse(savedEvents).map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }))
      : [];
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const [dragSelection, setDragSelection] = useState(null);
  const [dragColor, setDragColor] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const [isDraggingEvent, setIsDraggingEvent] = useState(false);
  const dragRef = useRef(null);

  const [resources, setResources] = useState(() => {
    const savedResources = localStorage.getItem("resources");
    return savedResources
      ? JSON.parse(savedResources)
      : ["Resource A", "Resource B", "Resource C", "Resource D", "Resource E"];
  });

  const [newResource, setNewResource] = useState("");

  useEffect(() => {
    localStorage.setItem("currentMonth", currentMonth);
    localStorage.setItem("currentYear", currentYear);
  }, [currentMonth, currentYear]);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem("resources", JSON.stringify(resources));
  }, [resources]);

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

  const daysArray = Array.from(
    { length: daysInMonth(currentMonth, currentYear) },
    (_, i) => new Date(currentYear, currentMonth, i + 1)
  );

  const getCellDate = (dayIndex) => {
    const date = daysArray[dayIndex];
    return new Date(currentYear, currentMonth, date.getDate());
  };

  const handleMouseDown = (resourceIndex, dayIndex, event) => {
    if (selectedEvent) {
      setSelectedEvent(null);
      return;
    }

    setIsDragging(true);
    const cellWidth = event.currentTarget.clientWidth;
    const offsetX = event.nativeEvent.offsetX;
    const startHour = Math.floor((offsetX / cellWidth) * 24);
    setDragStart({ resourceIndex, dayIndex, startHour });
    dragRef.current = { resourceIndex, dayIndex, startHour };

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
    setIsResizing(false);
    setIsDraggingEvent(false);
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

      setDragSelection({
        resourceIndex,
        dayIndex,
        startHour: dragStart.startHour,
        endHour,
      });
    } else if (isResizing && selectedEvent !== null) {
      const cellRect = event.currentTarget.getBoundingClientRect();
      const offsetX = Math.min(
        Math.max(event.clientX - cellRect.left, 0),
        cellRect.width
      );
      const cellWidth = cellRect.width;
      const endHour = Math.floor((offsetX / cellWidth) * 24);
      const updatedEvent = { ...selectedEvent };
      updatedEvent.end.setHours(endHour);
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event === selectedEvent ? updatedEvent : event
        )
      );
      setDragEnd({ resourceIndex, dayIndex, endHour });
    } else if (isDraggingEvent && selectedEvent !== null) {
      const cellRect = event.currentTarget.getBoundingClientRect();
      const offsetX = Math.min(
        Math.max(event.clientX - cellRect.left, 0),
        cellRect.width
      );
      const cellWidth = cellRect.width;
      const startHour = Math.floor((offsetX / cellWidth) * 24);
      const updatedEvent = { ...selectedEvent };
      const dayDifference = dayIndex - dragStart.dayIndex;
      const hourDifference = startHour - dragStart.startHour;
      const newStart = new Date(updatedEvent.start);
      newStart.setDate(newStart.getDate() + dayDifference);
      newStart.setHours(newStart.getHours() + hourDifference);
      const newEnd = new Date(updatedEvent.end);
      newEnd.setDate(newEnd.getDate() + dayDifference);
      newEnd.setHours(newEnd.getHours() + hourDifference);

      updatedEvent.start = newStart;
      updatedEvent.end = newEnd;

      setDragStart({ resourceIndex, dayIndex, startHour });
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event === selectedEvent ? updatedEvent : event
        )
      );
    }
  };

  const handleEventMouseDown = (event, eventIndex, e) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setIsDraggingEvent(true);
    setDragStart({
      resourceIndex: resources.indexOf(event.resource),
      dayIndex: event.start.getDate() - 1,
      startHour: event.start.getHours(),
    });
  };

  const handleEventResizeMouseDown = (event, e) => {
    e.stopPropagation();
    setIsResizing(true);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Delete" && selectedEvent) {
      if (window.confirm("Are you sure you want to delete this event?")) {
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event !== selectedEvent)
        );
        setSelectedEvent(null);
      }
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

  const handleAddResource = (e) => {
    e.preventDefault();
    if (newResource.trim() !== "") {
      setResources((prevResources) => [...prevResources, newResource.trim()]);
      setNewResource("");
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedEvent]);

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
      <form
        onSubmit={handleAddResource}
        className="absolute left-0 top-12 z-20 flex p-2 bg-gray-200 w-full"
      >
        <input
          type="text"
          value={newResource}
          onChange={(e) => setNewResource(e.target.value)}
          placeholder="Add new resource"
          className="p-1 border border-gray-400 rounded-l-xl "
        />
        <button
          type="submit"
          className=" p-2 bg-blue-500 text-white rounded-r-xl"
        >
          +
        </button>
      </form>
      <div className="overflow-x-auto w-full left-0 absolute mt-20">
        <table className="table-fixed border border-black w-full">
          <thead className="sticky top-0 z-10 ">
            <tr>
              <th className="w-32 p-2 border  font-normal"></th>
              {daysArray.map((date) => {
                const isToday =
                  date.getDate() === new Date().getDate() &&
                  date.getMonth() === new Date().getMonth() &&
                  date.getFullYear() === new Date().getFullYear();
                return (
                  <th
                    key={date}
                    className={`p-2 border text-center w-32 font-normal ${
                      isToday ? "bg-yellow-300" : ""
                    }`}
                  >
                    {dayNames[date.getDay()]} {date.getDate()}
                  </th>
                );
              })}
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
                          className={`absolute text-xs p-2 rounded ${
                            selectedEvent === event
                              ? "border border-dotted border-black"
                              : ""
                          }`}
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
                            alignItems: "flex-start",
                            justifyContent: "center",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            opacity: selectedEvent === event ? 1 : 0.9,
                            cursor: "pointer",
                          }}
                          onMouseDown={(e) =>
                            handleEventMouseDown(event, eventIndex, e)
                          }
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = "1";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.opacity =
                              selectedEvent === event ? "1" : "0.9";
                          }}
                        >
                          <div className="font-bold">{event.title}</div>
                          <div>{formatEventTime(event.start, event.end)}</div>
                          <div
                            className="absolute right-0 bottom-0 w-3 h-3 bg-black"
                            onMouseDown={(e) =>
                              handleEventResizeMouseDown(event, e)
                            }
                          ></div>
                        </div>
                      ))}
                    {isDragging &&
                      dragSelection &&
                      dragSelection.resourceIndex === resourceIndex &&
                      dragSelection.dayIndex === dayIndex && (
                        <div
                          className="absolute opacity-50 rounded text-xs p-2"
                          style={{
                            backgroundColor: dragColor,
                            left: `${(dragSelection.startHour / 24) * 100}%`,
                            width: `${
                              ((dragSelection.endHour -
                                dragSelection.startHour) /
                                24) *
                              100
                            }%`,
                            height: "auto",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
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
