const API_KEY = 'e351dbe1573e0eeb31f8120c0f39fc45';
const pinCityButton = document.getElementById("addCityToPinned");
const pinnedCities = localStorage.getItem("pinnedCities");
const lastBrowsedCities = localStorage.getItem("lastBrowsedCities");

pinCityButton.addEventListener("click", pinCurrentCity());

function pinCurrentCity() {

}

// const options = {
// 	method: 'GET',
// 	headers: {
// 		'X-RapidAPI-Key': 'SIGN-UP-FOR-KEY',
// 		'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
// 	}
// };

// fetch('', options)
// 	.then(response => response.json())
// 	.then(response => console.log(response))
// 	.catch(err => console.error(err));