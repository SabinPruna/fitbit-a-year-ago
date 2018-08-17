import document from "document";
import * as messaging from "messaging";

let sleepAYearAgo = document.getElementById("sleep_a_year_ago");
let sleepToday = document.getElementById("sleep_today");

// Message is received from companion
messaging.peerSocket.onmessage = evt => {
  sleepAYearAgo.text = evt.data.totalMinutesAsleepAYearAgo;
  sleepToday.text = evt.data.totalMinutesAsleep;
};
