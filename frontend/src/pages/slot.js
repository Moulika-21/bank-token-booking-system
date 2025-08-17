// Slot.js
import React from "react";
import "../components/slot.css"; // optional for styles

export default function Slot({ time, isBooked, isSelected, onClick }) {
  let className = "slot";
  if (isBooked) className += " booked"; // already booked slots
  else if (isSelected) className += " selected"; // currently selecting

  return (
    <div className={className} onClick={!isBooked ? onClick : null}>
      {time}
    </div>
  );
}
