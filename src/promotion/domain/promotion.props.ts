export type PromotionProps = {
  name: string;
  reductionPercent: number;
  period: {
    beginDate: Date;
    endDate: Date;
  };
};
