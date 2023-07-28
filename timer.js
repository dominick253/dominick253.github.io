document.addEventListener("DOMContentLoaded", (event) => {
  let workTime, restTime, intervals;
  let intervalId;
  let isWorking = false;
  let timeLeft;

  document.getElementById("startButton").addEventListener("click", startTimer);
  document.getElementById("stopButton").addEventListener("click", stopTimer);
  document.getElementById("statusDisplay").textContent = "Workout Timer";

  function startTimer() {
    workTime = document.getElementById("workTime").value;
    restTime = document.getElementById("restTime").value;
    intervals = document.getElementById("intervals").value;

    isWorking = true;
    timeLeft = workTime;
    document.getElementById("statusDisplay").textContent = "Work";

    updateDisplay();
    updateBackground("green");
    intervalId = setInterval(tick, 1000);
  }

  function stopTimer() {
    clearInterval(intervalId);
    document.getElementById("statusDisplay").textContent = "";
    updateBackground("#3e3c39");
  }

  function tick() {
    timeLeft--;
    if (timeLeft < 1) {
      if (isWorking) {
        if (intervals > 1) {
          intervals--;
          isWorking = false;
          timeLeft = restTime;
          document.getElementById("statusDisplay").textContent = "Rest";
          updateBackground("blue");
        } else {
          stopTimer();
          document.getElementById("statusDisplay").textContent =
            "Workout Timer";
        }
      } else {
        isWorking = true;
        timeLeft = workTime;
        document.getElementById("statusDisplay").textContent = "Work";
        updateBackground("green");
      }
    }
    updateDisplay();
  }

  function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    document.getElementById("timerDisplay").textContent = `${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
    document.getElementById("intervalDisplay").textContent = intervals;
  }

  function updateBackground(color) {
    document.getElementById("timer-div").style.backgroundColor = color;
  }
});
