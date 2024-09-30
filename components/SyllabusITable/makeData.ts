import { Module } from '@/types';

export type Ues = {
  id: string;
  ue_name: string;
  slug: string;
  nbr_hours: number;
  description: string;
  user_creator: string;
  module: string;
  level: string;
  branch: string;
  ipes: string;
};

export const fakeData: Ues[] = [
  // IAI-Cameroun
  {
    id: 'ues1',
    ue_name: 'Algorithmes Avancés',
    slug: 'algorithmes-avances',
    nbr_hours: 45,
    description: 'Introduction aux algorithmes avancés et leurs applications.',
    user_creator: 'Martine Owona',
    module: 'Informatique Théorique',
    level: 'Licence',
    branch: 'Génie Logiciel',
    ipes: "Institut Africain d'Informatique (IAI-Cameroun)",
  },
  {
    id: 'ues2',
    ue_name: 'Systèmes Distribués',
    slug: 'systemes-distribues',
    nbr_hours: 60,
    description: 'Étude des systèmes distribués et de leur architecture.',
    user_creator: 'Martine Owona',
    module: 'Systèmes',
    level: 'Master',
    branch: 'Génie Logiciel',
    ipes: "Institut Africain d'Informatique (IAI-Cameroun)",
  },
  {
    id: 'ues3',
    ue_name: 'Sécurité des Réseaux',
    slug: 'securite-reseaux',
    nbr_hours: 40,
    description: 'Introduction aux concepts de la sécurité dans les réseaux.',
    user_creator: 'Martine Owona',
    module: 'Sécurité Réseaux',
    level: 'Licence',
    branch: 'Réseaux et Télécommunications',
    ipes: "Institut Africain d'Informatique (IAI-Cameroun)",
  },
  {
    id: 'ues4',
    ue_name: 'Cryptographie',
    slug: 'cryptographie',
    nbr_hours: 55,
    description: 'Principes de la cryptographie appliquée dans les systèmes.',
    user_creator: 'Martine Owona',
    module: 'Sécurité',
    level: 'Master',
    branch: 'Réseaux et Télécommunications',
    ipes: "Institut Africain d'Informatique (IAI-Cameroun)",
  },
  {
    id: 'ues5',
    ue_name: 'Programmation Web',
    slug: 'programmation-web',
    nbr_hours: 50,
    description: 'Développement de sites web dynamiques et interactifs.',
    user_creator: 'Martine Owona',
    module: 'Développement Web',
    level: 'Licence',
    branch: 'Génie Logiciel',
    ipes: "Institut Africain d'Informatique (IAI-Cameroun)",
  },

  // ENSPY Yaoundé
  {
    id: 'ues6',
    ue_name: 'Intelligence Artificielle',
    slug: 'intelligence-artificielle',
    nbr_hours: 65,
    description: "Introduction aux concepts d'intelligence artificielle.",
    user_creator: 'Alain Nguema',
    module: 'IA',
    level: 'Master',
    branch: 'Informatique Industrielle',
    ipes: 'École Nationale Supérieure Polytechnique de Yaoundé',
  },
  {
    id: 'ues7',
    ue_name: 'Bases de Données Avancées',
    slug: 'bases-donnees-avancees',
    nbr_hours: 45,
    description: 'Gestion et optimisation des bases de données.',
    user_creator: 'Alain Nguema',
    module: 'Base de Données',
    level: 'Licence',
    branch: 'Informatique Industrielle',
    ipes: 'École Nationale Supérieure Polytechnique de Yaoundé',
  },
  {
    id: 'ues8',
    ue_name: 'Cyberdéfense',
    slug: 'cyberdefense',
    nbr_hours: 55,
    description: 'Sécurisation des infrastructures informatiques.',
    user_creator: 'Alain Nguema',
    module: 'Sécurité',
    level: 'Master',
    branch: 'Cybersécurité',
    ipes: 'École Nationale Supérieure Polytechnique de Yaoundé',
  },
  {
    id: 'ues9',
    ue_name: 'Réseaux Industriels',
    slug: 'reseaux-industriels',
    nbr_hours: 50,
    description: 'Réseaux utilisés dans les environnements industriels.',
    user_creator: 'Alain Nguema',
    module: 'Réseaux',
    level: 'Licence',
    branch: 'Informatique Industrielle',
    ipes: 'École Nationale Supérieure Polytechnique de Yaoundé',
  },
  {
    id: 'ues10',
    ue_name: 'Développement Mobile',
    slug: 'developpement-mobile',
    nbr_hours: 40,
    description: "Conception d'applications mobiles multiplateformes.",
    user_creator: 'Alain Nguema',
    module: 'Développement Mobile',
    level: 'Licence',
    branch: 'Cybersécurité',
    ipes: 'École Nationale Supérieure Polytechnique de Yaoundé',
  },

  // Université de Douala
  {
    id: 'ues11',
    ue_name: 'Programmation Orientée Objet',
    slug: 'programmation-orientee-objet',
    nbr_hours: 45,
    description: 'Fondements de la programmation orientée objet.',
    user_creator: 'Sandrine Mbarga',
    module: 'Développement',
    level: 'Licence',
    branch: 'Génie Logiciel',
    ipes: 'Université de Douala',
  },
  {
    id: 'ues12',
    ue_name: 'Sécurité des Systèmes',
    slug: 'securite-systemes',
    nbr_hours: 50,
    description: 'Protection des systèmes informatiques et réseaux.',
    user_creator: 'Sandrine Mbarga',
    module: 'Sécurité',
    level: 'Master',
    branch: 'Sécurité des Systèmes d’Information',
    ipes: 'Université de Douala',
  },
  {
    id: 'ues13',
    ue_name: 'Réseaux Informatiques',
    slug: 'reseaux-informatiques',
    nbr_hours: 60,
    description: 'Conception et maintenance de réseaux informatiques.',
    user_creator: 'Sandrine Mbarga',
    module: 'Réseaux',
    level: 'Licence',
    branch: 'Sécurité des Systèmes d’Information',
    ipes: 'Université de Douala',
  },
  {
    id: 'ues14',
    ue_name: 'Conception de Bases de Données',
    slug: 'conception-bases-donnees',
    nbr_hours: 55,
    description: 'Conception et gestion des bases de données relationnelles.',
    user_creator: 'Sandrine Mbarga',
    module: 'Base de Données',
    level: 'Master',
    branch: 'Génie Logiciel',
    ipes: 'Université de Douala',
  },
  {
    id: 'ues15',
    ue_name: 'Intelligence Artificielle',
    slug: 'intelligence-artificielle',
    nbr_hours: 65,
    description: 'Concepts d’intelligence artificielle appliquée.',
    user_creator: 'Sandrine Mbarga',
    module: 'IA',
    level: 'Master',
    branch: 'Génie Logiciel',
    ipes: 'Université de Douala',
  },

  // Université de Yaoundé 1
  {
    id: 'ues16',
    ue_name: 'Mathématiques Discrètes',
    slug: 'mathematiques-discretes',
    nbr_hours: 50,
    description: 'Théories des ensembles, graphes et combinaisons.',
    user_creator: 'Jean-Paul Ngassa',
    module: 'Mathématiques',
    level: 'Licence',
    branch: 'Informatique Fondamentale',
    ipes: 'Université de Yaoundé 1',
  },
  {
    id: 'ues17',
    ue_name: 'Optimisation et Recherche Opérationnelle',
    slug: 'optimisation-recherche-operationnelle',
    nbr_hours: 60,
    description: 'Méthodes d’optimisation et recherche opérationnelle.',
    user_creator: 'Jean-Paul Ngassa',
    module: 'Mathématiques Appliquées',
    level: 'Master',
    branch: 'Informatique Fondamentale',
    ipes: 'Université de Yaoundé 1',
  },
  {
    id: 'ues18',
    ue_name: 'Théorie des Automates',
    slug: 'theorie-automates',
    nbr_hours: 45,
    description: 'Étude des automates et langages formels.',
    user_creator: 'Jean-Paul Ngassa',
    module: 'Informatique Théorique',
    level: 'Licence',
    branch: 'Informatique Fondamentale',
    ipes: 'Université de Yaoundé 1',
  },
  {
    id: 'ues19',
    ue_name: 'Calculabilité et Complexité',
    slug: 'calculabilite-complexite',
    nbr_hours: 55,
    description:
      'Analyse de la calculabilité et de la complexité algorithmique.',
    user_creator: 'Jean-Paul Ngassa',
    module: 'Informatique Théorique',
    level: 'Master',
    branch: 'Informatique Fondamentale',
    ipes: 'Université de Yaoundé 1',
  },
  {
    id: 'ues20',
    ue_name: 'Systèmes Embarqués',
    slug: 'systemes-embarques',
    nbr_hours: 50,
    description: 'Conception et développement de systèmes embarqués.',
    user_creator: 'Jean-Paul Ngassa',
    module: 'Systèmes',
    level: 'Licence',
    branch: 'Informatique Industrielle',
    ipes: 'Université de Yaoundé 1',
  },

  // Université de Ngaoundéré
  {
    id: 'ues21',
    ue_name: 'Analyse Numérique',
    slug: 'analyse-numerique',
    nbr_hours: 60,
    description:
      'Méthodes d’analyse numérique pour résoudre des équations différentielles.',
    user_creator: 'Fabrice Kameni',
    module: 'Mathématiques',
    level: 'Master',
    branch: 'Mathématiques Appliquées',
    ipes: 'Université de Ngaoundéré',
  },
  {
    id: 'ues22',
    ue_name: 'Robotique',
    slug: 'robotique',
    nbr_hours: 45,
    description:
      'Introduction aux concepts de la robotique et de la mécatronique.',
    user_creator: 'Fabrice Kameni',
    module: 'Mécatronique',
    level: 'Licence',
    branch: 'Informatique Industrielle',
    ipes: 'Université de Ngaoundéré',
  },
  {
    id: 'ues23',
    ue_name: 'Vision par Ordinateur',
    slug: 'vision-par-ordinateur',
    nbr_hours: 50,
    description: 'Techniques de reconnaissance et de traitement d’images.',
    user_creator: 'Fabrice Kameni',
    module: 'IA',
    level: 'Master',
    branch: 'Informatique',
    ipes: 'Université de Ngaoundéré',
  },
  {
    id: 'ues24',
    ue_name: 'Optimisation Combinatoire',
    slug: 'optimisation-combinatoire',
    nbr_hours: 55,
    description:
      'Problèmes d’optimisation dans des graphes et réseaux complexes.',
    user_creator: 'Fabrice Kameni',
    module: 'Mathématiques Appliquées',
    level: 'Master',
    branch: 'Informatique',
    ipes: 'Université de Ngaoundéré',
  },
  {
    id: 'ues25',
    ue_name: 'Traitement du Signal',
    slug: 'traitement-signal',
    nbr_hours: 60,
    description: 'Analyse des signaux pour les systèmes de communication.',
    user_creator: 'Fabrice Kameni',
    module: 'Systèmes de Communication',
    level: 'Licence',
    branch: 'Informatique Industrielle',
    ipes: 'Université de Ngaoundéré',
  },

  // Université de Buea
  {
    id: 'ues26',
    ue_name: 'Systèmes d’Information Géographique (SIG)',
    slug: 'sig',
    nbr_hours: 55,
    description: 'Introduction aux systèmes d’information géographique.',
    user_creator: 'Helen Mbuh',
    module: 'Géomatique',
    level: 'Licence',
    branch: 'Géoinformatique',
    ipes: 'Université de Buea',
  },
  {
    id: 'ues27',
    ue_name: 'Modélisation et Simulation',
    slug: 'modelisation-simulation',
    nbr_hours: 60,
    description:
      'Techniques de modélisation et simulation de systèmes complexes.',
    user_creator: 'Helen Mbuh',
    module: 'Mathématiques Appliquées',
    level: 'Master',
    branch: 'Informatique',
    ipes: 'Université de Buea',
  },
  {
    id: 'ues28',
    ue_name: 'Ingénierie des Logiciels',
    slug: 'ingenierie-logiciels',
    nbr_hours: 50,
    description:
      'Méthodologies et outils pour la gestion de projets logiciels.',
    user_creator: 'Helen Mbuh',
    module: 'Développement',
    level: 'Licence',
    branch: 'Génie Logiciel',
    ipes: 'Université de Buea',
  },
  {
    id: 'ues29',
    ue_name: 'Data Mining',
    slug: 'data-mining',
    nbr_hours: 55,
    description: 'Exploration des données à grande échelle.',
    user_creator: 'Helen Mbuh',
    module: 'Data Science',
    level: 'Master',
    branch: 'Génie Logiciel',
    ipes: 'Université de Buea',
  },
  {
    id: 'ues30',
    ue_name: 'Analyse de Big Data',
    slug: 'analyse-big-data',
    nbr_hours: 65,
    description:
      'Techniques et outils pour l’analyse des grandes masses de données.',
    user_creator: 'Helen Mbuh',
    module: 'Data Science',
    level: 'Master',
    branch: 'Informatique',
    ipes: 'Université de Buea',
  },
];

