let h1 = document.getElementById("h1");
let h2 = document.getElementById("h2");
let m1 = document.getElementById("m1");
let m2 = document.getElementById("m2");
let colon = document.getElementById("colon");
let wday = document.getElementById("wday");
let day = document.getElementById("day");
let month = document.getElementById("month");
let year = document.getElementById("year");
let temp = document.getElementById("tempdigit");
let temp_feel = document.getElementById("tempdigit_feels");

let fetchedWeather;
let currentWeather = "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
let currentWeather_feel = "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
let curentHour, currentMin;
let colboo = true; // for the ticker
let wSetHour = "0"; // keeps track of alarm hour/min
let wSetMin = "0";

let radiotogglebtn = document.getElementById("radiotoggle");
let radiobtntoggled = false;
let ch1btn = document.getElementById("radioch1");
let ch2btn = document.getElementById("radioch2");
let ch3btn = document.getElementById("radioch3");

let audioWrapper = document.getElementById("audioWrapper");
let weatherBar = document.getElementsByClassName("weather")[0];
weatherBar.style.display = "none";

let alarmIsRinging = false;
function startTime() {
  // Update the time
  let today = new Date();
  h1.innerHTML = addLeadingZero(today.getHours().toString())[0];
  h2.innerHTML = addLeadingZero(today.getHours().toString())[1];
  m1.innerHTML = addLeadingZero(today.getMinutes().toString())[0];
  m2.innerHTML = addLeadingZero(today.getMinutes().toString())[1];
  if (colboo) {
    colon.innerHTML = ":";
    colboo = false;
  } else {
    colon.innerHTML = "";
    colboo = true;
  }
  currentHour = addLeadingZero(today.getHours().toString());
  currentMin = addLeadingZero(today.getMinutes().toString());

  // Update the date
  wday.innerHTML = makeWeekday(today.getDay());
  day.innerHTML = addLeadingZero(today.getDate().toString()) + ".";
  month.innerHTML = addLeadingZero(today.getMonth().toString()) + ".";
  year.innerHTML = today.getFullYear();

  // Update the weather
  temp.innerHTML = currentWeather;
  temp_feel.innerHTML = currentWeather_feel;

  if (alarmIsSet) {
    console.log("alarm is set");
    if (
      addLeadingZero(wSetHour) === currentHour &&
      addLeadingZero(wSetMin) === currentMin
    ) {
      if (!alarmIsRinging) {
        startAudio();
      }
      alarmIsRinging = true;
      console.log("ALARM!");
    } else {
      console.log("alarm should NOT ring");
      console.log(
        "Current/Set Hour:" + currentHour + "/" + addLeadingZero(wSetHour)
      );
      console.log(
        "Current/Set Min:" + currentMin + "/" + addLeadingZero(wSetMin)
      );
    }
  } else {
    console.log("alarm is NOT set or ringing");
  }
  // Init Loop
  let t = setTimeout(startTime, 1000);
}

// Helper functions
// Translates Digit to String
function makeWeekday(number) {
  let wochentage = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  if (number === 0) {
    return wochentage[6];
  } else {
    return wochentage[number - 1];
  }
}

// Add leading 0 for digits < 10
function addLeadingZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

let dataFetched = false;
// Request current weather for Berlin
// from openweathermap with custom appid (api-key)
function loadWeather() {
  let http = new XMLHttpRequest();
  let url =
    "https://api.openweathermap.org/data/2.5/weather?id=2950157&APPID=386371523446a5a1ef1272512c75f28b";
  http.open("GET", url);
  http.send();
  http.onreadystatechange = (e) => {
    if (http.readyState === 4 && http.status === 200) {
      fetchedWeather = JSON.parse(http.responseText);
      currentWeather = parseInt(fetchedWeather.main.temp - 273.15) + "*C";
      currentWeather_feel =
        "&nbsp(" + parseInt(fetchedWeather.main.feels_like - 273.15) + "*C)";
    }
    if (!dataFetched) {
      dataFetched = true;
      temp.innerHTML = currentWeather;
      temp_feel.innerHTML = currentWeather_feel;
      weatherBar.style.display = "flex";
    }
  };
  let t = setTimeout(loadWeather, 60000);
}

