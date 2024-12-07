import dotenv from 'dotenv';
dotenv.config();
class Weather {
    constructor(city, date, conditions, temperature, humidity, windSpeed, icon, iconDescription) {
        this.city = city;
        this.date = date;
        this.conditions = conditions;
        this.temperature = temperature;
        this.humidity = humidity;
        this.windSpeed = windSpeed;
        this.icon = icon;
        this.iconDescription = iconDescription;
    }
}
class WeatherService {
    constructor(baseURL, apiKey) {
        this.baseURL = baseURL;
        this.apiKey = apiKey;
    }
    async fetchLocationData(query) {
        const url = `${this.baseURL}/geo/1.0/direct?q=${query}&appid=${this.apiKey}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch location data: ${response.statusText}`);
        }
        const data = await response.json();
        if (!data || data.length === 0) {
            throw new Error(`No location data found for query: ${query}`);
        }
        const cityData = data[0];
        return cityData;
    }
    destructureLocationData(locationData) {
        if (!locationData) {
            throw new Error('Location data is undefined');
        }
        const { name, state, country, lat, lon } = locationData;
        return { name, state, country, lat, lon };
    }
    buildWeatherQuery(coordinates) {
        const query = `lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
        return query;
    }
    async fetchAndDestructureLocationData(city) {
        const cityData = await this.fetchLocationData(city);
        return this.destructureLocationData(cityData);
    }
    async fetchWeatherData(query) {
        const url = `${this.baseURL}/data/2.5/forecast?${query}&units=metric`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch weather data: ${response.statusText}`);
        }
        const data = await response.json();
        if (!data) {
            throw new Error('No weather data found');
        }
        return data;
    }
    formatDate(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString();
    }
    parseCurrentWeather(response, city) {
        const { dt, main, weather, wind } = response.list[0];
        const formattedDate = this.formatDate(dt);
        const icon = weather[0].icon;
        const iconDescription = weather[0].description;
        return new Weather(city, formattedDate, weather[0].description, main.temp, main.humidity, wind.speed, icon, iconDescription);
    }
    buildForecastArray(weatherData, city) {
        return weatherData.map((item) => {
            const { dt, main, weather, wind } = item;
            const formattedDate = this.formatDate(dt);
            const icon = weather[0].icon;
            const iconDescription = weather[0].description;
            return new Weather(city, formattedDate, weather[0].description, main.temp, main.humidity, wind.speed, icon, iconDescription);
        });
    }
    async getWeatherForCity(city) {
        const locationData = await this.fetchAndDestructureLocationData(city);
        const query = this.buildWeatherQuery(locationData);
        const weatherData = await this.fetchWeatherData(query);
        const currentWeather = this.parseCurrentWeather(weatherData, city);
        const forecastArray = this.buildForecastArray(weatherData.list.slice(1, 5), city);
        return { current: currentWeather, forecast: forecastArray };
    }
}
export default new WeatherService(`https://api.openweathermap.org`, `e05058d291eeebcc2a3e3e898d754ba7`);
