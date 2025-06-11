import NotFoundError from '@errors/RessourceNotFoundError';
import { WeatherDto } from '../../validate-promotion/domain/types/weather.dto';
import { IWeatherRepository } from './IWeatherRepository';

export class InMemoryWeatherRepository implements IWeatherRepository {
  get(town: string): Promise<WeatherDto> {
    if (town.toLowerCase() === 'paris') {
      return Promise.resolve({
        condition: 'Clear',
        minTemp: 28,
        maxTemp: 30,
      });
    }
    return Promise.reject(new NotFoundError('Town not found'));
  }
}
