import { Branch, University } from '@/types';

export type UniversityContext = {
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
};

export const fakeData: University[] = [
  {
    id: '2a9f4b6c9d8e7f6a5b3c',
    name: "Institut Africain d'Informatique (IAI-Cameroun)",
    phone: '+237 233 41 41 41',
    email: 'iai@iai-cameroon.org',
    localization: 'Douala',
    created_user: 'Martine Owona',
    ipes_count: 12,
    global_matching: 87,
    branch_count: 20,
    level_count: 3,
    branchs: [
      {
        id: 'br1',
        name: 'Génie Logiciel',
        levels: [
          { id: 'lv1', name: 'Licence' },
          { id: 'lv2', name: 'Master' },
          { id: 'lv3', name: 'Doctorat' },
        ],
      },
      {
        id: 'br2',
        name: 'Réseaux et Télécommunications',
        levels: [
          { id: 'lv4', name: 'Licence' },
          { id: 'lv5', name: 'Master' },
        ],
      },
    ],
  },
  {
    id: '1f9e7d5b4c3a2e6b7d9f',
    name: 'École Nationale Supérieure Polytechnique de Yaoundé',
    phone: '+237 222 25 25 25',
    email: 'enspy@enspy.cm',
    localization: 'Yaoundé',
    created_user: 'Alain Nguema',
    ipes_count: 25,
    global_matching: 92,
    branch_count: 35,
    level_count: 4,
    branchs: [
      {
        id: 'br3',
        name: 'Informatique Industrielle',
        levels: [
          { id: 'lv6', name: 'Licence' },
          { id: 'lv7', name: 'Master' },
          { id: 'lv8', name: 'Doctorat' },
        ],
      },
      {
        id: 'br4',
        name: 'Cybersécurité',
        levels: [
          { id: 'lv9', name: 'Licence' },
          { id: 'lv10', name: 'Master' },
        ],
      },
    ],
  },
  {
    id: '3c8f7e6d9b4a1c5f2e7b',
    name: 'Université de Douala',
    phone: '+237 233 33 33 33',
    email: 'info@univ-douala.com',
    localization: 'Douala I',
    created_user: 'Sandrine Mbarga',
    ipes_count: 18,
    global_matching: 85,
    branch_count: 28,
    level_count: 3,
    branchs: [
      {
        id: 'br5',
        name: 'Génie Logiciel',
        levels: [
          { id: 'lv11', name: 'Licence' },
          { id: 'lv12', name: 'Master' },
        ],
      },
      {
        id: 'br6',
        name: 'Sécurité des Systèmes d’Information',
        levels: [
          { id: 'lv13', name: 'Licence' },
          { id: 'lv14', name: 'Master' },
        ],
      },
    ],
  },
  {
    id: '4b7a6c5e9d2f1e4c3b7f',
    name: 'Université de Yaoundé I',
    phone: '+237 222 22 22 22',
    email: 'info@uy1.cm',
    localization: 'Yaoundé I',
    created_user: 'Georges Essomba',
    ipes_count: 30,
    global_matching: 89,
    branch_count: 45,
    level_count: 4,
    branchs: [
      {
        id: 'br7',
        name: 'Informatique Appliquée',
        levels: [
          { id: 'lv15', name: 'Licence' },
          { id: 'lv16', name: 'Master' },
          { id: 'lv17', name: 'Doctorat' },
        ],
      },
      {
        id: 'br8',
        name: 'Systèmes Embarqués',
        levels: [
          { id: 'lv18', name: 'Licence' },
          { id: 'lv19', name: 'Master' },
        ],
      },
    ],
  },
  {
    id: '5e8f7b6c9a4d2f3b1c7e',
    name: "Université Catholique d'Afrique Centrale",
    phone: '+237 222 21 21 21',
    email: 'ucac@ucac-icy.net',
    localization: 'Yaoundé VI',
    created_user: 'Marie-Louise Atangana',
    ipes_count: 10,
    global_matching: 90,
    branch_count: 15,
    level_count: 3,
    branchs: [
      {
        id: 'br9',
        name: 'Informatique et Télécommunications',
        levels: [
          { id: 'lv20', name: 'Licence' },
          { id: 'lv21', name: 'Master' },
        ],
      },
      {
        id: 'br10',
        name: 'Big Data',
        levels: [
          { id: 'lv22', name: 'Licence' },
          { id: 'lv23', name: 'Master' },
        ],
      },
    ],
  },
  {
    id: '6a9e7c5b8f4d3b2e1c9f',
    name: 'Institut Universitaire de la Côte',
    phone: '+237 233 32 32 32',
    email: 'iuc@iuc-univ.net',
    localization: 'Douala',
    created_user: 'Père Jean-Baptiste Eboa',
    ipes_count: 22,
    global_matching: 88,
    branch_count: 38,
    level_count: 3,
    branchs: [
      {
        id: 'br11',
        name: 'Informatique et Réseaux',
        levels: [
          { id: 'lv24', name: 'Licence' },
          { id: 'lv25', name: 'Master' },
        ],
      },
      {
        id: 'br12',
        name: 'Technologies de l’Information et Communication',
        levels: [
          { id: 'lv26', name: 'Licence' },
          { id: 'lv27', name: 'Master' },
          { id: 'lv28', name: 'Doctorat' },
        ],
      },
    ],
  },
  {
    id: '7f8e6d4c9b2a1e5f3c7d',
    name: 'Université des Montagnes',
    phone: '+237 699 97 97 97',
    email: 'udm@udm.cm',
    localization: 'Bangangté',
    created_user: 'Pasteur Daniel Njoya',
    ipes_count: 17,
    global_matching: 86,
    branch_count: 32,
    level_count: 4,
    branchs: [
      {
        id: 'br13',
        name: 'Sciences Informatiques',
        levels: [
          { id: 'lv29', name: 'Licence' },
          { id: 'lv30', name: 'Master' },
          { id: 'lv31', name: 'Doctorat' },
        ],
      },
      {
        id: 'br14',
        name: 'Intelligence Artificielle',
        levels: [
          { id: 'lv32', name: 'Licence' },
          { id: 'lv33', name: 'Master' },
        ],
      },
    ],
  },
  {
    id: '8d7a6b9e5f4c2e1b3c9f',
    name: 'Institut Supérieur Siantou',
    phone: '+237 677 88 88 88',
    email: 'siantou@institutsiantou.com',
    localization: 'Yaoundé',
    created_user: 'Sœur Marie-Claire Foning',
    ipes_count: 8,
    global_matching: 78,
    branch_count: 20,
    level_count: 2,
    branchs: [
      {
        id: 'br15',
        name: 'Développement Web et Mobile',
        levels: [
          { id: 'lv34', name: 'Licence' },
          { id: 'lv35', name: 'Master' },
        ],
      },
      {
        id: 'br16',
        name: 'Gestion des Systèmes Informatiques',
        levels: [
          { id: 'lv36', name: 'Licence' },
          { id: 'lv37', name: 'Master' },
        ],
      },
    ],
  },
  {
    id: '9b7e5c4d8f2a3c1e6b9f',
    name: 'Université de Buea',
    phone: '+237 233 34 34 34',
    email: 'info@ubuea.cm',
    localization: 'Buea',
    created_user: 'Pierre-André Mbida',
    ipes_count: 28,
    global_matching: 91,
    branch_count: 48,
    level_count: 4,
    branchs: [
      {
        id: 'br17',
        name: 'Informatique',
        levels: [
          { id: 'lv38', name: 'Licence' },
          { id: 'lv39', name: 'Master' },
          { id: 'lv40', name: 'Doctorat' },
        ],
      },
      {
        id: 'br18',
        name: 'Réseaux Informatiques et Sécurité',
        levels: [
          { id: 'lv41', name: 'Licence' },
          { id: 'lv42', name: 'Master' },
        ],
      },
    ],
  },
  {
    id: '10f9e7d6b4a5c3f2e8b9',
    name: 'Université de Bamenda',
    phone: '+237 233 37 37 37',
    email: 'info@univ-bamenda.cm',
    localization: 'Bamenda',
    created_user: 'Brigitte Meyo',
    ipes_count: 23,
    global_matching: 83,
    branch_count: 30,
    level_count: 3,
    branchs: [
      {
        id: 'br19',
        name: 'Ingénierie Informatique',
        levels: [
          { id: 'lv43', name: 'Licence' },
          { id: 'lv44', name: 'Master' },
        ],
      },
      {
        id: 'br20',
        name: 'Sciences des Données',
        levels: [
          { id: 'lv45', name: 'Licence' },
          { id: 'lv46', name: 'Master' },
          { id: 'lv47', name: 'Doctorat' },
        ],
      },
    ],
  },
  {
    id: '11c8f7d5b3a4e6c9f1e2',
    name: 'Ecole Nationale Supérieure Polytechnique de Maroua',
    phone: '+237 233 36 36 37',
    email: 'enspm@enspm.cm',
    localization: 'Maroua',
    created_user: 'Charles Etoga',
    ipes_count: 19,
    global_matching: 84,
    branch_count: 33,
    level_count: 2,
    branchs: [
      {
        id: 'br21',
        name: 'Technologies Numériques',
        levels: [
          { id: 'lv48', name: 'Licence' },
          { id: 'lv49', name: 'Master' },
        ],
      },
      {
        id: 'br22',
        name: 'Cybersécurité et Systèmes',
        levels: [
          { id: 'lv50', name: 'Licence' },
          { id: 'lv51', name: 'Master' },
        ],
      },
    ],
  },
  {
    id: '12d7f8b6c5a9e2c4b3f1',
    name: "Université Protestante d'Afrique Centrale",
    phone: '+237 222 20 20 20',
    email: 'upac@upac.org',
    localization: 'Yaoundé',
    created_user: 'Danielle Olinga',
    ipes_count: 16,
    global_matching: 82,
    branch_count: 25,
    level_count: 3,
    branchs: [
      {
        id: 'br23',
        name: 'Informatique de Gestion',
        levels: [
          { id: 'lv52', name: 'Licence' },
          { id: 'lv53', name: 'Master' },
        ],
      },
      {
        id: 'br24',
        name: 'Programmation et Développement',
        levels: [
          { id: 'lv54', name: 'Licence' },
          { id: 'lv55', name: 'Master' },
          { id: 'lv56', name: 'Doctorat' },
        ],
      },
    ],
  },
  {
    id: '13a9d7b5f6c3e2b4f1e6',
    name: 'Institut Universitaire Catholique Saint Jérôme',
    phone: '+237 699 98 98 98',
    email: 'iucsj@iucsj.org',
    localization: 'Dschang',
    created_user: 'Eric Eyenga',
    ipes_count: 14,
    global_matching: 79,
    branch_count: 24,
    level_count: 3,
    branchs: [
      {
        id: 'br25',
        name: 'Développement Web',
        levels: [
          { id: 'lv57', name: 'Licence' },
          { id: 'lv58', name: 'Master' },
        ],
      },
      {
        id: 'br26',
        name: 'Ingénierie Informatique',
        levels: [
          { id: 'lv59', name: 'Licence' },
          { id: 'lv60', name: 'Master' },
        ],
      },
    ],
  },
  {
    id: '14f8d9b6a7e5c3b2f1e4',
    name: 'Université de Dschang',
    phone: '+237 699 99 99 99',
    email: 'udschang@univ-dschang.org',
    localization: 'Dschang',
    created_user: 'Françoise Tchouta',
    ipes_count: 30,
    global_matching: 87,
    branch_count: 40,
    level_count: 4,
    branchs: [
      {
        id: 'br27',
        name: 'Informatique et Réseaux',
        levels: [
          { id: 'lv61', name: 'Licence' },
          { id: 'lv62', name: 'Master' },
          { id: 'lv63', name: 'Doctorat' },
        ],
      },
      {
        id: 'br28',
        name: 'Technologies des Communications',
        levels: [
          { id: 'lv64', name: 'Licence' },
          { id: 'lv65', name: 'Master' },
        ],
      },
    ],
  },
];
