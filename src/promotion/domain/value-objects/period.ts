import { InvalidPeriodError } from '../errors';

export class Period {
  private readonly before: Date;
  private readonly after: Date;
  constructor(beginDate: Date, endDate: Date) {
    if (!this.isDate(beginDate) || !this.isDate(endDate)) {
      throw new InvalidPeriodError(
        'the begin date and the end date must be specified',
      );
    }
    if (beginDate > endDate) {
      throw new InvalidPeriodError(
        'The begin date must be lower than the end date',
      );
    }
    this.after = beginDate;
    this.before = endDate;
  }

  private isDate(value: Date) {
    return value instanceof Date && !isNaN(value.getTime());
  }
}
