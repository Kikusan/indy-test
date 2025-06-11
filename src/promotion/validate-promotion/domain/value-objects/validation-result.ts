import { ValidationResultProp } from '../types/validation-result.prop';

export class ValidationResult {
  public readonly name: string;
  public readonly status: 'accepted' | 'denied';
  public readonly advantage?: { percent: number };
  public readonly reasons?: string[];
  private constructor(validationResultProp: ValidationResultProp) {
    const { reasons, status, advantage, name } = validationResultProp;
    this.name = name;
    this.status = status;
    this.advantage = advantage;
    this.reasons = reasons;
  }

  static accepted(name: string, percent: number): ValidationResult {
    const validationResultProp: ValidationResultProp = {
      name,
      status: 'accepted',
      advantage: { percent },
    };
    return new ValidationResult(validationResultProp);
  }

  static denied(name: string, reasons: string[]): ValidationResult {
    const validationResultProp: ValidationResultProp = {
      name,
      status: 'denied',
      reasons,
    };
    return new ValidationResult(validationResultProp);
  }
}
