import { WeatherDto } from '../../validate-promotion/domain/types/weather.dto';

export interface IWeatherRepository {
  get(town: string): Promise<WeatherDto>;
}
