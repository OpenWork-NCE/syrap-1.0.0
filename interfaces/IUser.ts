import IProfile from '@/interfaces/IProfile';

export type User = {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  state: string;
  memberships: 'Cenadi' | 'Minesup' | 'Ipes';
  profiles: IProfile[];
  createdAt: string;
  updatedAt: string;
};
