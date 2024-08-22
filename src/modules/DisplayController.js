import Api from './Api';
import fogIcon from '../icons/fog.svg';

const DisplayController = (() => {
  function getWeatherIcon(iconName) {
    try {
      // Dynamiczne importowanie ikony
      return import(`../icons/${iconName}.svg`).then(
        (module) => module.default
      );
    } catch (error) {
      console.error(`Nie można załadować ikony: ${iconName}`, error);
      return ''; // Zwróć pusty string lub ścieżkę do domyślnej ikony w przypadku błędu
    }
  }

  function updateWeatherIcon(iconName) {
    getWeatherIcon(iconName).then((iconSrc) => {
      const weatherIcon = document.getElementById('weather-icon');
      weatherIcon.src = iconSrc;
    });
  }

  function renderMainWeatherInfo(data) {
    const location = document.getElementById('location');
    const temperature = document.getElementById('temperature');
    const unit = document.getElementById('unit'); // Osobny element dla jednostki
    const day = document.getElementById('day');
    const hour = document.getElementById('hour');
    const cloudStatus = document.getElementById('cloud-status');
    const precipPercent = document.getElementById('precip-percent');
    const humidityPercent = document.getElementById('humidity-percent');
    const windSpeed = document.getElementById('wind-speed');

    location.textContent = data.address;
    temperature.firstChild.nodeValue = data.temp;
    unit.innerHTML = '℃';
    day.textContent = data.day;
    hour.textContent = data.hour;
    cloudStatus.textContent = data.conditions;
    precipPercent.textContent = `${data.precipprob}%`;
    humidityPercent.textContent = `${data.humidity}%`;
    windSpeed.textContent = `${data.windspeed} km/h`;

    updateWeatherIcon(data.icon);
  }

  function getUserLocationInput() {
    const input = document.querySelector('#userLocation');
    input.addEventListener('keypress', async (e) => {
      if (e.key === 'Enter') {
        const data = await Api.getWeatherData(input.value);
        console.log(data);
        input.value = '';
        renderMainWeatherInfo(data);
      }
    });
  }

  return {
    getUserLocationInput,
  };
})();

export default DisplayController;
