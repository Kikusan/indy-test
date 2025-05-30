export type PromotionProps = {
  name: string;
  reductionPercent: number;
  period: {
    beginDate: Date;
    endDate: Date;
  };
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
