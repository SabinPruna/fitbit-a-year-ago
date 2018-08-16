import * as messaging from "messaging";
import { settingsStorage } from "settings";

// Fetch Sleep Data from Fitbit Web API
function fetchSleepData(accessToken) {
  let date = new Date();
  let sleepData = {};
  let todayDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`; //YYYY-MM-DD
  let aYearAgoDate = `${date.getFullYear() - 1}-${date.getMonth() + 1}-${date.getDate()}`;

  // Sleep API docs - https://dev.fitbit.com/reference/web-api/sleep/
  fetch(`https://api.fitbit.com/1.2/user/-/sleep/date/${todayDate}.json`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  })
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      sleepData.totalMinutesAsleep = data.summary.totalMinutesAsleep;
    })
    .catch(err => console.log('[FETCH]: ' + err));

  fetch(`https://api.fitbit.com/1.2/user/-/sleep/date/${aYearAgoDate}.json`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  })
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      sleepData.totalMinutesAsleepAYearAgo = data.summary.totalMinutesAsleep;
    })
    .catch(err => console.log('[FETCH]: ' + err));

  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(sleepData);
  }

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
      fetchSleepData(data.access_token);
    }
  }
}

// Message socket opens
messaging.peerSocket.onopen = () => {
  restoreSettings();
};
