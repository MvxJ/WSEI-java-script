const API_KEY = '566154f12af4b888131f4f3f898368b9';
const pinCityButton = document.getElementById("addCityToPinned");
const pinnedCities = localStorage.getItem("pinnedCities");
const lastBrowsedCities = localStorage.getItem("lastBrowsedCities");
const searchButton = document.getElementById("search");


searchButton.addEventListener("click", searchWeatherForCity);
pinCityButton.addEventListener("click", pinCurrentCity);

function pinCurrentCity() {

}
async function searchWeatherForCity()
{
    const data = await fetchWeatherData('search');
    
    if (data.cod === 200) {
        //TODO:: Display city data
    } else {
        alert("City not found");
    }
}

async function fetchWeatherData(mode)
{
    let response = null;
    if (mode == 'search') {
        const searchText = document.getElementById("city").value;
        response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchText}&appid=${API_KEY}&units=metric`);
    } else if (mode == 'location') {
        response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    }

    const data = await response.json()

    return data;
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