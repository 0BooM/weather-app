const Api = (() => {
  const API_KEY = 'UYL2REAKVTBJU86ZHE42XUZSJ';

  async function getLocationData(location, unit = 'metric') {
    try {
      const response = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${unit}&key=${API_KEY}&contentType=json`
      );
      const dataJSON = await response.json();
      return dataJSON;
    } catch (error) {
      console.log(`ERROR: ${error}`);
      throw error;
    }
  }

  function getAdress(data) {
    return data.address;
  }

  function getTempWindHumidity(data) {
    const { temp, windspeed, humidity } = data.currentConditions;
    return {
      temp: Math.round(temp),
      windspeed: Math.round(windspeed),
      humidity: Math.round(humidity),
    };
  }

  function getDayName(data) {
    const today = new Date();
    const dayIndex = today.getDay();
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return daysOfWeek[dayIndex];
  }

  function getHour(data) {
    const fullTime = data.currentConditions.datetime;
    const [hours, minutes] = fullTime.split(':');
    return `${hours}:${minutes}`;
  }

  function getCloudData(data) {
    const { cloudcover, conditions } = data.currentConditions;
    return { cloudcover, conditions };
  }

  function getPrecibData(data) {
    const { precip, precipprob } = data.currentConditions;
    return { precip, precipprob };
  }

  function getIcon(data) {
    return data.currentConditions.icon;
  }

  async function getWeatherData(location, unit = 'metric') {
    try {
      const locationData = await getLocationData(location, unit);
      const address = getAdress(locationData);
      const hour = getHour(locationData);
      const day = getDayName(locationData);
      const { temp, windspeed, humidity } = getTempWindHumidity(locationData);
      const { cloudcover, conditions } = getCloudData(locationData);
      const { precipprob } = getPrecibData(locationData);
      const icon = getIcon(locationData);
      return {
        address,
        hour,
        day,
        temp,
        windspeed,
        humidity,
        cloudcover,
        conditions,
        precipprob,
        icon,
      };
    } catch (error) {
      console.error('Failed to get weather data', error);
      throw error;
    }
  }

  return {
    getWeatherData,
  };
})();

export default Api;
