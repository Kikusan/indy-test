export type PromotionProps = {
  name: string;
  reductionPercent: number;
  period: {
    beginDate: Date;
    endDate: Date;
  };
  ageRestriction?: AgeProps;
  weather?: {
    is?: string;
    temp?: {
      gt?: number;
      lt?: number;
    };
  };
};

export type AgeProps = {
  gt?: number;
  lt?: number;
  eq?: number;
};
