import { WeatherDto } from '../../entities/types/weather.dto';

export interface IWeatherRepository {
  get(town: string): Promise<WeatherDto>;
}
