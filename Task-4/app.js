document.getElementById('get-weather').addEventListener('click', function() {
    const location = document.getElementById('location-input').value;
    const apiKey = '9bea4413a3c8cd354b91aa1e9998b60a'; // Replace with your API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                const weatherCondition = data.weather[0].main.toLowerCase();
                let weatherClass = '';

                switch (weatherCondition) {
                    case 'clear':
                        weatherClass = 'clear-sky';
                        break;
                    case 'clouds':
                        weatherClass = 'cloudy';
                        break;
                    case 'rain':
                    case 'drizzle':
                        weatherClass = 'rain';
                        break;
                    case 'snow':
                        weatherClass = 'snow';
                        break;
                    default:
                        weatherClass = 'clear-sky'; // Fallback
                }

                document.body.className = weatherClass;

                const weatherInfo = `
                    <h2>${data.name}, ${data.sys.country}</h2>
                    <p>Temperature: ${data.main.temp}°C</p>
                    <p>Weather: ${data.weather[0].description}</p>
                    <p>Humidity: ${data.main.humidity}%</p>
                    <p>Wind Speed: ${data.wind.speed} m/s</p>
                `;
                document.getElementById('weather-result').innerHTML = weatherInfo;
            } else {
                document.getElementById('weather-result').innerHTML = `<p>${data.message}</p>`;
            }
        })
        .catch(error => {
            console.error('Error fetching the weather data:', error);
            document.getElementById('weather-result').innerHTML = `<p>Could not retrieve weather data. Please try again.</p>`;
        });
});
