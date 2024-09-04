import { Ues } from '@/types';

import { Ipes } from '@/types';

export const fakeData: Ipes[] = [
  {
    id: '1',
    name: "Institut Supérieur d'Informatique et de Gestion (ISIG)",
    phone: '+237 699 20 20 20',
    email: 'isig@isig.cm',
    borough: 'Yaoundé',
    created_user: 'Martine Owona',
    university: "Université Catholique d'Afrique Centrale",
    decret_of_creation: 'Décret N° 2002/1234 du 15 juin 2002',
    opening_stop: 'Ouvert',
    promoter: 'Dr. Jean-Pierre Etame',
  },
  {
    id: '2',
    name: 'Institut Supérieur de Génie Informatique (ISGI)',
    phone: '+237 677 30 30 30',
    email: 'isgi@isgi.edu.cm',
    borough: 'Douala',
    created_user: 'Alain Nguema',
    university: 'Université de Douala',
    decret_of_creation: 'Décret N° 2005/4321 du 28 décembre 2005',
    opening_stop: 'Ouvert',
    promoter: 'Prof. Marie-Claire Njoya',
  },
  {
    id: '3',
    name: 'École Supérieure Multinationale des Télécommunications (ESMT)',
    phone: '+237 233 43 43 43',
    email: 'esmt@esmt.org',
    borough: 'Douala',
    created_user: 'Sandrine Mbarga',
    university: 'Université de Douala',
    decret_of_creation: 'Décret N° 1991/078 du 12 avril 1991',
    opening_stop: 'Ouvert',
    promoter: 'Dr. Georges Obama',
  },
  {
    id: '4',
    name: 'Institut Universitaire de Technologie Fotso Victor de Bandjoun',
    phone: '+237 699 21 21 21',
    email: 'iut-fvb@iut-fvb.com',
    borough: 'Bandjoun',
    created_user: 'Georges Essomba',
    university: 'Université des Montagnes',
    decret_of_creation: 'Décret N° 2007/3456 du 30 novembre 2007',
    opening_stop: 'Ouvert',
    promoter: 'Prof. Brigitte Eyenga',
  },
  {
    id: '5',
    name: "Institut Supérieur de Management et de l'Entrepreneuriat (ISME)",
    phone: '+237 677 31 31 31',
    email: 'isme@isme.edu.cm',
    borough: 'Yaoundé',
    created_user: 'Marie-Louise Atangana',
    university: "Université Catholique d'Afrique Centrale",
    decret_of_creation: 'Décret N° 2012/0987 du 05 mars 2012',
    opening_stop: 'Ouvert',
    promoter: 'Dr. Charles Tchouta',
  },
  {
    id: '6',
    name: 'Institut des Sciences Halieutiques de Yabassi (ISH)',
    phone: '+237 233 44 44 44',
    email: 'ish@univ-douala.com',
    borough: 'Yabassi',
    created_user: 'Père Jean-Baptiste Eboa',
    university: 'Université de Douala',
    decret_of_creation: 'Décret N° 1983/123 du 25 février 1983',
    opening_stop: 'Ouvert',
    promoter: 'Prof. Danielle Djoumessi',
  },
  {
    id: '7',
    name: 'École Supérieure de Génie Informatique (ESGI)',
    phone: '+237 699 22 22 22',
    email: 'esgi@esgi-cameroun.com',
    borough: 'Yaoundé',
    created_user: 'Pasteur Daniel Njoya',
    university: 'Université de Yaoundé I',
    decret_of_creation: 'Décret N° 2009/5678 du 10 août 2009',
    opening_stop: 'Ouvert',
    promoter: 'Dr. Eric Nguema',
  },
  {
    id: '8',
    name: "Institut Supérieur des Sciences et Techniques de l'Information et de la Communication (ISTIC)",
    phone: '+237 677 32 32 32',
    email: 'istic@istic.cm',
    borough: 'Yaoundé',
    created_user: 'Sœur Marie-Claire Foning',
    university: 'Université de Yaoundé II',
    decret_of_creation: 'Décret N° 2001/6543 du 20 novembre 2001',
    opening_stop: 'Ouvert',
    promoter: 'Prof. Françoise Abanda',
  },
  {
    id: '9',
    name: 'École Nationale Supérieure des Postes et Télécommunications (ENSPT)',
    phone: '+237 222 30 30 30',
    email: 'enspt@enspt.cm',
    borough: 'Yaoundé',
    created_user: 'Pierre-André Mbida',
    university: 'Université de Yaoundé I',
    decret_of_creation: 'Décret N° 1988/543 du 15 mars 1988',
    opening_stop: 'Ouvert',
    promoter: 'Dr. Georges Mengue',
  },
  {
    id: '10',
    name: 'Institut Supérieur de Technologie Appliquée (ISTA)',
    phone: '+237 699 23 23 23',
    email: 'ista@ista.edu.cm',
    borough: 'Douala',
    created_user: 'Brigitte Meyo',
    university: 'Université de Douala',
    decret_of_creation: 'Décret N° 2006/7654 du 02 janvier 2006',
    opening_stop: 'Ouvert',
    promoter: 'Prof. Henriette Ewane',
  },
  {
    id: '11',
    name: 'Institut Universitaire Catholique de Buea (IUCB)',
    phone: '+237 233 45 45 45',
    email: 'iucb@iucb.cm',
    borough: 'Buea',
    created_user: 'Charles Etoga',
    university: "Université Catholique d'Afrique Centrale",
    decret_of_creation: 'Décret N° 2003/2345 du 10 octobre 2003',
    opening_stop: 'Ouvert',
    promoter: 'Dr. Ibrahim Mbida',
  },
  {
    id: '12',
    name: "Institut Supérieur des Sciences et Technologies de l'Eau (ISSSTE)",
    phone: '+237 677 33 33 33',
    email: 'issste@issste.org',
    borough: 'Messa',
    created_user: 'Danielle Olinga',
    university: 'Université de Yaoundé I',
    decret_of_creation: 'Décret N° 2015/8765 du 05 février 2015',
    opening_stop: 'Ouvert',
    promoter: 'Prof. Jacqueline Njoya',
  },
  {
    id: '13',
    name: 'École Supérieure de Commerce et de Gestion (ESCG)',
    phone: '+237 233 46 46 46',
    email: 'escg@escg-douala.com',
    borough: 'Douala',
    created_user: 'Eric Eyenga',
    university: 'Université de Douala',
    decret_of_creation: 'Décret N° 1998/765 du 20 janvier 1998',
    opening_stop: 'Ouvert',
    promoter: 'Prof. Karim Essomba',
  },
  {
    id: '14',
    name: "Institut Supérieur de Management de l'Information et de la Communication (ISMA)",
    phone: '+237 699 24 24 24',
    email: 'isma@isma-yaounde.org',
    borough: 'Yaoundé',
    created_user: 'Françoise Tchouta',
    university: "Université Catholique d'Afrique Centrale",
    decret_of_creation: 'Décret N° 2004/3456 du 12 novembre 2004',
    opening_stop: 'Ouvert',
    promoter: 'Dr. Lucie Abanda',
  },
  {
    id: '15',
    name: 'Institut Supérieur de Commerce et de Comptabilité (ISCC)',
    phone: '+237 677 34 34 34',
    email: 'iscc@iscc-yaounde.com',
    borough: 'Yaoundé',
    created_user: 'Georges Djoumessi',
    university: 'Université de Yaoundé II',
    decret_of_creation: 'Décret N° 1999/876 du 03 mars 1999',
    opening_stop: 'Ouvert',
    promoter: 'Prof. Marcel Mbarga',
  },
  {
    id: '16',
    name: "Centre d'Excellence Africain en Technologies de l'Information et de la Communication (CETIC)",
    phone: '+237 233 47 47 47',
    email: 'cetic@cetic.cm',
    borough: 'Douala',
    created_user: 'Henriette Nanga',
    university: 'Université de Douala',
    decret_of_creation: 'Décret N° 2013/6543 du 25 août 2013',
    opening_stop: 'Ouvert',
    promoter: 'Prof. Nadine Atangana',
  },
  {
    id: '17',
    name: "Institut Supérieur de Mathématiques et d'Informatique (ISMI)",
    phone: '+237 699 25 25 25',
    email: 'ismi@ismi-yaounde.org',
    borough: 'Yaoundé',
    created_user: 'Ibrahim Yomba',
    university: 'Université de Yaoundé I',
    decret_of_creation: 'Décret N° 2000/1098 du 01 avril 2000',
    opening_stop: 'Ouvert',
    promoter: 'Dr. Olivier Meyo',
  },
  {
    id: '18',
    name: 'Institut des Beaux-Arts de Nkongsamba (IBAN)',
    phone: '+237 233 48 48 48',
    email: 'iban@iban.cm',
    borough: 'Nkongsamba',
    created_user: 'Jacqueline Abanda',
    university: 'Université de Douala',
    decret_of_creation: 'Décret N° 1995/234 du 15 juin 1995',
    opening_stop: 'Ouvert',
    promoter: 'Prof. Paulette Etoa',
  },
  {
    id: '19',
    name: 'Institut Universitaire de Technologie de Ngaoundéré (IUT-Ngaoundéré)',
    phone: '+237 233 49 49 49',
    email: 'iut@univ-ndere.cm',
    borough: 'Ngaoundéré',
    created_user: 'Karim Mengue',
    university: 'Université de Ngaoundéré',
    decret_of_creation: 'Décret N° 2008/7890 du 03 février 2008',
    opening_stop: 'Ouvert',
    promoter: 'Dr. Quentin Nguema',
  },
  {
    id: '20',
    name: "École Supérieure des Sciences et Techniques de l'Information et de la Communication (ESSTIC)",
    phone: '+237 222 31 31 31',
    email: 'esstic@esstic.cm',
    borough: 'Yaoundé',
    created_user: 'Lucie Ewane',
    university: 'Université de Yaoundé II',
    decret_of_creation: 'Décret N° 1992/321 du 10 juillet 1992',
    opening_stop: 'Ouvert',
    promoter: 'Prof. Raissa Essomba',
  },
  {
    id: '21',
    name: "Institut Supérieur de l'Aéronautique et de l'Espace (ISAE)",
    phone: '+237 677 35 35 35',
    email: 'isae@isae-cameroun.org',
    borough: 'Douala',
    created_user: 'Marcel Nguema',
    university: 'Université de Douala',
    decret_of_creation: 'Décret N° 2014/4321 du 18 août 2014',
    opening_stop: 'Ouvert',
    promoter: 'Dr. Serge Owona',
  },
  {
    id: '22',
    name: "Institut des Sciences et Techniques de l'Ingénieur de Bamenda (ISTI-Bamenda)",
    phone: '+237 233 50 50 50',
    email: 'isti@univ-bamenda.cm',
    borough: 'Bamenda',
    created_user: 'Nadine Obama',
    university: 'Université de Bamenda',
    decret_of_creation: 'Décret N° 2010/0123 du 05 janvier 2010',
    opening_stop: 'Ouvert',
    promoter: 'Prof. Yvonne Mballa',
  },
  {
    id: '23',
    name: 'Institut Supérieur de Génie Civil (ISGC)',
    phone: '+237 699 26 26 26',
    email: 'isgc@isgc-buea.org',
    borough: 'Buea',
    created_user: 'Olivier Mbida',
    university: 'Université de Buea',
    decret_of_creation: 'Décret N° 2003/4567 du 22 décembre 2003',
    opening_stop: 'Ouvert',
    promoter: 'Dr. Alain Zogo',
  },
  {
    id: '24',
    name: 'École Supérieure des Sciences Économiques et Commerciales (ESSEC)',
    phone: '+237 233 51 51 51',
    email: 'essec@essec-douala.com',
    borough: 'Douala',
    created_user: 'Paulette Njoya',
    university: 'Université de Douala',
    decret_of_creation: 'Décret N° 1997/654 du 10 novembre 1997',
    opening_stop: 'Ouvert',
    promoter: 'Prof. Quentin Atangana',
  },
];

//50 us states array
export const usStates = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
  'Puerto Rico',
];