export const structuredData = [
  {
    ipes: "Institut Africain d'Informatique (IAI-Cameroun)",
    branches: [
      {
        branch: 'Génie Logiciel',
        levels: [
          {
            level: 'Licence',
            modules: ['Informatique Théorique', 'Développement Web'],
          },
          {
            level: 'Master',
            modules: ['Informatique Théorique', 'Systèmes'],
          },
        ],
      },
      {
        branch: 'Réseaux et Télécommunications',
        levels: [
          {
            level: 'Licence',
            modules: ['Sécurité Réseaux'],
          },
          {
            level: 'Master',
            modules: ['Sécurité'],
          },
        ],
      },
    ],
  },
  {
    ipes: 'École Nationale Supérieure Polytechnique de Yaoundé',
    branches: [
      {
        branch: 'Informatique Industrielle',
        levels: [
          {
            level: 'Licence',
            modules: ['Réseaux', 'Développement Mobile'],
          },
          {
            level: 'Master',
            modules: ['IA', 'Base de Données'],
          },
        ],
      },
      {
        branch: 'Cybersécurité',
        levels: [
          {
            level: 'Master',
            modules: ['Sécurité'],
          },
          {
            level: 'Licence',
            modules: ['Développement Mobile'],
          },
        ],
      },
    ],
  },
  {
    ipes: 'Université de Douala',
    branches: [
      {
        branch: 'Génie Logiciel',
        levels: [
          {
            level: 'Licence',
            modules: ['Développement', 'Base de Données'],
          },
          {
            level: 'Master',
            modules: ['IA', 'Base de Données'],
          },
        ],
      },
      {
        branch: 'Sécurité des Systèmes d’Information',
        levels: [
          {
            level: 'Licence',
            modules: ['Réseaux'],
          },
          {
            level: 'Master',
            modules: ['Sécurité'],
          },
        ],
      },
    ],
  },
  {
    ipes: 'Université de Yaoundé 1',
    branches: [
      {
        branch: 'Informatique Fondamentale',
        levels: [
          {
            level: 'Licence',
            modules: ['Mathématiques', 'Informatique Théorique'],
          },
          {
            level: 'Master',
            modules: ['Mathématiques Appliquées', 'Informatique Théorique'],
          },
        ],
      },
      {
        branch: 'Informatique Industrielle',
        levels: [
          {
            level: 'Licence',
            modules: ['Systèmes'],
          },
        ],
      },
    ],
  },
  {
    ipes: 'Université de Ngaoundéré',
    branches: [
      {
        branch: 'Mathématiques Appliquées',
        levels: [
          {
            level: 'Master',
            modules: ['Mathématiques', 'Mathématiques Appliquées'],
          },
        ],
      },
      {
        branch: 'Informatique',
        levels: [
          {
            level: 'Master',
            modules: ['IA', 'Mathématiques Appliquées'],
          },
        ],
      },
      {
        branch: 'Informatique Industrielle',
        levels: [
          {
            level: 'Licence',
            modules: ['Mécatronique', 'Systèmes de Communication'],
          },
        ],
      },
    ],
  },
  {
    ipes: 'Université de Buea',
    branches: [
      {
        branch: 'Géoinformatique',
        levels: [
          {
            level: 'Licence',
            modules: ['Géomatique'],
          },
        ],
      },
      {
        branch: 'Informatique',
        levels: [
          {
            level: 'Master',
            modules: ['Mathématiques Appliquées', 'Data Science'],
          },
        ],
      },
      {
        branch: 'Génie Logiciel',
        levels: [
          {
            level: 'Licence',
            modules: ['Développement'],
          },
          {
            level: 'Master',
            modules: ['Data Science'],
          },
        ],
      },
    ],
  },
];
