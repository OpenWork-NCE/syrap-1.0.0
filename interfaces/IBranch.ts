import ILevel from '@/interfaces/ILevel';

export type IBranch = {
  id: string;
  name: string;
  levels: ILevel[];
  createdAt: string;
  updatedAt: string;
};
