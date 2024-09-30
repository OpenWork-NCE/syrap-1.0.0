import IUe from '@/interfaces/IUe';

export default interface IModule {
  id: string;
  name: string;
  ues: {
    id: string;
    ue: IUe;
    nbr_hours: number;
    nbr_credits: number;
    tailored_description: string;
    teacher: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
