const API = "d0daefa4009e1813a1289c335c8a5774";
const moscow = {
  lat: 55.7504461,
  lon: 37.6174943,
};
const shakhty = {
  lat: 47.7119167,
  lon: 40.2115699,
};

const now = new Date();
const cityName = document.querySelector(".city");
const hourBlock = document.querySelector(".hour-weather");

fetch(
  `http://api.openweathermap.org/data/2.5/forecast?lat=${shakhty.lat}&lon=${shakhty.lon}&appid=${API}`
  // `http://api.openweathermap.org/geo/1.0/direct?q=shakhty&limit=1&appid=${API}`
)
  .then((response) => response.json())
  .then((json) => {
    if (json.cod == 401) {
      throw new Error("Ой");
      console.log("Error");
    } else {
      console.log("vibe");
      return json;
    }
  })
  .then((json) => {
    console.log(json);
    document.querySelector(".city").textContent = json.city.name;
    document.querySelector(".deg").innerHTML =
      Math.round(json.list[0].main.temp - 273, 15) + "&deg";
    document.querySelector(".description").textContent =
      json.list[0].weather[0].description;
    //Почасовой прогноз
    for (let i = 0; i < 10; i++) {
      let timeWeatherBlock = document.createElement("div");
      let time = document.createElement("div");
      let imgBlock = document.createElement("div");
      let degries = document.createElement("div");
      timeWeatherBlock.className = "bl";
      time.textContent = json.list[i].dt_txt.slice(11, 16);
      hourBlock.append(timeWeatherBlock);
      timeWeatherBlock.append(time);
      timeWeatherBlock.append(imgBlock);
      timeWeatherBlock.append(degries);
      if (5 <= json.list[i].dt_txt.slice(11, 13) >= 21) {
        imgBlock.className = `img-block ${json.list[i].weather[0].main} night`;
      } else {
        imgBlock.className = `img-block ${json.list[i].weather[0].main} day`;
      }
    }
  });

//* Сделать так что бы в day-weather можно было раскрывать день нажатием и смотреть по часовой прогноз на день