// Handle alarm view
let isVisible = false;
let alarmIsSet = false;
let wtitel = document.getElementsByClassName("wtitel")[0];
let whour = document.getElementsByClassName("hlist")[0];
let wmin = document.getElementsByClassName("mlist")[0];
let sButton = document.getElementById("sButton");
let sButton2 = document.getElementById("sButton2");
let setAlarm = document.getElementsByClassName("setAlarm")[0];
let displayedAlarm = document.getElementById("displayedAlarm");
isVisible = false;
wtitel.style.display = "none";
whour.style.display = "none";
wmin.style.display = "none";

sButton.addEventListener("click", () => {
  if (!isVisible) {
    isVisible = true;
    wtitel.style.display = "inline";
    whour.style.display = "inline";
    wmin.style.display = "inline";
  } else {
    isVisible = false;
    wtitel.style.display = "none";
    whour.style.display = "none";
    wmin.style.display = "none";
    console.log(wSetHour + ":" + wSetMin);
    console.log(addLeadingZero(wSetHour) + ":" + addLeadingZero(wSetMin));
    displayedAlarm.innerHTML =
      addLeadingZero(wSetHour) + ":" + addLeadingZero(wSetMin);
  }
});
sButton2.addEventListener("click", () => {
  if (!alarmIsSet) {
    alarmIsSet = true;
    setAlarm.style.display = "inline";
    sButton2.style.color = "#58E658";
  } else {
    alarmIsSet = false;
    alarmIsRinging = false;
    setAlarm.style.display = "none";
    sButton2.style.color = "#588658";
    stopAudio();
  }
});
whour.addEventListener("change", (e) => {
  wSetHour = e.target.value;
});
wmin.addEventListener("change", (e) => {
  wSetMin = e.target.value;
});

let radioSet = false;
let currentStation = null;
let lastStation = 1;

function startAudio() {
  if (radiobtntoggled) {
    console.log("Starting Radio Alarm Station No " + lastStation);
    switchChannel({ path: [{ id: lastStation.toString() }] });
  } else {
    audioWrapper.play();
  }
}
function stopAudio() {
  if (radiobtntoggled) {
    console.log("Stopping Radio Alarm");
    radioElement.pause();
    document.getElementById(currentStation.btn).style.color = "#588658";
  } else {
    audioWrapper.pause();
  }
}

radiotogglebtn.addEventListener("click", () => {
  if (!radiobtntoggled) {
    radiobtntoggled = true;
    radiotogglebtn.style.color = "#58E658";
  } else {
    radiobtntoggled = false;
    radiotogglebtn.style.color = "#588658";
  }
});

const chlist = [
  {
    name: "starfm",
    link: "https://starfm-3.explodio.com/berlin.mp3",
    btn: "radioch1",
  },
  {
    name: "starfm80s",
    link: "https://starfm-4.explodio.com/80er_rock.mp3",
    btn: "radioch2",
  },
  {
    name: "starfm90s",
    link: "https://starfm-4.explodio.com/90er_rock.mp3",
    btn: "radioch3",
  },
];

// event listener for radio channel buttons!
let radioElement = document.createElement("audio");
radioElement.type = "audio/mp3";
radioElement.preload = "none";
let switchChannel = (event) => {
  // handle channel switching on active radio alarm
  if (alarmIsRinging) {
    alarmIsRinging = false;
    alarmIsSet = false;
    setAlarm.style.display = "none";
    sButton2.style.color = "#588658";
  }
  console.log(event);
  const ch = parseInt(event.path[0].id.slice(-1)) - 1;
  lastStation = ch + 1;
  console.log(lastStation);
  radioElement.src = chlist[ch].link + "?" + new Date().getTime();
  if (currentStation) {
    if (currentStation.name === chlist[ch].name) {
      console.log("current station " + currentStation.name);
      console.log("pausing stream");
      document.getElementById(currentStation.btn).style.color = "#588658";
      currentStation = null;
      // stopCh1();
      radioElement.pause();
    } else {
      console.log("switching from " + currentStation.name);
      console.log("switching to " + chlist[ch].name);
      // radioElement.pause();
      document.getElementById(currentStation.btn).style.color = "#588658";
      currentStation = chlist[ch];
      radioElement.play();
      document.getElementById(currentStation.btn).style.color = "#58E658";
    }
  } else {
    console.log("playing " + chlist[ch].name);
    currentStation = chlist[ch];
    radioElement.play();
    document.getElementById(currentStation.btn).style.color = "#58E658";
  }
};
ch1btn.addEventListener("click", switchChannel);
ch2btn.addEventListener("click", switchChannel);
ch3btn.addEventListener("click", switchChannel);

// Start actual Clock Loop
startTime();
loadWeather();
