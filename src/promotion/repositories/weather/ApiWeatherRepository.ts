import { IWeatherRepository } from './IWeatherRepository';
import { WeatherDto } from '../../validate-promotion/domain/types/weather.dto';
import NotFoundError from '@errors/RessourceNotFoundError';
import SourceUnavailableError from '@errors/SourceUnavailableError';

export class ApiWeatherRepository implements IWeatherRepository {
  private readonly apiKey: string;
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async get(town: string): Promise<WeatherDto> {
    const url = `${process.env.WHEATHER_API_URL}?q=${encodeURIComponent(town)}&units=metric&appid=${this.apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        throw new NotFoundError(`The town ${town} does not exist`);
      }
      throw new SourceUnavailableError(`The weather service is unavailable`);
    }

    const data = await response.json();
    const weather: WeatherDto = {
      condition: data.weather[0].main,
      minTemp: data.main.temp_min,
      maxTemp: data.main.temp_max,
    };

    return weather;
  }
}
