import * as messaging from "messaging";
import { settingsStorage } from "settings";

var userData = {};

function fetchAllData(accessToken) {
  fetchSleepData(accessToken);
  fetchStepsData(accessToken);
}


// Fetch Sleep Data from Fitbit Web API
function fetchSleepData(accessToken) {
  let date = new Date();
  let todayDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`; //YYYY-MM-DD
  let aYearAgoDate = `${date.getFullYear() - 1}-${date.getMonth() + 1}-${date.getDate()}`;

  // Sleep API docs - https://dev.fitbit.com/reference/web-api/sleep/
  fetch(`https://api.fitbit.com/1.2/user/-/sleep/date/${todayDate}.json`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Access-Control-Allow-Origin": "*"
    }
  })
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      userData.totalMinutesAsleep = data.summary.totalMinutesAsleep;
    })
    .catch(err => console.log('[FETCH]: ' + err));

  fetch(`https://api.fitbit.com/1.2/user/-/sleep/date/${aYearAgoDate}.json`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Access-Control-Allow-Origin": "*"
    }
  })
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      userData.totalMinutesAsleepAYearAgo = data.summary.totalMinutesAsleep;

      if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        messaging.peerSocket.send(userData);
      }
    })
    .catch(err => console.log('[FETCH]: ' + err));
}

function fetchStepsData(accessToken) {
  let date = new Date();
  let aYearAgoDate = `${date.getFullYear() - 1}-${date.getMonth() + 1}-${date.getDate()}`;

  fetch(`https://api.fitbit.com/1/user/-/activities/date/${aYearAgoDate}.json`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Access-Control-Allow-Origin": "*"
    }
  })
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log(data.steps);
      userData.steps = data.steps;
      if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        console.log(userData.steps);
        messaging.peerSocket.send(userData);
      }
    })
    .catch(err => console.log('[FETCH]: ' + err));
}


// A user changes Settings
settingsStorage.onchange = evt => {
  if (evt.key === "oauth") {
    // Settings page sent us an oAuth token
    let data = JSON.parse(evt.newValue);
    fetchSleepData(data.access_token);
  }
};

// Restore previously saved settings and send to the device
function restoreSettings() {
  for (let index = 0; index < settingsStorage.length; index++) {
    let key = settingsStorage.key(index);
    if (key && key === "oauth") {
      // We already have an oauth token
      let data = JSON.parse(settingsStorage.getItem(key))
      fetchAllData(data.access_token);
    }
  }
}

// Message socket opens
messaging.peerSocket.onopen = () => {
  restoreSettings();
};


