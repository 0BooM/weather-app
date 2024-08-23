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
    const fullAddress = data.resolvedAddress;
    const city = fullAddress.split(',')[0].trim();
    return city;
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
    const timezoneOffsetInHours = data.tzoffset;
    if (typeof timezoneOffsetInHours !== 'number') {
      console.error('Invalid timezone_offset:', timezoneOffsetInHours);
      return 'Invalid Time';
    }

    const now = new Date();
    const localTime = new Date(now.getTime() + timezoneOffsetInHours * 3600000);
    const hours = String(localTime.getUTCHours()).padStart(2, '0');
    const minutes = String(localTime.getUTCMinutes()).padStart(2, '0');
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
      console.log(locationData);

      const address = getAdress(locationData);
      const currentHour = getHour(locationData);
      const currentDay = getDayName(locationData);
      const {
        temp: currentTemp,
        windspeed,
        humidity,
      } = getTempWindHumidity(locationData);
      const { cloudcover, conditions } = getCloudData(locationData);
      const { precipprob } = getPrecibData(locationData);
      const currentIcon = getIcon(locationData);

      const upcomingDays = locationData.days.slice(1, 4).map((dayData) => {
        const date = new Date(dayData.datetimeEpoch * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        const dayIcon = dayData.icon;
        const maxTemp = Math.round(dayData.tempmax);
        return { dayName, dayIcon, maxTemp };
      });

      return {
        address,
        currentHour,
        currentDay,
        currentTemp,
        windspeed,
        humidity,
        cloudcover,
        conditions,
        precipprob,
        currentIcon,
        upcomingDays,
      };
    } catch (error) {
      console.error('Failed to get weather data', error);
      return error;
    }
  }

  return {
    getWeatherData,
  };
})();

export default Api;
