export type Ues = {
  id: string;
  ue_name: string;
  slug: string;
  nbr_hours: number;
  description: string;
  user_creator: string;
  module: string;
};

export const fakeData: Ues[] = [
  {
    id: '1',
    ue_name: 'Introduction à la littérature camerounaise',
    slug: 'intro-litt-camerounaise',
    nbr_hours: 30,
    description:
      'Exploration des œuvres littéraires clés du Cameroun, de la période coloniale à nos jours.',
    user_creator: 'Prof. Jean-Marie Essomba',
    module: 'Littérature et Communication',
  },
  {
    id: '2',
    ue_name: "Histoire de l'Afrique centrale",
    slug: 'histoire-afrique-centrale',
    nbr_hours: 45,
    description:
      "Étude approfondie de l'histoire de l'Afrique centrale, de la préhistoire à l'époque contemporaine.",
    user_creator: 'Dr. Marie-Thérèse Atangana',
    module: 'Histoire et Géographie',
  },
  {
    id: '3',
    ue_name: "Mathématiques pour l'ingénierie",
    slug: 'maths-ingenierie',
    nbr_hours: 60,
    description:
      "Cours de mathématiques appliquées à l'ingénierie, couvrant l'algèbre linéaire, le calcul différentiel et intégral, et les équations différentielles.",
    user_creator: 'Dr. Pierre-Alain Nguema',
    module: 'Mathématiques et Statistiques',
  },
  {
    id: '4',
    ue_name: 'Biologie cellulaire et moléculaire',
    slug: 'biologie-cell-mol',
    nbr_hours: 40,
    description:
      'Étude de la structure et des fonctions des cellules et des molécules qui les composent.',
    user_creator: 'Prof. Brigitte Owona',
    module: 'Sciences de la Vie',
  },
  {
    id: '5',
    ue_name: 'Droit constitutionnel camerounais',
    slug: 'droit-const-camerounais',
    nbr_hours: 35,
    description:
      'Analyse détaillée de la Constitution camerounaise et de son application pratique.',
    user_creator: 'Maître Amadou Mbarga',
    module: 'Droit et Sciences Politiques',
  },
  {
    id: '6',
    ue_name: 'Géographie du Cameroun',
    slug: 'geographie-cameroun',
    nbr_hours: 25,
    description:
      'Exploration des différentes régions du Cameroun, de leur climat, de leur relief, de leur population et de leurs ressources naturelles.',
    user_creator: 'Dr. Ibrahim Foning',
    module: 'Histoire et Géographie',
  },
  {
    id: '7',
    ue_name: 'Philosophie africaine',
    slug: 'philosophie-africaine',
    nbr_hours: 30,
    description:
      "Introduction aux grandes pensées philosophiques africaines, de l'Égypte ancienne à nos jours.",
    user_creator: 'Prof. Jacqueline Meyo',
    module: 'Philosophie et Sciences Sociales',
  },
  {
    id: '8',
    ue_name: 'Sociologie des organisations',
    slug: 'sociologie-organisations',
    nbr_hours: 40,
    description:
      'Étude des structures et des dynamiques sociales au sein des organisations.',
    user_creator: 'Dr. Charles Etoga',
    module: 'Philosophie et Sciences Sociales',
  },
  {
    id: '9',
    ue_name: 'Langues et cultures du Cameroun',
    slug: 'langues-cultures-cameroun',
    nbr_hours: 35,
    description:
      'Aperçu de la diversité linguistique et culturelle du Cameroun.',
    user_creator: 'Prof. Danielle Eboa',
    module: 'Littérature et Communication',
  },
  {
    id: '10',
    ue_name: 'Économie du développement',
    slug: 'economie-developpement',
    nbr_hours: 45,
    description:
      "Analyse des théories et des politiques de développement économique, avec un accent particulier sur l'Afrique.",
    user_creator: 'Dr. Eric Olinga',
    module: 'Économie et Gestion',
  },
  {
    id: '11',
    ue_name: "Sciences de l'environnement",
    slug: 'sciences-environnement',
    nbr_hours: 30,
    description:
      "Étude des interactions entre l'homme et son environnement, et des enjeux liés à la protection de la nature.",
    user_creator: 'Prof. Françoise Eyenga',
    module: 'Sciences de la Vie',
  },
  {
    id: '12',
    ue_name: 'Informatique fondamentale',
    slug: 'informatique-fondamentale',
    nbr_hours: 50,
    description:
      "Introduction aux concepts de base de l'informatique, de la programmation aux réseaux.",
    user_creator: 'Dr. Georges Tchouta',
    module: 'Informatique et Technologies',
  },
  {
    id: '13',
    ue_name: 'Psychologie sociale',
    slug: 'psychologie-sociale',
    nbr_hours: 35,
    description: 'Étude des comportements et des interactions sociales.',
    user_creator: 'Prof. Henriette Nanga',
    module: 'Philosophie et Sciences Sociales',
  },
  {
    id: '14',
    ue_name: 'Statistiques appliquées',
    slug: 'statistiques-appliquees',
    nbr_hours: 40,
    description:
      "Cours de statistiques appliquées aux sciences sociales et à l'économie.",
    user_creator: 'Dr. Karim Djoumessi',
    module: 'Mathématiques et Statistiques',
  },
  {
    id: '15',
    ue_name: 'Anthropologie culturelle',
    slug: 'anthropologie-culturelle',
    nbr_hours: 30,
    description:
      "Étude des cultures humaines à travers le monde, avec un focus sur l'Afrique.",
    user_creator: 'Prof. Lucie Yomba',
    module: 'Philosophie et Sciences Sociales',
  },
  {
    id: '16',
    ue_name: 'Relations internationales',
    slug: 'relations-internationales',
    nbr_hours: 45,
    description:
      'Analyse des relations entre les États et les organisations internationales.',
    user_creator: 'Dr. Marcel Abanda',
    module: 'Droit et Sciences Politiques',
  },
  {
    id: '17',
    ue_name: 'Littérature française',
    slug: 'litterature-francaise',
    nbr_hours: 35,
    description:
      'Exploration des grands courants de la littérature française, du Moyen Âge à nos jours.',
    user_creator: 'Prof. Nadine Mengue',
    module: 'Littérature et Communication',
  },
  {
    id: '18',
    ue_name: 'Chimie organique',
    slug: 'chimie-organique',
    nbr_hours: 50,
    description: 'Étude des composés du carbone et de leurs réactions.',
    user_creator: 'Dr. Olivier Nguema',
    module: 'Sciences de la Vie',
  },
  {
    id: '19',
    ue_name: 'Physique générale',
    slug: 'physique-generale',
    nbr_hours: 60,
    description:
      "Cours de physique fondamentale, couvrant la mécanique, l'électromagnétisme, la thermodynamique et l'optique.",
    user_creator: 'Prof. Paulette Obama',
    module: 'Sciences et Techniques Physiques',
  },
  {
    id: '20',
    ue_name: "Histoire de l'art africain",
    slug: 'histoire-art-africain',
    nbr_hours: 25,
    description:
      "Découverte des principales formes d'art africain, de la sculpture à la peinture en passant par l'architecture.",
    user_creator: 'Dr. Quentin Mbida',
    module: 'Arts et Histoire',
  },
  {
    id: '21',
    ue_name: 'Communication et médias',
    slug: 'communication-medias',
    nbr_hours: 30,
    description: 'Analyse des médias et de leur rôle dans la société.',
    user_creator: 'Prof. Raissa Njoya',
    module: 'Littérature et Communication',
  },
  {
    id: '22',
    ue_name: 'Santé publique',
    slug: 'sante-publique',
    nbr_hours: 40,
    description:
      'Étude des enjeux de santé publique au Cameroun et dans le monde.',
    user_creator: 'Dr. Serge Zogo',
    module: 'Sciences de la Santé',
  },
];
