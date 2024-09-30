import { IBranch } from '@/interfaces/IBranch';

export default interface IIpes {
  //IPES is a training school or an institution which is under the supervision of a university
  id: string;
  name: string;
  phone: string;
  email: string;
  borough: string;
  created_user: string; //Name of creator
  university: string; //Name of the University of Affairs
  decret_of_creation: string;
  opening_stop: string;
  promoter: string; //Name of diregeant of Ipes
  matching: number;
  branch_count: number;
  level_count: number;
  branchs: IBranch[];
  createdAt: Date;
  updatedAt: Date;
}
