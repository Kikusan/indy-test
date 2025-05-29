export type Restriction = {
  date: dateRestriction;
};

export type dateRestriction = {
  after: Date;
  before: Date;
};
