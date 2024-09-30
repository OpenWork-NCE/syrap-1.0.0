import { Authorization } from '@/types';

export const fakeData: Authorization[] = [
  {
    id: '1',
    name: 'Admin',
    rights:
      'create_ues,read_ues,update_ues,delete_ues,create_module,read_module,update_module,delete_module,create_syllabus,read_syllabus,update_syllabus,delete_syllabus,create_user,read_user,update_user,delete_user,create_document,read_document,update_document,delete_document,create_level,read_level,update_level,delete_level,create_branch,read_branch,update_branch,delete_branch,create_university,read_university,update_university,delete_university,create_ipes,read_ipes,update_ipes,delete_ipes',
  },
  {
    id: '2',
    name: 'Lecturer',
    rights:
      'read_ues,read_module,read_syllabus,create_document,read_document,update_document,read_level,read_branch,read_university,read_ipes',
  },
  {
    id: '3',
    name: 'Syllabus Manager',
    rights:
      'create_syllabus,read_syllabus,update_syllabus,delete_syllabus,read_module,read_ues',
  },
  {
    id: '4',
    name: 'University Admin',
    rights:
      'create_university,read_university,update_university,delete_university,create_branch,read_branch,update_branch,delete_branch,create_level,read_level,update_level,delete_level',
  },
  {
    id: '5',
    name: 'Ipes Manager',
    rights:
      'create_ipes,read_ipes,update_ipes,delete_ipes,create_branch,read_branch,update_branch,delete_branch,create_level,read_level,update_level,delete_level',
  },
  {
    id: '6',
    name: 'Document Manager',
    rights: 'create_document,read_document,update_document,delete_document',
  },
  {
    id: '7',
    name: 'User Manager',
    rights: 'create_user,read_user,update_user,delete_user',
  },
  {
    id: '8',
    name: 'Level Coordinator',
    rights: 'read_level,create_level,update_level,delete_level',
  },
  {
    id: '9',
    name: 'Branch Supervisor',
    rights: 'read_branch,create_branch,update_branch,delete_branch',
  },
  {
    id: '10',
    name: 'General Viewer',
    rights:
      'read_ues,read_module,read_syllabus,read_document,read_level,read_branch,read_university,read_ipes',
  },
  {
    id: '11',
    name: 'Module Creator',
    rights: 'create_module,read_module,update_module,delete_module',
  },
  {
    id: '12',
    name: 'Ues Editor',
    rights: 'create_ues,read_ues,update_ues,delete_ues',
  },
  {
    id: '13',
    name: 'Head of Department',
    rights:
      'read_ues,read_module,read_syllabus,read_document,read_branch,read_university,read_ipes,create_document,update_document',
  },
  {
    id: '14',
    name: 'Ipes Admin',
    rights:
      'read_ipes,create_ipes,update_ipes,delete_ipes,create_branch,update_branch,delete_branch,create_level,update_level,delete_level',
  },
  {
    id: '15',
    name: 'System Auditor',
    rights:
      'read_ues,read_module,read_syllabus,read_document,read_level,read_branch,read_university,read_ipes,read_user',
  },
];

//50 us states array
export const rights = [
  'create_ues',
  'read_ues',
  'update_ues',
  'delete_ues',
  'create_module',
  'read_module',
  'update_module',
  'delete_module',
  'create_syllabus',
  'read_syllabus',
  'update_syllabus',
  'delete_syllabus',
  'create_user',
  'read_user',
  'update_user',
  'delete_user',
  'create_document',
  'read_document',
  'update_document',
  'delete_document',
  'create_level',
  'read_level',
  'update_level',
  'delete_level',
  'create_branch',
  'read_branch',
  'update_branch',
  'delete_branch',
  'create_university',
  'read_university',
  'update_university',
  'delete_university',
  'create_ipes',
  'read_ipes',
  'update_ipes',
  'delete_ipes',
];
