import { Age } from './value-objects/age';
import { Period } from './value-objects/period';

export type Restriction = {
  date?: Period;
  age?: Age;
  weather?: any;
};
