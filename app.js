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


// Скролл почасового прогноза горизонтально
document
  .getElementById("horizontal-scroll")
  .addEventListener("wheel", function (event) {
    if (event.deltaMode == event.DOM_DELTA_PIXEL) {
      var modifier = 1;
    } else if (event.deltaMode == event.DOM_DELTA_LINE) {
      var modifier = parseInt(getComputedStyle(this).lineHeight);
    } else if (event.deltaMode == event.DOM_DELTA_PAGE) {
      var modifier = this.clientHeight;
    }
    if (event.deltaY != 0) {
      this.scrollLeft += modifier * event.deltaY - 15;
      event.preventDefault();
    }
  });

fetch(
  `https://api.openweathermap.org/data/2.5/forecast?q=moscow&appid=d0daefa4009e1813a1289c335c8a5774&lang=ru`
)
  .then((response) => response.json())
  .then((json) => {
    if (json.status == 401) {
      throw new Error("Ой");
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

    //* Дневной прогноз с возможностью раскрытия

    // Группируем данные по дням
    const dailyData = {};
    
    json.list.forEach(item => {
      const date = item.dt_txt.slice(0, 10); // YYYY-MM-DD
      const dayKey = item.dt_txt.slice(8, 10) + "." + item.dt_txt.slice(5, 7); // DD.MM
      
      if (!dailyData[dayKey]) {
        dailyData[dayKey] = {
          date: dayKey,
          fullDate: date,
          temps: [],
          hourlyData: []
        };
      }
      
      dailyData[dayKey].temps.push(item.main.temp);
      dailyData[dayKey].hourlyData.push({
        time: item.dt_txt.slice(11, 16),
        temp: Math.round(item.main.temp - 273, 15),
        weather: item.weather[0].main,
        description: item.weather[0].description
      });
    });

    console.log('Daily data:', dailyData);

    // Создаем блоки для каждого дня
    Object.values(dailyData).forEach((day, index) => {
      const minTemp = Math.min(...day.temps);
      const maxTemp = Math.max(...day.temps);
      const dayName = index === 0 ? "Сегодня" : day.date;

      const dayBlockElement = document.createElement("div");
      dayBlockElement.className = "day-block";
      
      dayBlockElement.innerHTML = `
        <div class="day-header">
          <div class="day-main-info">
            <span class="day-name">${dayName}</span>
            <span class="day-temp-range">${Math.floor(minTemp - 273)}&deg; / ${Math.floor(maxTemp - 273)}&deg;</span>
          </div>
          <div class="day-arrow">▼</div>
        </div>
        <div class="hourly-forecast">
          ${day.hourlyData.map(hour => `
            <div class="hour-item">
              <span class="hour-time">${hour.time}</span>
              <div class="hour-weather-icon">
                <div class="img-block ${hour.weather}"></div>
              </div>
              <span class="hour-temp">${hour.temp}&deg;</span>
              <span class="hour-desc">${hour.description}</span>
            </div>
          `).join('')}
        </div>
      `;

      dayBlock.appendChild(dayBlockElement);
    });

    // Добавляем обработчики событий для раскрытия/скрытия
    const dayBlocks = document.querySelectorAll('.day-block');
    
    dayBlocks.forEach(block => {
      const header = block.querySelector('.day-header');
      const hourlyForecast = block.querySelector('.hourly-forecast');
      const arrow = block.querySelector('.day-arrow');
      
      let isExpanded = false;
      
      header.addEventListener('click', () => {
        if (isExpanded) {
          hourlyForecast.style.display = 'none';
          arrow.textContent = '▼';
          block.style.backgroundColor = '';
          isExpanded = false;
        } else {
          // Сначала скрываем все остальные открытые блоки
          dayBlocks.forEach(otherBlock => {
            if (otherBlock !== block) {
              const otherForecast = otherBlock.querySelector('.hourly-forecast');
              const otherArrow = otherBlock.querySelector('.day-arrow');
              otherForecast.style.display = 'none';
              otherArrow.textContent = '▼';
              otherBlock.style.backgroundColor = '';
            }
          });
          
          hourlyForecast.style.display = 'block';
          arrow.textContent = '▲';
          block.style.backgroundColor = 'rgba(26, 123, 168, 0.3)';
          isExpanded = true;
        }
      });
    });
  });