const apiKey = "a9e473b6fc442f706ca4920579611a58";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector("#search-btn");
const weatherIcon = document.querySelector(".weather-icon");
const weatherCondition = document.querySelector(".weather-condition"); // Reference to weather condition text element
const errorDiv = document.querySelector(".error");

async function checkWeather(query) {
    try {
        const response = await fetch(`${apiUrl}&${query}&appid=${apiKey}`);
        const data = await response.json();

        if (data.cod === "404") {
            throw new Error("City not found");
        }

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + "km/h";

        // Update the weather icon based on weather condition
        if (data.weather[0].main === "Clouds") {
            weatherIcon.src = "weather-app-img/images/clouds.png";
            weatherCondition.textContent = "Cloudy"; // Update weather condition text
        } else if (data.weather[0].main === "Clear") {
            weatherIcon.src = "weather-app-img/images/clear.png";
            weatherCondition.textContent = "Clear"; // Update weather condition text
        } else if (data.weather[0].main === "Rain") {
            weatherIcon.src = "weather-app-img/images/rain.png";
            weatherCondition.textContent = "Rainy"; // Update weather condition text
        } else if (data.weather[0].main === "Drizzle") {
            weatherIcon.src = "weather-app-img/images/drizzle.png";
            weatherCondition.textContent = "Drizzle"; // Update weather condition text
        } else if (data.weather[0].main === "Mist") {
            weatherIcon.src = "weather-app-img/images/mist.png";
            weatherCondition.textContent = "Misty"; // Update weather condition text
        }

        document.querySelector(".weather").style.display = "block";
        errorDiv.style.display = "none";
    } catch (error) {
        console.error(error);
        document.querySelector(".weather").style.display = "none";
        errorDiv.style.display = "block";
    }
}

function getCurrentLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            checkWeather(`lat=${latitude}&lon=${longitude}`);
        }, error => {
            console.error(error);
            errorDiv.style.display = "block";
            errorDiv.innerHTML = "Unable to retrieve your location. Please enter a city.";
        });
    } else {
        errorDiv.style.display = "block";
        errorDiv.innerHTML = "Geolocation is not supported by this browser.";
    }
}

searchBtn.addEventListener("click", () => {
    checkWeather(`q=${searchBox.value}`);
});

searchBox.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        checkWeather(`q=${searchBox.value}`);
    }
});

// Load weather for current location on page load
getCurrentLocationWeather();