// Віджет для погоди 

const { useState, useEffect } = React;

function Weather() {
  // Масив днів тижня
  const weekDays = [
    "Понеділок",
    "Вівторок",
    "Середа",
    "Четвер",
    "П'ятниця",
    "Субота",
    "Неділя",
  ];

  // Стани для збереження значення погоди, та конкретного дня для перегляду на нашому віджеті
  const [weatherData, setWeatherData] = useState(null);
  const [forecastDay, setForecastDay] = useState(0);

  // Отримуємо дані
  const fetchData = () => {
    const apiKey = "4787215cc2cd139e6864f31b70eb2cc3"; // Замініть на свій ключ API OpenWeatherMap
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=London,us&appid=${apiKey}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setWeatherData(data);
      })
      .catch((error) => {
        console.error("Помилка при отриманні даних:", error);
      });
  };

  // Викликаємо функцію при рендерингу головного компоненту
  useEffect(() => {
    fetchData();
  }, []);

  // Функція для зміни дня
  const changeDay = (n) => {
    let updatedDay = forecastDay + n;

    if (updatedDay < 0) {
      updatedDay = 0;
    } else if (updatedDay > 29) {
      updatedDay = 29;
    }

    setForecastDay(updatedDay);
  };

  // Функція для переведення Кельвінів до Цельсія
  const toCelcia = (temp) => {
    return Math.round(temp - 273) + " °C";
  };

  if (!weatherData) {
    return <div className="loading">Завантаження...</div>;
  }

  // Отримуємо день тижня за допомогою числа
  const currentWeekDay = weekDays[forecastDay % 7];

  return (
    <div className="Weather">
      <div className="container">
        <div className="weather-app">
          <div className="title">
            {/* Кнопки для керування перемикання днів */}
            <button onClick={() => changeDay(-1)} className="btn">
              {"<"}
            </button>
            <h1 className="city">
              {weatherData.city.name},{" "}
              <span className="country">{weatherData.city.country}</span>
            </h1>
            <button onClick={() => changeDay(1)} className="btn">
              {">"}
            </button>
          </div>

          {/* Відображення дати */}
          <div className="date">
            <h2 className="day">
              {forecastDay + 1 < 10 ? `0${forecastDay + 1}` : forecastDay + 1}
            </h2>
            <h2 className="day-of-week">{currentWeekDay}</h2>
          </div>

          {/* Відображення температури */}
          <div className="temperature">
            <h3 className="min-temp">
              {toCelcia(weatherData.list[forecastDay].main.temp_min)}
              <span className="temp-res">мін темп</span>
            </h3>
            <h3 className="curr-temp">
              {toCelcia(weatherData.list[forecastDay].main.temp)}
            </h3>
            <h3 className="max-temp">
              {toCelcia(weatherData.list[forecastDay].main.temp_max)}
              <span className="temp-res">макс темп</span>
            </h3>
          </div>

          {/* Відображення інших параметрів погоди */}
          <div className="main-weather">
            <div className="main">
              Тип погоди:{" "}
              <span className="main-weather-result">
                {weatherData.list[forecastDay].weather[0].main}
              </span>
            </div>
            <div className="pressure">
              Тиск:{" "}
              <span className="main-weather-result">
                {weatherData.list[forecastDay].main.pressure}
              </span>
            </div>
            <div className="clouds">
              Хмари:{" "}
              <span className="main-weather-result">
                {weatherData.list[forecastDay].clouds.all}
              </span>
            </div>
            <div className="wind">
              Вітер:
              <span className="main-weather-result">
                {weatherData.list[forecastDay].wind.speed}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Рендеримо компонент в блок з id root
const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(<Weather />);
