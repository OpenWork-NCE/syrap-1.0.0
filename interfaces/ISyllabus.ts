import IModule from '@/interfaces/IModule';

export default interface ISyllabus {
  id: string;
  name: string;
  modules: IModule[];
  createdAt: string;
  updatedAt: string;
}
