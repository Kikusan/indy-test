import { InvalidWeatherError } from '../errors';

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
