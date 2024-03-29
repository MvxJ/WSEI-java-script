const API_KEY = '566154f12af4b888131f4f3f898368b9';
const pinCityButton = document.getElementById("addCityToPinned");
let pinnedCities = [];
let lastBrowsedCities = [];
let currCity = null;
let chart = null;
const searchButton = document.getElementById("search");
const cityInputField = document.getElementById("city");

searchButton.addEventListener("click", searchWeatherForCity);
pinCityButton.addEventListener("click", pinCurrentCity);
cityInputField.addEventListener("input", autoCompleteSuggest)
cityInputField.addEventListener("blur", function () {
    setTimeout(clearAutoSuggest, 1000);
})

setTimeout(updateCitiesData, 1000);

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

    addForecast(forecast) {
        this.forecast = forecast;
    }

    displayCityWeather() {
        const currentDate = new Date();
        const dataDiv = document.getElementById("dataDiv");
        const sunRiseDate = new Date(this.data.sys.sunrise * 1000);
        const sunSetDate = new Date(this.data.sys.sunset * 1000);

        if (dataDiv.classList.contains('d-none')) {
            dataDiv.classList.add('d-none');
        }

        document.getElementById("cityNameHeader").innerHTML = "Weather for: " + this.displayName;
        document.getElementById("country").innerHTML = this.data.sys.country;
        document.getElementById("weatherMain").innerHTML = this.data.weather[0].main;
        document.getElementById("weatherDesc").innerHTML = this.data.weather[0].description;
    
        document.getElementById("sunRise").innerHTML = getStringDateFromUnix(sunRiseDate);
        document.getElementById("sunSet").innerHTML = getStringDateFromUnix(sunSetDate);
        document.getElementById("temp").innerHTML = Math.ceil(this.data.main.temp) + "&#8451";
        document.getElementById("tempMax").innerHTML = Math.ceil(this.data.main.temp_max) + "&#8451";
        document.getElementById("tempMin").innerHTML = Math.ceil(this.data.main.temp_min) + "&#8451";
        document.getElementById("pressure").innerHTML = this.data.main.pressure + "hPa";
        document.getElementById("humidity").innerHTML = this.data.main.humidity + "%";
        document.getElementById("windSpeed").innerHTML = this.data.wind.speed + "m/s";
        document.getElementById("winDeg").innerHTML = this.data.wind.deg;
        document.getElementById("weatherImage").src = this.icon;

        this.adjustBackground(currentDate, sunRiseDate, sunSetDate);

        this.displayChart();
    }

    adjustBackground(currentDate, sunRiseDate, sunSetDate) {
        const backgroundDiv = document.getElementById("backgroundImage");
        const customDataBox = document.getElementById("customDataBox");

        if (sunRiseDate > sunSetDate) {
            if (currentDate > sunRiseDate) {
                backgroundDiv.style.backgroundImage = "url(images/day.png)";
                customDataBox.style.color = '#000';
                customDataBox.classList.add('d-day');
                customDataBox.classList.remove('d-night');
            } else {
                backgroundDiv.style.backgroundImage = "url(images/night.png)";
                customDataBox.style.color = '#fff';
                customDataBox.classList.add('d-night');
                customDataBox.classList.remove('d-day');
            }
        } else {
            if (currentDate > sunSetDate) {
                backgroundDiv.style.backgroundImage = "url(images/night.png)";
                customDataBox.style.color = '#fff';
                customDataBox.classList.add('d-night');
                customDataBox.classList.remove('d-day');
            } else {
                backgroundDiv.style.backgroundImage = "url(images/day.png)";
                customDataBox.style.color = '#000';
                customDataBox.classList.add('d-day');
                customDataBox.classList.remove('d-night');
            }
        }
    }

    displayChart() {
        const dataArray = prepareChartData(this.forecast.list);

        chart.options.plugins.title.text = '5 days temperature chart for: ' + this.displayName;
        chart.data.labels = prepareLabels(this.forecast.list);
        chart.data.datasets = [        
            {
                label: 'Avg Temperature ℃',
                data: Object.values(dataArray.avg),
                borderWidth: 1
            },
            {
                label: 'Min Temperature ℃',
                data: Object.values(dataArray.min),
                borderWidth: 1
            },
            {
                label: 'Max Temperature ℃',
                data: Object.values(dataArray.max),
                borderWidth: 1
            }
        ];

        chart.update();
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
prepareChart();

if (pinnedCities.length > 0) {
    const city = new City(null, null, null, pinnedCities[0]);
    currCity = city;
    city.displayCityWeather();
} else if (lastBrowsedCities.length > 0) {
    const city = new City(null, null, null, lastBrowsedCities[lastBrowsedCities.length - 1]);
    currCity = city;
    city.displayCityWeather();
} else {
    const dataDiv = document.getElementById("dataDiv");
    dataDiv.classList.add('d-none');
    document.getElementById("cityNameHeader").innerHTML = "Please search for city...";
}

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

function prepareChart() {
    const ctx = document.getElementById('weatherChart');
    const context = ctx.getContext('2d');

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: ''
                }
            }
        }
    });
}

