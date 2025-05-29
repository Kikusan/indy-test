import { InvalidAdvantageError } from './errors/invalid-advantage.error';
import { Promotion } from './promotion.entity';

describe('Promotion entity', () => {
  it('should create a promotion with a name and a advantage', () => {
    const promotion = new Promotion('basic', 30);
    const expectedPromotion = {
      name: 'basic',
      advantage: { percent: 30 },
      restrictions: [],
    };
    expect(promotion).toEqual(expectedPromotion);
  });

  it('should throw an error if the advantage is below 0', () => {
    try {
      new Promotion('basic', -90);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidAdvantageError);
      return;
    }
    expect(false).toBeTruthy();
  });

  it('should throw an error if the advantage is above 100', () => {
    try {
      new Promotion('basic', 9000);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidAdvantageError);
      return;
    }
    expect(false).toBeTruthy();
  });
});
