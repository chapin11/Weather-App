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
const dayBlock = document.querySelector(".day-weather");

// Сколл почасового прогноза горизонтально
document
  .getElementById("horizontal-scroll")
  .addEventListener("wheel", function (event) {
    if (event.deltaMode == event.DOM_DELTA_PIXEL) {
      var modifier = 1;
      // иные режимы возможны в Firefox
    } else if (event.deltaMode == event.DOM_DELTA_LINE) {
      var modifier = parseInt(getComputedStyle(this).lineHeight);
    } else if (event.deltaMode == event.DOM_DELTA_PAGE) {
      var modifier = this.clientHeight;
    }
    if (event.deltaY != 0) {
      // замена вертикальной прокрутки горизонтальной
      this.scrollLeft += modifier * event.deltaY - 15;
      event.preventDefault();
    }
  });

fetch(
  `https://api.openweathermap.org/data/2.5/forecast?q=shakhty&appid=d0daefa4009e1813a1289c335c8a5774&lang=ru`
  // `http://api.openweathermap.org/geo/1.0/direct?q=shakhty&limit=1&appid=${API}`
)
  .then((response) => response.json())
  .then((json) => {
    if (json.status == 401) {
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
    //* Почасовой прогноз
    //? Первый вариант
    // for (let i = 0; i < 10; i++) {
    //   let timeWeatherBlock = document.createElement("div");
    //   let time = document.createElement("div");
    //   let imgBlock = document.createElement("div");
    //   let degries = document.createElement("div");
    //   timeWeatherBlock.className = "bl";
    //   time.textContent = json.list[i].dt_txt.slice(11, 16);
    //   hourBlock.append(timeWeatherBlock);
    //   timeWeatherBlock.append(time);
    //   timeWeatherBlock.append(imgBlock);
    //   timeWeatherBlock.append(degries);
    //   imgBlock.className = `img-block ${json.list[i].weather[0].main}`;
    //   degries.innerHTML = Math.round(json.list[i].main.temp - 273, 15) + "&deg";
    // }
    //? Второй вариант

    const jsonBlock = json.list.map(
      (json) =>
        `<div>${json.dt_txt.slice(11, 16)}</div> <div class='img-block ${
          json.weather[0].main
        }'></div> <div>${Math.round(json.main.temp - 273, 15) + "&deg"}</div>`
    );
    for (let i = 0; i < 10; i++) {
      let timeWeatherBlock = document.createElement("div");
      timeWeatherBlock.className = "bl";
      hourBlock.append(timeWeatherBlock);
      timeWeatherBlock.innerHTML = jsonBlock[i];
    }

    //* Дневной прогноз

    //* Создаем массив со значениями дата,температура
    const tempWeatherList = json.list.map((json) => [
      json.dt_txt.slice(8, 10) + "." + json.dt_txt.slice(5, 7),
      json.main.temp,
    ]);

    //* Делим массив на подмассивы с температурами на каждый день
    let sortTempWeatherList = [];
    let date = tempWeatherList[0][0];
    let m = 0;

    for (let i = 0; i < tempWeatherList.length; i++) {
      if (date != tempWeatherList[i][0]) {
        sortTempWeatherList.push(tempWeatherList.slice(m, i));
        date = tempWeatherList[i][0];
        m = i;
      }
      // проверка чтобы последний день тоже попал в массив
      if (i == tempWeatherList.length - 1) {
        sortTempWeatherList.push(tempWeatherList.slice(m, i + 1));
      }
    }

    console.log(tempWeatherList, sortTempWeatherList);
    let tempList = sortTempWeatherList.map((list) => list.map((arr) => arr[1]));
    let dayList = sortTempWeatherList.map((list) => list.map((arr) => arr[0]));
    let setDayList = new Set();
    dayList.map((arr) => arr.map((list) => setDayList.add(list)));
    setDayList = [...setDayList];
    console.log(tempList, dayList, setDayList);
    let i = 0;
    const dayweatherBlock = tempList.map((temp) => {
      let day = i == 0 ? "Сегодня" : setDayList[i];
      let result = `<div class="day-block">${day} min: ${Math.floor(
        Math.min(...temp) - 273,
        15
      )}&deg; max: ${Math.floor(Math.max(...temp) - 273, 15)}&deg;</div>`;
      i++;
      return result;
    });

    let setDayWeatherBlock = [...new Set(dayweatherBlock)];
    console.log(setDayWeatherBlock);
    for (let i = 0; i < setDayWeatherBlock.length; i++) {
      let dayWeatherBlock = document.createElement("div");
      dayWeatherBlock.className = "day-block";
      dayBlock.append(dayWeatherBlock);
      dayWeatherBlock.innerHTML = setDayWeatherBlock[i];
    }
  });

//* Сделать так что бы в day-weather можно было раскрывать день нажатием и смотреть по часовой прогноз на день
//* Для ежедневного прогноза использовать другой API
