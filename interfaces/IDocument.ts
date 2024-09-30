import { User } from '@/types/real-types';

export default interface IDocument {
  id: string;
  name: string;
  extension: string;
  type: string;
  file: File;
  description: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  archivedAt: string;
  archivedBy: User;
  state: 'Actif' | 'Archivé';
}
