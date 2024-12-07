import dotenv from 'dotenv';
dotenv.config();

interface Coordinates {
  id?: number;
  name: string;
  lat: number;
  lon: number;
  state?: string;
  country?: string;
}

class Weather {
  date: string;
  city: string;
  conditions: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  icon: string;
  iconDescription: string;

  constructor(city: string, date: string, conditions: string, temperature: number, humidity: number, windSpeed: number, icon: string, iconDescription: string) {
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
  baseURL: string;
  apiKey: string;

  constructor(baseURL: string, apiKey: string) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
  }

  private async fetchLocationData(query: string) {
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

  private destructureLocationData(locationData: Coordinates): { name: string, state: string | undefined, country: string | undefined, lat: number, lon: number } {
    if (!locationData) {
      throw new Error('Location data is undefined');
    }


    const { name, state, country, lat, lon } = locationData;
    return { name, state, country, lat, lon };
  }

  private buildWeatherQuery(coordinates: { name: string, state: string | undefined, country: string | undefined, lat: number, lon: number }): string {
    const query = `lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
    return query;
  }

  private async fetchAndDestructureLocationData(city: string): Promise<{ name: string, state: string | undefined, country: string | undefined, lat: number, lon: number }> {
    const cityData = await this.fetchLocationData(city);
    return this.destructureLocationData(cityData);
  }

  private async fetchWeatherData(query: string) {
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

  private formatDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  }

  private parseCurrentWeather(response: any, city: string): Weather {
    const { dt, main, weather, wind } = response.list[0];
    const formattedDate = this.formatDate(dt);
    const icon = weather[0].icon;
    const iconDescription = weather[0].description;
    return new Weather(city, formattedDate, weather[0].description, main.temp, main.humidity, wind.speed, icon, iconDescription);
  }

  private buildForecastArray(weatherData: any[], city: string): Weather[] {
    return weatherData.map((item: any) => {
      const { dt, main, weather, wind } = item;
      const formattedDate = this.formatDate(dt);
      const icon = weather[0].icon;
      const iconDescription = weather[0].description;
      return new Weather(city, formattedDate, weather[0].description, main.temp, main.humidity, wind.speed, icon, iconDescription);
    });
  }

  async getWeatherForCity(city: string): Promise<{ current: Weather; forecast: Weather[] }> {
    const locationData = await this.fetchAndDestructureLocationData(city);

    const query = this.buildWeatherQuery(locationData);

    const weatherData = await this.fetchWeatherData(query);

    const currentWeather = this.parseCurrentWeather(weatherData, city);
    const forecastArray = this.buildForecastArray(weatherData.list.slice(1, 5), city); 

    return { current: currentWeather, forecast: forecastArray };
  }
}

export default new WeatherService(`https://api.openweathermap.org`, `e05058d291eeebcc2a3e3e898d754ba7`);
