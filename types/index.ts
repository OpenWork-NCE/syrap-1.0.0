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

export type Arrondissements = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
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

export type Ues = {
  id: string;
  ue_name: string;
  slug: string;
  nbr_hours: number;
  description: string;
  user_creator: string;
};

export type Module = {
  id: string;
  name: string;
  ues: Ues[];
};

export type Syllabus = {
  id: string;
  name: string;
  modules: Module[];
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  state: string;
  memberships: 'Cenadi' | 'Minesup' | 'Ipes';
  profile: string;
};

export type Document = {
  id: string;
  document_name: File;
  document_description: string;
  document_type: string;
  document_size: number;
  upload_date: string;
  uploaded_user: string;
  state: 'Actif' | 'Supprimé' | 'Archivé';
};

export type Level = {
  id: string;
  name: string;
};

export type Branch = {
  id: string;
  name: string;
  levels: Level[];
};

export type University = {
  //These are Cameroonian and international universities that have representations in Cameroon
  id: string;
  name: string;
  phone: string;
  email: string;
  localization: string; //Cameroon arrondissement
  created_user: string; //Name of creator
  ipes_count: number;
  global_matching: number;
  branch_count: number;
  level_count: number;
  branchs: Branch[];
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
};

export type Authorization = {
  id: string;
  name: string;
  rights: string;
};
