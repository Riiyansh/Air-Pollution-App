let airApp = {
  apiKey: "13b83bb46f9b6394dbee98eb0449811e",

  fetchCoordinates: function (city) {
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${this.apiKey}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.length) {
          alert("City not found.");
          throw new Error("City not found");
        }
        const { lat, lon, name } = data[0];
        this.fetchPollution(lat, lon, name);
      });
  },

  fetchPollution: function (lat, lon, name) {
    fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${this.apiKey}`)
      .then((res) => res.json())
      .then((data) => this.displayPollution(data, name));

    // Unsplash background image
    const unsplashAPI = `https://api.unsplash.com/search/photos?page=1&query=${name}&client_id=ECLlYESUh02KpmzjKPZVSsXNeS07FdFiqYv-k8Ato-o`;
    fetch(unsplashAPI)
      .then((res) => res.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          const imageUrl = data.results[0].urls.raw;
          document.body.style.backgroundImage = `url('${imageUrl}')`;
          document.body.style.backgroundSize = "cover";
          document.body.style.backgroundPosition = "center";
          document.body.style.backgroundRepeat = "no-repeat";
        }
      });
  },

  displayPollution: function (data, cityName) {
    const aqi = data.list[0].main.aqi;
    const components = data.list[0].components;

    const aqiText = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
    document.querySelector(".city").innerText = `Air Quality in ${cityName}`;
    document.querySelector(".aqi").innerText = `AQI: ${data.list[0].main.aqi}`;
    document.querySelector(".description").innerText = aqiText[aqi - 1];
    document.querySelectorAll(".info")[0].innerText = `PM2.5: ${components.pm2_5} μg/m³`;
    document.querySelectorAll(".info")[1].innerText = `PM10: ${components.pm10} μg/m³`;
    document.querySelectorAll(".info")[2].innerText = `CO: ${components.co} mg/m³`;
    document.querySelectorAll(".info")[3].innerText = `NO₂: ${components.no2} μg/m³`;
    document.querySelector(".pollution").classList.remove("loading");
  },

  search: function () {
    const city = document.querySelector(".search-bar").value;
    this.fetchCoordinates(city);
  },
};

document.querySelector(".search button").addEventListener("click", function () {
  airApp.search();
});
document.querySelector(".search-bar").addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    airApp.search();
  }
});

// Default load
airApp.fetchCoordinates("Bhopal");
