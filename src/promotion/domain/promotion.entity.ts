import { Advantage } from './value-objects/advantage';

export class Promotion {
  private readonly name: string;
  private readonly advantage: Advantage;
  private readonly restrictions: any[] = [];

  constructor(name: string, reductionPercent: number) {
    this.name = name;
    this.advantage = new Advantage(reductionPercent);
  }
}
