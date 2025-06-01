import { InvalidWeatherError } from '../errors';
import { WeatherDto } from '../types/weather.dto';

export type WeatherType =
  | 'Thunderstorm'
  | 'Drizzle'
  | 'Rain'
  | 'Snow'
  | 'Atmosphere'
  | 'Clear'
  | 'Clouds';

export type TemperatureConstraint = {
  gt?: number;
  lt?: number;
};

export class Weather {
  private readonly is: WeatherType;
  private readonly temp: TemperatureConstraint;

  constructor(is: string, temp: TemperatureConstraint) {
    this.validateProps(is, temp);
    this.is = is as WeatherType;
    this.temp = temp;
  }

  validate(weather: WeatherDto): boolean {
    if (this.isDefinedAndNotMatching(weather.condition)) {
      return false;
    }

    if (this.temp && !this.isTemperatureInRange(weather)) {
      return false;
    }

    return true;
  }

  private isDefinedAndNotMatching(condition: string): boolean {
    return this.is !== undefined && this.is !== condition;
  }

  private isTemperatureInRange(weather: WeatherDto): boolean {
    const aboveMin =
      this.temp?.gt === undefined || weather.minTemp > this.temp.gt;
    const belowMax =
      this.temp?.lt === undefined || weather.maxTemp < this.temp.lt;
    return aboveMin && belowMax;
  }

  private validateProps(is: string, temp: TemperatureConstraint) {
    is && this.isValidWeather(is);
    temp && this.validateTemp(temp);
  }

  private validateTemp({ gt, lt }: TemperatureConstraint): void {
    const hasRange = gt !== undefined && lt !== undefined;

    if (hasRange && lt <= gt) {
      throw new InvalidWeatherError(
        'Invalid weather restriction: gt must be lower than lt',
      );
    }
  }

  private isValidWeather(value: string): void {
    const givenWeather = [
      'Thunderstorm',
      'Drizzle',
      'Rain',
      'Snow',
      'Atmosphere',
      'Clear',
      'Clouds',
    ].includes(value);
    if (!givenWeather) {
      throw new InvalidWeatherError(`Invalid weather: ${value}`);
    }
  }
}
