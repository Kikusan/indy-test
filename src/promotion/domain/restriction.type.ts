import { Age } from './value-objects/age';
import { Period } from './value-objects/period';
import { Weather } from './value-objects/weather';

export type DateRestriction = {
  date?: Period;
};

export type LeafRestriction = {
  age?: Age;
  weather?: Weather;
};

export type RestrictionNode =
  | LeafRestriction
  | { and: RestrictionNode[] }
  | { or: RestrictionNode[] };
