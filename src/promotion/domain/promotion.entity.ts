import { PromotionProps } from './promotion.props';
import { Restriction } from './restriction.type';
import { Advantage } from './value-objects/advantage';
import { Age } from './value-objects/age';
import { Period } from './value-objects/period';
import { Weather } from './value-objects/weather';

export class Promotion {
  private readonly name: string;
  private readonly advantage: Advantage;
  private readonly restrictions: Restriction[] = [];

  constructor(props: PromotionProps) {
    const { name, reductionPercent, period, ageRestriction, weather } = props;
    this.name = name;
    this.advantage = new Advantage(reductionPercent);
    const dateRestriction: Restriction = {
      date: new Period(period.beginDate, period.endDate),
    };
    this.restrictions.push(dateRestriction);
    if (ageRestriction) {
      const restriction: Restriction = { age: new Age({ ...ageRestriction }) };
      this.restrictions.push(restriction);
    }
    if (weather) {
      const restriction: Restriction = {
        weather: new Weather(weather.is, weather.temp),
      };
      this.restrictions.push(restriction);
    }
  }
}
