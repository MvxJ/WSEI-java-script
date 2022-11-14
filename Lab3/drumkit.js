const sounds = {
    q: './sounds/mixkit-bad-joke-drums-2893.wav', 
    w: './sounds/mixkit-cool-guitar-riff-2321.wav', 
    e: './sounds/mixkit-drum-and-percussion-545.wav', 
    r: './sounds/mixkit-drum-bass-hit-2294.wav',
    t: './sounds/mixkit-drum-joke-accent-579.wav', 
    y: './sounds/mixkit-electric-guitar-distorted-slide-2340.wav', 
    u: './sounds/mixkit-funny-cartoon-tones-2892.wav', 
    i: './sounds/mixkit-futuristic-bass-hit-2303.wav', 
    o: './sounds/mixkit-guitar-notification-alert-2320.wav',
    p: './sounds/mixkit-hand-tribal-drum-562.wav', 
    a: './sounds/mixkit-happy-guitar-chords-2319.wav',
    s: './sounds/mixkit-joke-drums-578.wav', 
    d: './sounds/mixkit-negative-tone-interface-tap-2569.wav',
    f: './sounds/mixkit-short-bass-hit-2299.wav',
    g: './sounds/mixkit-short-guitar-riff-2322.wav', 
    h: './sounds/mixkit-short-guitar-strum-2318.wav', 
    j: './sounds/mixkit-toy-drums-and-bell-ding-560.wav', 
    k: './sounds/mixkit-tribal-dry-drum-558.wav',
    metronom: './sounds/mixkit-tribal-dry-drum-558.wav' 
};
const addWaveButton = document.getElementById('addNewWave');
const removeWaveButton = document.getElementById('removeWave');
const playSelected = document.getElementById("playSelected");
const playAll = document.getElementById("playAll");
const metronom = document.getElementById("metronom");
const box = document.getElementById('keyboard');
const soundBox = document.getElementById('soundBox');
const waveBox = document.querySelector(".waves");
let interval = null;
let records = {};

addWaveButton.addEventListener("click", addWave);
removeWaveButton.addEventListener("click", removeWave);
playSelected.addEventListener("click", playSelectedRecords);
playAll.addEventListener("click", playAllRecords);

for (var i = 0; i < 4; i++) {
    const newWave = document.createElement('div');
    newWave.classList.add('wave');
    newWave.id = generateId(6);

    if (i === 0) {
        newWave.classList.add('activeWave');
    }

    newWave.addEventListener("click", setAsActiveWave);
    addPlayCheckBox(newWave);
    addClearWaveRecordButton(newWave);

    waveBox.appendChild(newWave);
}

Object.keys(sounds).forEach(key => {
    if (key != "metronom") {
        const newKey = document.createElement('div');
        newKey.classList.add('key-box');
        newKey.classList.add('btn')
        newKey.id = key;
        newKey.textContent = key;
        box.appendChild(newKey);
    }

    const sound = document.createElement('audio');
    sound.src = sounds[key];
    sound.id = 'audio-' + key;
    soundBox.appendChild(sound);
});

document.addEventListener("keypress", onKeyPress);

metronom.addEventListener("click", event => {
    if (metronom.classList.contains("inActiveMetronom")) {
        metronom.classList.replace("inActiveMetronom", "activeMetronom");
        const repeatPerMin = document.getElementById("repeatPerMin").value;
        metronom.classList.replace('btn-success', 'btn-danger');
        interval = setInterval(playMetronom, (60000/repeatPerMin));
    } else {
        metronom.classList.replace("activeMetronom", "inActiveMetronom");
        metronom.classList.replace('btn-danger', 'btn-success');
        const audio = document.getElementById('audio-metronom');
        audio.pause();
        audio.currentTime = 0;
        clearInterval(interval);
    }
});

function playMetronom(repeat) {
    playSound("metronom");
}

function addWave() {
    const newWave = document.createElement('div');
    const currentWave = document.querySelector('.activeWave');

    newWave.classList.add('wave');
    newWave.classList.add('activeWave');
    newWave.addEventListener("click", setAsActiveWave);
    newWave.id = generateId(6);
    addPlayCheckBox(newWave);
    addClearWaveRecordButton(newWave);
    currentWave.classList.remove('activeWave');

    waveBox.appendChild(newWave);
}

function removeWave() {
    const currentWave = document.querySelector('.activeWave');
    waveBox.removeChild(currentWave);

    if (currentWave.id in records) {
        delete records[currentWave.id];
    }

    const waves = document.querySelectorAll('.wave');
    waves[0].classList.add('activeWave');
}

function setAsActiveWave(event) {
    const currentWave = document.querySelector('.activeWave');
    currentWave.classList.remove('activeWave');
    event.srcElement.classList.add('activeWave');
}

function addPlayCheckBox(element) {
    const checkBox = document.createElement('input');
    checkBox.type = "checkbox";
    checkBox.classList.add('playCheckBox');
    checkBox.value = element.id;

    element.appendChild(checkBox);
}

function addClearWaveRecordButton(element) {
    const button = document.createElement('div');
    button.classList.add('clearWaveBtn');
    button.textContent = "Clear wave";
    button.addEventListener("click", event => {
        records[element.id] = [];
    });

    element.appendChild(button);
}

function onKeyPress(event) {
    const letter = event.key.toLowerCase();
    const keyBox = document.getElementById(letter);
    playSound(letter);
    addSoundToWave(letter);
}

function playSound(letter) {
    const audio = document.getElementById('audio-' + letter);
    audio.play();
}

function generateId(length) {
    let id = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        id += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return id;
}

function addSoundToWave(letter) {
    const activeWave = document.querySelector('.activeWave');

    if (!(activeWave.id in records)) {
        records[activeWave.id] = [];
    }

    records[activeWave.id].push({audio: document.getElementById('audio-' + letter), startTime: new Date()});
}

function playSelectedRecords() {
    const selectedWaves = getWavesToPlay(true);
    prepareTrack(selectedWaves);
}

function playAllRecords() {
    const selectedWaves = getWavesToPlay(false);
    prepareTrack(selectedWaves);
}

function prepareTrack(waves) {
    const playInLoop = document.getElementById("playInLoop");
    const waveLength = document.getElementById("timeInSeconds").value;
    const interval = waveLength*1000;

    if (playInLoop.checked == 1) {
        playTracks(waves);
        const task = setInterval(function () {playTracks(waves)}, interval);
    } else {
        playTracks(waves);
    }
}

function playTracks(waves) {
    const waveLength = document.getElementById("timeInSeconds").value;

    if (Object.keys(records).length > 0) {
        waves.forEach(wave => {
            if (wave in records) {
                let currentTime = 0;
                Object.keys(records[wave]).forEach(key => {
                    if (key == 0) {
                        currentTime = 0;
                    } else {
                        currentTime += records[wave][key].startTime.getTime() - records[wave][key - 1].startTime.getTime();
                    }
                    
                    if (currentTime < waveLength*1000) {
                        setTimeout(function () {
                            records[wave][key].audio.play();
                        }, (currentTime));
                    } else {
                        console.log("Your record is longer than wave length!");
                    }
                });
            }
        });
    }
}

function getWavesToPlay(getOnlyChecked) {
    const checkBoxes = document.querySelectorAll('.playCheckBox');
    const selectedWaves = [];

    if (getOnlyChecked == true) {
        checkBoxes.forEach(box => {
            if (box.checked) {
                selectedWaves.push(box.value)
            }
        });
    } else {
        checkBoxes.forEach(box => {
            selectedWaves.push(box.value)
        });
    }

    return selectedWaves;
}