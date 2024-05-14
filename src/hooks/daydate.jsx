import React from "react";

const daydate = (year, month) => {
  const numDays = new Date(year, month, 0).getDate();
  const datesArray = [];

  for (let i = 1; i <= numDays; i++) {
    const currentDate = new Date(year, month - 1, i);
    const dayOfWeek = currentDate.getDay(); // 0 (Sunday) to 6 (Saturday)
    datesArray.push({ date: i, dayOfWeek });
  }

  return datesArray;
};

export default daydate;
