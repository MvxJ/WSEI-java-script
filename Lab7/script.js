const API_KEY = '566154f12af4b888131f4f3f898368b9';
const pinCityButton = document.getElementById("addCityToPinned");
let pinnedCities = [];
let lastBrowsedCities = [];
let currCity = null;
const searchButton = document.getElementById("search");

searchButton.addEventListener("click", searchWeatherForCity);
pinCityButton.addEventListener("click", pinCurrentCity);

class City {
    constructor(data, displayName) {
        this.id = generateId(4);
        this.data = data;
        this.displayName = displayName;
    }

    displayCityWeather() {

    }

    pinCity() {
        if (pinnedCities < 0) {
            pinnedCities.push(this);
        } else {
            const alertDialog = document.getElementById("limitDialog");
            alertDialog.classList.remove('d-none');
            setInterval(function () {
                alertDialog.classList.add('d-none')
            }, 5000);
        }
    }
}

getDataFromLocalStorage();
displayPinnedCitiesAndLastBrowsedCities();

window.onbeforeunload = saveCurrentState; 

function getDataFromLocalStorage() {
    const pinnedCitiesJson = localStorage.getItem("pinned");
    const lastCitiesJson = localStorage.getItem("history");
    pinnedCities = JSON.parse(pinnedCitiesJson);
    lastBrowsedCities = JSON.parse(lastCitiesJson);
}

function displayPinnedCitiesAndLastBrowsedCities() {
    displayHistory();
    displayPinned();
}

function displayHistory() {
    const list = document.getElementById("lastCheckedCities");
    list.innerHTML = "";

    if (lastBrowsedCities.length > 0) {
        lastBrowsedCities.forEach(city => {
            const el = createLiElement(city);
            list.appendChild(el);
        });
    }
}

function displayPinned() {
    if (pinnedCities.length > 0) {
        const list = document.getElementById("pin");
        list.innerHTML = "";

        pinnedCities.forEach(city => {
            const el = createLiElement(city);
            list.appendChild(el);
        });
    }
}

function createLiElement(city) {
    const liElement = document.createElement('li');
    liElement.classList.add('left-side-li');
    liElement.innerHTML = city.displayName;

    return liElement;
}

function pinCurrentCity() {
    currCity.pinCity();
}

function saveCurrentState() {
    const pinnedCitiesString = JSON.stringify(pinnedCities);
    localStorage.setItem("pinned", pinnedCitiesString);

    const lastBrowsedCitiesString = JSON.stringify(lastBrowsedCities);
    localStorage.setItem("history", lastBrowsedCitiesString);
}

async function searchWeatherForCity()
{
    const city = await fetchWeatherData();
    currCity = city;
    
    if (city.data.cod === 200) {
        lastBrowsedCities.push(city);
        
        if (lastBrowsedCities.length > 10) {
            lastBrowsedCities.shift();
        }

        displayPinnedCitiesAndLastBrowsedCities();
        //TODO:: Display weather data
    } else {
        alert("City not found");
    }
}

async function fetchWeatherData()
{
    const searchText = document.getElementById("city").value;
    response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchText}&appid=${API_KEY}&units=metric`);
    const data = await response.json()
    const city = new City(data, searchText);

    return city;
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

// function getLocation() {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition((position) => {
//             _viewModel.currentPosition = position
//             _viewModel.getAddressFromLatLng(position)
//             _viewModel.fetchWeatherDataFromLatLng(position)
//             console.log(_viewModel.currentPosition)
//         });
//         console.log(navigator.geolocation)
//     } else {
//         x.innerHTML = "Geolocation is not supported by this browser.";
//     }
// }