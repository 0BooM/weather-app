import Api from './Api';

const DisplayController = (() => {
  function getUserLocationInput() {
    const input = document.querySelector('#userLocation');
    input.addEventListener('keypress', async (e) => {
      if (e.key === 'Enter') {
        const data = await Api.getWeatherData(input.value);
        console.log(data);
        input.value = '';
      }
    });
  }

  return {
    getUserLocationInput,
  };
})();

export default DisplayController;
