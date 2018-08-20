import document from "document";
import * as messaging from "messaging";
import { today } from "user-activity";

let sleepAYearAgo = document.getElementById("sleep_a_year_ago");
let sleepToday = document.getElementById("sleep_today");

let stepsAyearAgo = document.getElementById("steps_a_year_ago");
let stepsToday = document.getElementById("steps_today");

// Message is received from companion
messaging.peerSocket.onmessage = evt => {
  sleepAYearAgo.text = getHoursAndMinutes(evt.data.totalMinutesAsleepAYearAgo);
  sleepToday.text = getHoursAndMinutes(evt.data.totalMinutesAsleep);

  stepsAyearAgo.text = evt.data.steps;
  stepsToday.text = today.steps;
};


function getHoursAndMinutes(totalMinutes) {
  let hours = Math.floor(totalMinutes / 60);
  let minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes}m`;
  } else {
    return `${hours}h ${minutes}m`;
  }
}