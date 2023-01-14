const API_KEY = '566154f12af4b888131f4f3f898368b9';
const pinCityButton = document.getElementById("addCityToPinned");
let pinnedCities = [];
let lastBrowsedCities = [];
let currCity = null;
const searchButton = document.getElementById("search");
const cityInputField = document.getElementById("city");

searchButton.addEventListener("click", searchWeatherForCity);
pinCityButton.addEventListener("click", pinCurrentCity);
cityInputField.addEventListener("input", autoCompleteSuggest)
cityInputField.addEventListener("blur", function () {
    setTimeout(clearAutoSuggest, 5000);
})

setTimeout(updateCitiesData, 1000 * 60 * 5);

class City {
    constructor(data, displayName, icon, obj = null) {
        if (obj) {
            Object.assign(this, obj)
        } else {
            this.id = generateId(4);
            this.data = data;
            this.displayName = displayName;
            this.icon = icon;
        }
    }

    displayCityWeather() {
        document.getElementById("cityNameHeader").innerHTML = this.displayName;
        document.getElementById("country").innerHTML = this.data.sys.country;
        document.getElementById("weatherMain").innerHTML = this.data.weather[0].main;
        document.getElementById("weatherDesc").innerHTML = this.data.weather[0].description;
        const sunRiseDate = new Date(this.data.sys.sunrise * 1000);
        document.getElementById("sunRise").innerHTML = sunRiseDate.getHours() + ":" + sunRiseDate.getMinutes() + ":" + sunRiseDate.getSeconds();
        const sunSetDate = new Date(this.data.sys.sunset * 1000);
        document.getElementById("sunSet").innerHTML = sunSetDate.getHours() + ":" + sunSetDate.getMinutes() + ":" + sunSetDate.getSeconds();
        document.getElementById("temp").innerHTML = this.data.main.temp;
        document.getElementById("tempMax").innerHTML = this.data.main.temp_max;
        document.getElementById("tempMin").innerHTML = this.data.main.temp_min;
        document.getElementById("pressure").innerHTML = this.data.main.pressure;
        document.getElementById("humidity").innerHTML = this.data.main.humidity;
        document.getElementById("windSpeed").innerHTML = this.data.wind.speed;
        document.getElementById("winDeg").innerHTML = this.data.wind.deg;
        document.getElementById("weatherImage").src = this.icon;
    }

    pinCity() {
        if (pinnedCities.length < 10) {
            pinnedCities.push(this);
        } else {
            const alertDialog = document.getElementById("limitDialog");
            alertDialog.classList.remove('d-none');
            setInterval(function () {
                alertDialog.classList.add('d-none')
            }, 5000);
        }

        displayPinnedCitiesAndLastBrowsedCities();
    }
}

getDataFromLocalStorage();
displayPinnedCitiesAndLastBrowsedCities();

function getDataFromLocalStorage() {
    const pinnedCitiesJson = localStorage.getItem("pinned");
    const lastCitiesJson = localStorage.getItem("history");
    pinnedCities = pinnedCitiesJson != null ? JSON.parse(pinnedCitiesJson) : [];
    lastBrowsedCities = lastCitiesJson != null ? JSON.parse(lastCitiesJson) : [];
}

function displayPinnedCitiesAndLastBrowsedCities() {
    displayHistory();
    displayPinned();
    saveCurrentState();
}

function displayHistory() {
    const list = document.getElementById("lastCheckedCities");
    list.innerHTML = "";

    if (lastBrowsedCities.length > 0) {
        lastBrowsedCities.forEach(city => {
            const el = createLiElement(city, 'history-element');
            list.appendChild(el);
        });
    }
}

function displayPinned() {
    if (pinnedCities.length > 0) {
        const list = document.getElementById("pinnedCities");
        list.innerHTML = "";

        pinnedCities.forEach(city => {
            const el = createLiElement(city, 'pin-element');
            list.appendChild(el);
        });
    }
}

function createLiElement(city, mode) {
    const liElement = document.createElement('li');
    liElement.classList.add('left-side-li');
    liElement.innerHTML = city.displayName + ", <span class='list-city-country'>" + city.data.sys.country + ", " + city.data.weather[0].main + ", " + city.data.main.temp + "&#8451; </span>";
    const image = document.createElement('img');
    image.src = city.icon;
    liElement.appendChild(image);
    
    if (mode == "pin-element") {
        const removeButton = createRemoveButton(city);
        liElement.appendChild(removeButton);
    }
    
    liElement.addEventListener('click', function () {
        currCity = new City(null, null, null, city);
        displayCityWeatherEvent();
    });

    return liElement;
}

function createRemoveButton(city)
{
    const span = document.createElement('span');
    span.innerHTML = "Remove";
    span.classList.add("remove-pin-btn");
    span.addEventListener('click', function () {
        pinnedCities = pinnedCities.filter(data => data.id != city.id);
        displayPinnedCitiesAndLastBrowsedCities();
    });

    return span;
}

function displayCityWeatherEvent() {
    currCity.displayCityWeather();
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
    const searchText = document.getElementById("city").value;
    const data = await fetchWeatherData(searchText);
    const city = new City(data, searchText, `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`, null);
    currCity = city;
    currCity.displayCityWeather();
    
    if (city.data.cod === 200) {
        lastBrowsedCities.push(city);
        
        if (lastBrowsedCities.length > 10) {
            lastBrowsedCities.shift();
        }

        displayPinnedCitiesAndLastBrowsedCities();
    } else {
        alert("City not found");
    }
}

async function fetchWeatherData(searchText)
{
    response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchText}&appid=${API_KEY}&units=metric`);
    const data = await response.json()

    return data;
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

async function updateCitiesData() {
    setInterval(fetchCitiesData, 1000 * 60 * 5);
}

async function fetchCitiesData() {
    for (const city of pinnedCities) {
        const newData = await fetchWeatherData(city.displayName);
        city.data = newData;
    }

    await Promise.all(lastBrowsedCities.map(async (city) => {
        const newData = await fetchWeatherData(city.displayName);
        city.data = newData;
    }));
}

async function autoCompleteSuggest() {
    const text = cityInputField.value;
    const div = document.getElementById("autosuggest");
    
    if (text.length >= 1) {
        const url = `http://geodb-free-service.wirefreethought.com/v1/geo/cities?namePrefix=${text}&hateoasMode=false&limit=5&offset=0`;
        const xhr = new XMLHttpRequest();
        let cities = [];
        div.innerHTML = "";
    
        xhr.open("GET", url);
        xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            cities = JSON.parse(xhr.responseText).data;
            cities.forEach(city => {
                const newDiv = document.createElement("div");
                newDiv.classList.add("auto-suggest-element");
                newDiv.innerHTML = city.name + ", <span class='autos-suggest-country'>" + city.country + "</span>";
                newDiv.addEventListener('click', function () {
                    cityInputField.value = city.name;
                    div.innerHTML = "";
                });
    
                div.appendChild(newDiv);
            });
        }};
        xhr.send();
    } else {
        div.innerHTML = "";
    }
}

function clearAutoSuggest()
{
    const div = document.getElementById("autosuggest");
    div.innerHTML = "";
}