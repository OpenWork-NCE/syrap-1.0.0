export type Id = string | number;

export type KanbanColumn = {
  id: Id;
  title: string;
};

export type KanbanTask = {
  id: Id;
  columnId: Id;
  content: string;
  title?: string;
  status?: 'to do' | 'in progress' | 'done' | 'unassigned' | string;
  comments?: number;
  users?: number;
};

export type OrderStatus = 'shipped' | 'processing' | 'cancelled' | string;

export type Orders = {
  id: string;
  product: string;
  date: string;
  total: number;
  status: OrderStatus;
  payment_method: string;
};

export type InvoiceStatus =
  | 'pending'
  | 'sent'
  | 'cancelled'
  | 'approved'
  | 'suspended'
  | string;

export type Invoices = {
  id: string;
  full_name: string;
  email: string;
  address: string;
  country: string;
  status: InvoiceStatus;
  amount: number;
  issue_date: string;
  description: string;
  client_email: string;
  client_address: string;
  client_country: string;
  client_name: string;
  client_company: string;
};

export type Document = {
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
};

export type Profile = {
  id: string;
  name: string;
  rights: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type User = {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  state: string;
  memberships: 'Cenadi' | 'Minesup' | 'Ipes';
  profiles: Profile[];
  createdAt: Date;
  updatedAt: Date;
};

export type Ues = {
  id: string;
  ue_name: string;
  slug: string;
  description: string;
  user_creator: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Module = {
  id: string;
  name: string;
  ues: {
    id: string;
    ue: Ues;
    nbr_hours: number;
    nbr_credits: number;
    tailored_description: string;
    teacher: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
};

export type Syllabus = {
  id: string;
  name: string;
  modules: Module[];
  createdAt: Date;
  updatedAt: Date;
};

export type Level = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type LevelApiResponse = {
  data: Array<Level>;
  messages: Array<string>;
  success: string;
};

export type Branch = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type BranchApiResponse = {
  data: Array<Branch>;
};

export type Classroom = {
  id: string;
  niveau: Level;
  filiere: Branch;
  createdAt: string;
  updatedAt: string;
};

export type ClassroomApiResponse = {
  data: Array<Classroom>;
  messages: Array<string>;
  success: string;
};

export type University = {
  //These are Cameroonian and international universities that have representations in Cameroon
  id: string;
  name: string;
  code: string;
  description?: string;
  phone?: string;
  email?: string;
  arrondissement_id?: number;
  user_id?: string;
  cenadi_id?: string;
  ipes_count?: number;
  global_matching?: number;
  branch_count?: number;
  level_count?: number;
  salles: Classroom[];
};

export type UniversityApiResponse = {
  data: Array<University>;
  messages: Array<string>;
  success: string;
};

export type Ipes = {
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
  branchs: Branch[];
  createdAt: Date;
  updatedAt: Date;
};
