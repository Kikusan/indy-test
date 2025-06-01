export type ValidationResultProp = {
  name: string;
  status: 'accepted' | 'denied';
  advantage?: { percent: number };
  reasons?: string[];
};
