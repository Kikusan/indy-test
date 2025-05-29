import { InvalidAdvantageError } from '../errors/invalid-advantage.error';

export class Advantage {
  constructor(public readonly percent: number) {
    if (percent <= 0 || percent > 100) {
      throw new InvalidAdvantageError();
    }
  }
}
