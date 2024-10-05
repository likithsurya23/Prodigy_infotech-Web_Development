let timer;
let isRunning = false;
let hours = 0, minutes = 0, seconds = 0, milliseconds = 0;
let savedIntervals = [];

function startStopwatch() {
    if (!isRunning) {
        isRunning = true;
        timer = setInterval(updateDisplay, 10); // Update every 10ms for accuracy
        document.getElementById('startStop').textContent = 'Pause';
    } else {
        isRunning = false;
        clearInterval(timer);
        document.getElementById('startStop').textContent = 'Start';
    }
}

function resetStopwatch() {
    isRunning = false;
    clearInterval(timer);
    hours = 0;
    minutes = 0;
    seconds = 0;
    milliseconds = 0;
    document.getElementById('display').textContent = '00:00:00.000';
    document.getElementById('startStop').textContent = 'Start';
    savedIntervals = [];
    document.getElementById('savedIntervals').innerHTML = '';
}

function updateDisplay() {
    milliseconds += 10;
    if (milliseconds == 1000) {
        milliseconds = 0;
        seconds++;
        if (seconds == 60) {
            seconds = 0;
            minutes++;
            if (minutes == 60) {
                minutes = 0;
                hours++;
            }
        }
    }

    let displayHours = hours < 10 ? '0' + hours : hours;
    let displayMinutes = minutes < 10 ? '0' + minutes : minutes;
    let displaySeconds = seconds < 10 ? '0' + seconds : seconds;
    let displayMilliseconds = milliseconds < 100 ? '0' + (milliseconds < 10 ? '0' + milliseconds : milliseconds) : milliseconds;

    document.getElementById('display').textContent = `${displayHours}:${displayMinutes}:${displaySeconds}.${displayMilliseconds}`;
}

function saveInterval() {
    let currentTime = document.getElementById('display').textContent;
    savedIntervals.push(currentTime);
    displaySavedIntervals();
}

function displaySavedIntervals() {
    let intervalsHTML = savedIntervals.map((time, index) => `<p>Interval ${index + 1}: ${time}</p>`).join('');
    document.getElementById('savedIntervals').innerHTML = intervalsHTML;
}

document.getElementById('startStop').addEventListener('click', startStopwatch);
document.getElementById('reset').addEventListener('click', resetStopwatch);
document.getElementById('saveInterval').addEventListener('click', saveInterval);
