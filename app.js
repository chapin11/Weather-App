const API = "d0daefa4009e1813a1289c335c8a5774";
const moscow = {
  lat: 55.7504461,
  lon: 37.6174943,
};
const shakhty = {
  lat: 47.7119167,
  lon: 40.2115699,
};

const cityName = document.querySelector(".city");

fetch(
  `http://api.openweathermap.org/data/2.5/forecast?lat=${moscow.lat}&lon=${moscow.lon}&appid=${API}`
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
  });
// .then((json) => {
//   console.log(json);
//   document.querySelector(".city").textContent = json.city.name;
//   document.querySelector(".deg").innerHTML =
//     Math.round(json.list[0].main.temp - 273, 15) + "&deg";
//   // document.querySelector(".description").textContent =
//   //   json.list[0].weather[0].description;
// });
