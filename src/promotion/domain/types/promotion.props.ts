export type PromotionProps = {
  name: string;
  reductionPercent: number;
  period: PeriodProps;
  restrictions?: RestrictionNodeProps;
};

export type AgeProps = {
  gt?: number;
  lt?: number;
  eq?: number;
};

export type WeatherProps = {
  is?: string;
  temp?: {
    gt?: number;
    lt?: number;
  };
};

export type RestrictionNodeProps =
  | { and: RestrictionNodeProps[] }
  | { or: RestrictionNodeProps[] }
  | { age: AgeProps }
  | { weather: WeatherProps };

export type RestrictionTreeProps =
  | AgeProps
  | WeatherProps
  | RestrictionNodeProps[];

export type PeriodProps = {
  beginDate: Date;
  endDate: Date;
};
