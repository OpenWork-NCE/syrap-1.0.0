function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/authentication';
const ROOTS_BOARD = '/board';
const ROOTS_DASHBOARD = '/dashboard/';

export const PATH_BOARD = {
  root: ROOTS_BOARD,
  cenadi: path(ROOTS_BOARD, '/cenadi'),
  minesup: path(ROOTS_BOARD, '/minesup'),
  ipes: path(ROOTS_BOARD, '/ipes'),
};

const ROOTS_UES = '/ues/';
const ROOTS_DOCUMENTS = '/documents';
const ROOTS_USERS = '/users';
const ROOT_SECTIONS = '/sections';
const ROOTS_UNIVERSITIES = '/universities';

export const PATH_SECTIONS = {
  root: ROOT_SECTIONS,
  ues: path(ROOT_SECTIONS, '/ues/list'),
  users: path(ROOT_SECTIONS, '/users'),
  authorizations: path(ROOT_SECTIONS, '/roles'),
  universities: {
    all: path(ROOT_SECTIONS, ROOTS_UNIVERSITIES + '/'),
    syllabus: path(ROOT_SECTIONS, ROOTS_UNIVERSITIES + `/syllabus`),
    documents: path(ROOT_SECTIONS, ROOTS_UNIVERSITIES + `/documents`),
    university_details: (id: string): string =>
      path(ROOT_SECTIONS, ROOTS_UNIVERSITIES + `/${id}`),
  },
  crosscompare: path(ROOT_SECTIONS, '/crosscompare'),
  ipes: path(ROOT_SECTIONS, '/ipes'),
  downloads: path(ROOT_SECTIONS, '/documents/downloads'),
  uploads: path(ROOT_SECTIONS, '/documents/uploads'),
  reports: path(ROOT_SECTIONS, '/reports'),
  logs: path(ROOT_SECTIONS, '/logs'),
};

const ROOT_APPS = '/apps';
const ROOTS_PAGES = '/pages';
const ROOTS_INVOICES = '/invoices';
const ROOTS_TASKS = '/tasks';
const ROOTS_ABOUT = '/pages/about';

//Temporary just for look
export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  default: path(ROOTS_DASHBOARD, '/default'),
  analytics: path(ROOTS_DASHBOARD, '/analytics'),
  saas: path(ROOTS_DASHBOARD, '/saas'),
};

export const PATH_APPS = {
  root: ROOT_APPS,
  calendar: path(ROOT_APPS, '/calendar'),
  chat: path(ROOT_APPS, '/chat'),
  invoices: {
    all: path(ROOT_APPS, ROOTS_INVOICES + '/list'),
    sample: path(ROOT_APPS, ROOTS_INVOICES + `/details/`),
    invoice_details: (id: string): string =>
      path(ROOT_APPS, ROOTS_INVOICES + `/details/${id}`),
  },
  orders: path(ROOT_APPS, '/orders'),
  profile: path(ROOT_APPS, '/profile'),
  projects: path(ROOT_APPS, '/projects'),
  settings: path(ROOT_APPS, '/settings'),
  tasks: path(ROOT_APPS, '/tasks'),
};

export const PATH_PAGES = {
  root: ROOTS_PAGES,
  pricing: path(ROOTS_PAGES, '/pricing'),
  blank: path(ROOTS_PAGES, '/blank'),
};

export const PATH_INVOICES = {
  root: ROOTS_INVOICES,
  invoices: {
    all: path(ROOTS_INVOICES, '/list'),
    sample: path(ROOTS_INVOICES, `/details/`),
    invoice_details: (id: string): string =>
      path(ROOTS_INVOICES, `/details/${id}`),
  },
};

export const PATH_UES = {
  root: ROOTS_UES,
  ues: {
    all: path(ROOTS_UES, '/list'),
    sample: path(ROOTS_INVOICES, `/details/`),
    ue_details: (id: string): string => path(ROOTS_INVOICES, `/details/${id}`),
  },
};

export const PATH_UNIVERSITIES = {
  root: ROOTS_UNIVERSITIES,
  universities: {
    all: path(ROOTS_UNIVERSITIES, '/'),
    syllabus: path(ROOTS_UNIVERSITIES, `/syllabus`),
    documents: path(ROOTS_UNIVERSITIES, `/documents}`),
  },
};

export const PATH_DOCUMENTS = {
  root: ROOTS_DOCUMENTS,
  documents: {
    uploads: path(ROOTS_INVOICES, '/uploads'),
    downloads: path(ROOTS_INVOICES, `/downloads`),
  },
};

export const PATH_TASKS = {
  root: ROOTS_TASKS,
};

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  signin: path(ROOTS_AUTH, '/signin'),
  signup: path(ROOTS_AUTH, '/signup'),
  passwordReset: path(ROOTS_AUTH, '/password-reset'),
};

export const PATH_DOCS = {
  root: 'https://mantine-analytics-dashboard-docs.netlify.app/',
};

export const PATH_GITHUB = {
  org: 'https://github.com/design-sparx',
  repo: 'https://github.com/design-sparx/mantine-analytics-dashboard',
};

export const PATH_ABOUT = {
  root: ROOTS_ABOUT,
};
