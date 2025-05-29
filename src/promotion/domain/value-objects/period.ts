import { InvalidPeriodError } from '../errors';

export class Period {
  private readonly before: Date;
  private readonly after: Date;
  constructor(beginDate: Date, endDate: Date) {
    if (beginDate > endDate) {
      throw new InvalidPeriodError();
    }
    this.after = beginDate;
    this.before = endDate;
  }
}
