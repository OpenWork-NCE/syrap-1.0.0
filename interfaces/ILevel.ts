import ISyllabus from '@/interfaces/ISyllabus';

export default interface ILevel {
  id: string;
  name: string;
  syllabus: ISyllabus;
  createdAt: string;
  updatedAt: string;
}
