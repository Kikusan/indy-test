import { ValidationContextProps } from '../../types/validation-context.props';
import { Weather } from '../weather';
import { IRestriction } from './IRestriction';

export class WeatherRestriction implements IRestriction {
  constructor(private readonly weather: Weather) {}

  validate(context: ValidationContextProps): string[] {
    if (!this.weather.validate(context.weather)) {
      return ['WEATHER_NOT_ELIGIBLE'];
    }
    return [];
  }
}
