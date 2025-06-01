import { WeatherDto } from '../../domain/types/weather.dto';

export interface IWeatherRepository {
  get(town: string): Promise<WeatherDto>;
}
