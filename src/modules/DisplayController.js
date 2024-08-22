import Api from './Api';
import fogIcon from '../icons/fog.svg';

let unit = 'metric';

const DisplayController = (() => {
  function getWeatherIcon(iconName) {
    return import(`../icons/${iconName}.svg`)
      .then((module) => module.default)
      .catch((error) => {
        console.error(`Nie można załadować ikony: ${iconName}`, error);
        return '';
      });
  }

  function updateWeatherIcon(iconName) {
    getWeatherIcon(iconName).then((iconSrc) => {
      const weatherIcon = document.getElementById('weather-icon');
      if (weatherIcon) {
        weatherIcon.src = iconSrc;
      }
    });
  }

  function renderMainWeatherInfo(data) {
    const location = document.getElementById('location');
    const temperature = document.getElementById('temperature');
    const unitElement = document.getElementById('unit');
    const day = document.getElementById('day');
    const hour = document.getElementById('hour');
    const cloudStatus = document.getElementById('cloud-status');
    const precipPercent = document.getElementById('precip-percent');
    const humidityPercent = document.getElementById('humidity-percent');
    const windSpeed = document.getElementById('wind-speed');

    location.textContent = data.address;
    temperature.firstChild.nodeValue = data.temp;
    unitElement.textContent = unit === 'metric' ? '℃' : '°F';
    day.textContent = data.day;
    hour.textContent = data.hour;
    cloudStatus.textContent = data.conditions;
    precipPercent.textContent = `${data.precipprob}%`;
    humidityPercent.textContent = `${data.humidity}%`;
    windSpeed.textContent = `${data.windspeed} ${unit === 'metric' ? 'km/h' : 'mph'}`;

    updateWeatherIcon(data.icon);
  }

  async function fetchAndRenderWeather(location) {
    try {
      const data = await Api.getWeatherData(location, unit);
      renderMainWeatherInfo(data);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  function getUserLocationInput() {
    const input = document.querySelector('#userLocation');
    input.addEventListener('keypress', async (e) => {
      if (e.key === 'Enter') {
        await fetchAndRenderWeather(input.value);
        input.value = '';
      }
    });
  }

  function changeTempUnit() {
    const changeBtn = document.querySelector('.change-unit');
    changeBtn.addEventListener('click', async () => {
      unit = unit === 'metric' ? 'us' : 'metric';
      changeBtn.textContent = unit === 'metric' ? '°F' : '℃';

      const location = document.querySelector('#location').textContent.trim();
      if (location) {
        await fetchAndRenderWeather(location);
      }
    });
  }

  function init() {
    getUserLocationInput(), changeTempUnit();
  }

  return {
    init,
  };
})();

export default DisplayController;
