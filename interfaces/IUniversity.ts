import { IBranch } from '@/interfaces/IBranch';

export default interface IUniversity {
  //These are Cameroonian and international universities that have representations in Cameroon
  id: string;
  acronym: string;
  name: string;
  phone: string;
  email: string;
  localization: string; //Cameroon arrondissement
  created_user: string; //Name of creator
  ipes_count: number;
  global_matching: number;
  branch_count: number;
  level_count: number;
  branchs: IBranch[];
  createdAt: string;
  updatedAt: string;
}
