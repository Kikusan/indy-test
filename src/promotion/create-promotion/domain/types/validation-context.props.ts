import { WeatherDto } from '../../../validate-promotion/domain/types/weather.dto';

export type ValidationContextProps = {
  age: number;
  date: Date;
  weather: WeatherDto;
};