function getStringDateFromUnix(date) {
    let string = '';
    
    if (date.getHours() < 10) {
        string += '0' + date.getHours() + ":";
    } else {
        string += date.getHours() + ":";
    }

    if (date.getMinutes() < 10) {
        string += '0' + date.getMinutes() + ":";
    } else {
        string += date.getMinutes() + ":";
    }

    if (date.getSeconds() < 10) {
        string += '0' + date.getSeconds();
    } else {
        string += date.getSeconds();
    }
    
    return string;
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
    const list = document.getElementById("pinnedCities");
    list.innerHTML = "";

    if (pinnedCities.length > 0) {

        pinnedCities.forEach(city => {
            const el = createLiElement(city, 'pin-element');
            list.appendChild(el);
        });
    }
}

function createLiElement(city, mode) {
    const liElement = document.createElement('li');
    liElement.classList.add('left-side-li');
    liElement.innerHTML = city.displayName + ", <span class='list-city-country'>" + city.data.sys.country + ", " + city.data.weather[0].main + ", " + Math.ceil(parseInt(city.data.main.temp)) + "&#8451; </span>";
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
        if (pinnedCities.length > 1) {
            pinnedCities = pinnedCities.filter(data => data.id != city.id);
        } else {
            pinnedCities = [];
        }

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
    const forecast = await fetchForecast(city.data.coord.lat, city.data.coord.lon);
    city.addForecast(forecast);
    currCity = city;
    currCity.displayCityWeather();
    
    if (city.data.cod === 200) {
        lastBrowsedCities.push(city);
        
        if (lastBrowsedCities.length > 10) {
            lastBrowsedCities.shift();
        }

        displayPinnedCitiesAndLastBrowsedCities();
    } else {
        const alertDialog = document.getElementById("limitDialog");
        alertDialog.classList.remove('d-none');
        setInterval(function () {
            alertDialog.classList.add('d-none')
        }, 5000);
    }
}

async function fetchWeatherData(searchText)
{
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchText}&appid=${API_KEY}&units=metric`);
    const data = await response.json();

    return data;
}

async function fetchForecast(lat, lon)
{
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const data = await response.json();

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
        const newForecast = await fetchForecast(city.data.coord.lat, city.data.coord.lon);
        city.data = newData;
        city.forecast = newForecast;
    }

    await Promise.all(lastBrowsedCities.map(async (city) => {
        const newData = await fetchWeatherData(city.displayName);
        const newForecast = await fetchForecast(city.data.coord.lat, city.data.coord.lon);
        city.forecast = newForecast;
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
    
        const data = await fetch(url);
        cities = await data.json();
        await displaSugestions(cities);
    } else {
        div.innerHTML = "";
    }
}

function displaSugestions(cities) {
    const div = document.getElementById("autosuggest");
    for (i = 0; i < cities.data.length; i++) {
        const newDiv = document.createElement("div");
        newDiv.classList.add("auto-suggest-element");
        newDiv.innerHTML = cities.data[i].name + ", <span class='autos-suggest-country'>" + cities.data[i].country + "</span>";
        const name = cities.data[i].name;
        newDiv.addEventListener('click', function () {
            cityInputField.value = name;
        });

        div.appendChild(newDiv);
    }
}

function clearAutoSuggest()
{
    const div = document.getElementById("autosuggest");
    div.innerHTML = "";
}

function prepareChartData(list) {
    const table = {
        min: [],
        max: [],
        avg: []
    }

    list.forEach(element => {
        const date = new Date(element.dt * 1000).toLocaleDateString("en-US");
        
        if (!table.min[date]) {
            table.min[date] = parseFloat(element.main.temp_min);
        } else {
            table.min[date] > element.main.temp_min ? table.min[date] = parseFloat(element.main.temp_min) : table.min[date];
        }

        if (!table.max[date]) {
            table.max[date] = parseFloat(element.main.temp_max);
        } else {
            table.max[date] > element.main.temp_max ? table.min[date] = parseFloat(element.main.temp_max) : table.min[date];
        }
    });
    
    const keys = Object.keys(table.min);
    keys.forEach(key => {
        table.avg[key] = (parseFloat(table.max[key]) + parseFloat(table.min[key]))/2

    });

    return table;
}

function prepareLabels(list) {
    const table = [];

    list.forEach(element => {
        const date = new Date(element.dt * 1000).toLocaleDateString("en-US");
        if (!table.includes(date)) {
            table.push(date);
        }
    });

    return table;
}