// import { Syllabus } from '@/types/real-types';
//
// export const datas: Syllabus[] = [
//   {
//     id: 'e9b1c467-705e-4b26-9264-ff4b4ae21c6d',
//     name: 'Informatique Générale',
//     modules: [
//       {
//         id: 'e3ff0457-9c2b-4dc9-bd19-e2fb431ac1f7',
//         name: 'Programmation de base',
//         ues: [
//           {
//             id: '874f90ed-1091-4a2d-b930-5d3cbcf53fd8',
//             ue: {
//               id: '874f90ed-1091-4a2d-b930-5d3cbcf53fd8',
//               ue_name: 'Introduction à la programmation',
//               slug: 'intro-programmation',
//               description:
//                 'Introduction aux concepts de base de la programmation en C et Python.',
//               user_creator: 'Prof. Martin',
//               createdAt: '2024-09-19T00:00:00.000Z',
//               updatedAt: '2024-09-19T00:00:00.000Z',
//             },
//             nbr_hours: 45,
//             nbr_credits: 4,
//             tailored_description:
//               "Cours d'introduction à la programmation pour débutants.",
//             teacher: 'Prof. Jean-Claude Mbarga',
//           },
//           {
//             id: 'b1cf3b74-30d2-4636-8b8a-c2e38ed3aabf',
//             ue: {
//               id: 'b1cf3b74-30d2-4636-8b8a-c2e38ed3aabf',
//               ue_name: 'Structures de données',
//               slug: 'structures-donnees',
//               description:
//                 'Étude des structures de données fondamentales comme les listes, piles, et files.',
//               user_creator: 'Prof. Martin',
//               createdAt: '2024-09-19T00:00:00.000Z',
//               updatedAt: '2024-09-19T00:00:00.000Z',
//             },
//             nbr_hours: 40,
//             nbr_credits: 3,
//             tailored_description: 'Introduction aux structures de données.',
//             teacher: 'Prof. Marie Tchoumi',
//           },
//         ],
//         createdAt: '2024-09-19T00:00:00.000Z',
//         updatedAt: '2024-09-19T00:00:00.000Z',
//       },
//       {
//         id: 'd384be62-5e12-4a2d-b317-96e1607d57d2',
//         name: 'Algorithmes',
//         ues: [
//           {
//             id: '0136d5c4-347b-4f68-9a78-660cf17b5b50',
//             ue: {
//               id: '0136d5c4-347b-4f68-9a78-660cf17b5b50',
//               ue_name: 'Introduction aux algorithmes',
//               slug: 'introduction-algorithmes',
//               description:
//                 'Concepts fondamentaux des algorithmes et leur complexité.',
//               user_creator: 'Prof. Martin',
//               createdAt: '2024-09-19T00:00:00.000Z',
//               updatedAt: '2024-09-19T00:00:00.000Z',
//             },
//             nbr_hours: 50,
//             nbr_credits: 4,
//             tailored_description: 'Première approche des algorithmes.',
//             teacher: 'Prof. Serge Ngatchou',
//           },
//           {
//             id: '71617cf3-18e5-4e71-8f72-4b67bc8b9c12',
//             ue: {
//               id: '71617cf3-18e5-4e71-8f72-4b67bc8b9c12',
//               ue_name: 'Optimisation des algorithmes',
//               slug: 'optimisation-algorithmes',
//               description: "Techniques d'optimisation d'algorithmes complexes.",
//               user_creator: 'Prof. Martin',
//               createdAt: '2024-09-19T00:00:00.000Z',
//               updatedAt: '2024-09-19T00:00:00.000Z',
//             },
//             nbr_hours: 45,
//             nbr_credits: 3,
//             tailored_description:
//               'Techniques avancées pour optimiser les algorithmes.',
//             teacher: 'Prof. Serge Ngatchou',
//           },
//         ],
//         createdAt: '2024-09-19T00:00:00.000Z',
//         updatedAt: '2024-09-19T00:00:00.000Z',
//       },
//       {
//         id: 'c5456b68-4bb6-498a-8f3e-7a2abf0dece6',
//         name: "Systèmes d'exploitation",
//         ues: [
//           {
//             id: '837c59c4-367a-4658-ae0c-58dd2c4cfaad',
//             ue: {
//               id: '837c59c4-367a-4658-ae0c-58dd2c4cfaad',
//               ue_name: "Concepts des systèmes d'exploitation",
//               slug: 'concepts-systemes-exploitation',
//               description:
//                 "Exploration des composants des systèmes d'exploitation.",
//               user_creator: 'Prof. Martin',
//               createdAt: '2024-09-19T00:00:00.000Z',
//               updatedAt: '2024-09-19T00:00:00.000Z',
//             },
//             nbr_hours: 40,
//             nbr_credits: 3,
//             tailored_description: 'Premiers concepts des OS.',
//             teacher: 'Prof. Jean Evina',
//           },
//           {
//             id: 'bc03d926-b4a1-4c74-bbf5-5bfe58c6dd3e',
//             ue: {
//               id: 'bc03d926-b4a1-4c74-bbf5-5bfe58c6dd3e',
//               ue_name: 'Sécurité des systèmes',
//               slug: 'securite-systemes',
//               description:
//                 "Concepts de sécurité dans les systèmes d'exploitation.",
//               user_creator: 'Prof. Martin',
//               createdAt: '2024-09-19T00:00:00.000Z',
//               updatedAt: '2024-09-19T00:00:00.000Z',
//             },
//             nbr_hours: 35,
//             nbr_credits: 3,
//             tailored_description: 'Techniques de sécurisation des OS.',
//             teacher: 'Prof. Jean Evina',
//           },
//         ],
//         createdAt: '2024-09-19T00:00:00.000Z',
//         updatedAt: '2024-09-19T00:00:00.000Z',
//       },
//       {
//         id: '26d7f631-299d-4628-8ec5-76904db63739',
//         name: 'Bases de données',
//         ues: [
//           {
//             id: '637e9447-57d7-469b-93eb-7cfc9f48b802',
//             ue: {
//               id: '637e9447-57d7-469b-93eb-7cfc9f48b802',
//               ue_name: 'Modélisation des bases de données',
//               slug: 'modelisation-bdd',
//               description:
//                 'Introduction aux modèles relationnels et non relationnels.',
//               user_creator: 'Prof. Martin',
//               createdAt: '2024-09-19T00:00:00.000Z',
//               updatedAt: '2024-09-19T00:00:00.000Z',
//             },
//             nbr_hours: 40,
//             nbr_credits: 4,
//             tailored_description:
//               'Modélisation des systèmes de gestion de bases de données.',
//             teacher: 'Prof. Laurent Ngono',
//           },
//           {
//             id: '5870a21a-55f7-40a5-9c2c-c8e097c67f7f',
//             ue: {
//               id: '5870a21a-55f7-40a5-9c2c-c8e097c67f7f',
//               ue_name: 'Administration des bases de données',
//               slug: 'administration-bdd',
//               description:
//                 "Techniques d'administration des systèmes de gestion de bases de données.",
//               user_creator: 'Prof. Martin',
//               createdAt: '2024-09-19T00:00:00.000Z',
//               updatedAt: '2024-09-19T00:00:00.000Z',
//             },
//             nbr_hours: 50,
//             nbr_credits: 4,
//             tailored_description:
//               "Cours sur l'administration avancée des bases de données.",
//             teacher: 'Prof. Laurent Ngono',
//           },
//         ],
//         createdAt: '2024-09-19T00:00:00.000Z',
//         updatedAt: '2024-09-19T00:00:00.000Z',
//       },
//       {
//         id: '1da27aa1-cc4a-44a4-95e0-7345be0efcc9',
//         name: 'Réseaux informatiques',
//         ues: [
//           {
//             id: '33f2a251-1b9f-4f69-9bfc-8287dabbfb93',
//             ue: {
//               id: '33f2a251-1b9f-4f69-9bfc-8287dabbfb93',
//               ue_name: 'Introduction aux réseaux',
//               slug: 'introduction-reseaux',
//               description: 'Fondamentaux des réseaux informatiques.',
//               user_creator: 'Prof. Martin',
//               createdAt: '2024-09-19T00:00:00.000Z',
//               updatedAt: '2024-09-19T00:00:00.000Z',
//             },
//             nbr_hours: 35,
//             nbr_credits: 3,
//             tailored_description:
//               "Introduction à la topologie et à l'architecture des réseaux.",
//             teacher: 'Prof. Simon Njoya',
//           },
//           {
//             id: 'b2f74f29-b002-4e4a-89f2-5f51890e0d0f',
//             ue: {
//               id: 'b2f74f29-b002-4e4a-89f2-5f51890e0d0f',
//               ue_name: 'Protocoles réseaux',
//               slug: 'protocoles-reseaux',
//               description:
//                 'Étude des protocoles de communication dans les réseaux.',
//               user_creator: 'Prof. Martin',
//               createdAt: '2024-09-19T00:00:00.000Z',
//               updatedAt: '2024-09-19T00:00:00.000Z',
//             },
//             nbr_hours: 45,
//             nbr_credits: 3,
//             tailored_description:
//               'Apprentissage des protocoles comme TCP/IP et UDP.',
//             teacher: 'Prof. Simon Njoya',
//           },
//         ],
//         createdAt: '2024-09-19T00:00:00.000Z',
//         updatedAt: '2024-09-19T00:00:00.000Z',
//       },
//     ],
//     createdAt: '2024-09-19T00:00:00.000Z',
//     updatedAt: '2024-09-19T00:00:00.000Z',
//   },
//   {
//     id: 'b2e177a7-52e8-4e7b-985b-2ff3b7d4a36a',
//     name: 'Développement Web et Mobile',
//     modules: [
//       {
//         id: 'e6d4322b-25a1-4a71-a8c7-1c2910f6897c',
//         name: 'Développement Front-End',
//         ues: [
//           {
//             id: 'bb7bcf12-fb0d-4c95-b7e7-64391b93a1d6',
//             ue: {
//               id: 'bb7bcf12-fb0d-4c95-b7e7-64391b93a1d6',
//               ue_name: 'HTML/CSS',
//               slug: 'html-css',
//               description:
//                 'Maîtrise des bases du développement web avec HTML5 et CSS3.',
//               user_creator: 'Prof. Bernard Fouda',
//               createdAt: '2024-09-19T00:00:00.000Z',
//               updatedAt: '2024-09-19T00:00:00.000Z',
//             },
//             nbr_hours: 40,
//             nbr_credits: 4,
//             tailored_description:
//               "Développement d'interfaces utilisateur avec HTML et CSS.",
//             teacher: 'Prof. Bernard Fouda',
//           },
//           {
//             id: '12e34b3f-b9c2-429d-baf2-c3f2a50eeb3c',
//             ue: {
//               id: '12e34b3f-b9c2-429d-baf2-c3f2a50eeb3c',
//               ue_name: 'JavaScript',
//               slug: 'javascript',
//               description:
//                 "Langage de programmation essentiel pour l'interactivité sur le web.",
//               user_creator: 'Prof. Bernard Fouda',
//               createdAt: '2024-09-19T00:00:00.000Z',
//               updatedAt: '2024-09-19T00:00:00.000Z',
//             },
//             nbr_hours: 50,
//             nbr_credits: 4,
//             tailored_description:
//               'Apprentissage de JavaScript pour le développement web dynamique.',
//             teacher: 'Prof. Michel Ngando',
//           },
//         ],
//         createdAt: '2024-09-19T00:00:00.000Z',
//         updatedAt: '2024-09-19T00:00:00.000Z',
//       },
//       {
//         id: 'cdeed17e-c01e-41f0-b5a5-6097df5b8975',
//         name: 'Développement Back-End',
//         ues: [
//           {
//             id: 'ec1f3211-0023-463e-9f96-38907ae06c33',
//             ue: {
//               id: 'ec1f3211-0023-463e-9f96-38907ae06c33',
//               ue_name: 'PHP/MySQL',
//               slug: 'php-mysql',
//               description:
//                 'Développement de serveurs web avec PHP et gestion de bases de données avec MySQL.',
//               user_creator: 'Prof. Bernard Fouda',
//               createdAt: '2024-09-19T00:00:00.000Z',
//               updatedAt: '2024-09-19T00:00:00.000Z',
//             },
//             nbr_hours: 45,
//             nbr_credits: 4,
//             tailored_description:
//               "Création d'applications web dynamiques avec PHP et MySQL.",
//             teacher: 'Prof. Michel Ngando',
//           },
//           {
//             id: 'f4f5b907-6c33-4c70-98a5-04b7deee45f7',
//             ue: {
//               id: 'f4f5b907-6c33-4c70-98a5-04b7deee45f7',
//               ue_name: 'Node.js',
//               slug: 'nodejs',
//               description:
//                 'Utilisation de Node.js pour le développement de serveurs asynchrones.',
//               user_creator: 'Prof. Bernard Fouda',
//               createdAt: '2024-09-19T00:00:00.000Z',
//               updatedAt: '2024-09-19T00:00:00.000Z',
//             },
//             nbr_hours: 50,
//             nbr_credits: 4,
//             tailored_description: 'Développement côté serveur avec Node.js.',
//             teacher: 'Prof. Michel Ngando',
//           },
//         ],
//         createdAt: '2024-09-19T00:00:00.000Z',
//         updatedAt: '2024-09-19T00:00:00.000Z',
//       },
//       {
//         id: '9e81f1fa-946f-4e1b-9919-511ff60e7137',
//         name: 'Développement Mobile',
//         ues: [
//           {
//             id: '6f1c9f02-fdb0-4ae3-95b4-d6f83f36cfd8',
//             ue: {
//               id: '6f1c9f02-fdb0-4ae3-95b4-d6f83f36cfd8',
//               ue_name: 'Développement Android',
//               slug: 'developpement-android',
//               description:
//                 "Création d'applications mobiles pour Android en utilisant Java et Kotlin.",
//               user_creator: 'Prof. Bernard Fouda',
//               createdAt: '2024-09-19T00:00:00.000Z',
//               updatedAt: '2024-09-19T00:00:00.000Z',
//             },
//             nbr_hours: 60,
//             nbr_credits: 5,
//             tailored_description: "Développement d'applications Android.",
//             teacher: 'Prof. Benoit Akom',
//           },
//           {
//             id: '1d9a347f-23bb-4cde-b9f0-35d4f63c33f5',
//             ue: {
//               id: '1d9a347f-23bb-4cde-b9f0-35d4f63c33f5',
//               ue_name: 'Développement iOS',
//               slug: 'developpement-ios',
//               description:
//                 "Développement d'applications mobiles pour iOS en utilisant Swift.",
//               user_creator: 'Prof. Bernard Fouda',
//               createdAt: '2024-09-19T00:00:00.000Z',
//               updatedAt: '2024-09-19T00:00:00.000Z',
//             },
//             nbr_hours: 55,
//             nbr_credits: 5,
//             tailored_description: "Création d'applications mobiles pour iOS.",
//             teacher: 'Prof. Benoit Akom',
//           },
//         ],
//         createdAt: '2024-09-19T00:00:00.000Z',
//         updatedAt: '2024-09-19T00:00:00.000Z',
//       },
//       {
//         id: 'b44d3b0a-6120-44a3-83d4-8d7a5e1eb4a2',
//         name: 'UX/UI Design',
//         ues: [
//           {
//             id: '31b3f96f-5d63-4c6f-93fb-2387eaa1f33b',
//             ue: {
//               id: '31b3f96f-5d63-4c6f-93fb-2387eaa1f33b',
//               ue_name: 'Conception UX',
//               slug: 'conception-ux',
//               description:
//                 "Introduction aux principes de conception d'expérience utilisateur.",
//               user_creator: 'Prof. Bernard Fouda',
//               createdAt: '2024-09-19T00:00:00.000Z',
//               updatedAt: '2024-09-19T00:00:00.000Z',
//             },
//             nbr_hours: 40,
//             nbr_credits: 4,
//             tailored_description:
//               "Bases de l'expérience utilisateur dans la conception d'applications.",
//             teacher: 'Prof. Amélie Tchaptchet',
//           },
//           {
//             id: 'f2d4ecf7-6dd6-4c50-bd08-5bbf7758ff0b',
//             ue: {
//               id: 'f2d4ecf7-6dd6-4c50-bd08-5bbf7758ff0b',
//               ue_name: 'Conception UI',
//               slug: 'conception-ui',
//               description:
//                 "Apprentissage des concepts visuels pour la création d'interfaces.",
//               user_creator: 'Prof. Bernard Fouda',
//               createdAt: '2024-09-19T00:00:00.000Z',
//               updatedAt: '2024-09-19T00:00:00.000Z',
//             },
//             nbr_hours: 45,
//             nbr_credits: 4,
//             tailored_description:
//               "Création d'interfaces utilisateurs adaptées aux besoins.",
//             teacher: 'Prof. Amélie Tchaptchet',
//           },
//         ],
//         createdAt: '2024-09-19T00:00:00.000Z',
//         updatedAt: '2024-09-19T00:00:00.000Z',
//       },
//     ],
//     createdAt: '2024-09-19T00:00:00.000Z',
//     updatedAt: '2024-09-19T00:00:00.000Z',
//   },
//   {
//     id: 'ee0c62d7-2ab1-4a9f-8c51-2546273f3452',
//     name: 'Intelligence Artificielle',
//     modules: [
//       {
//         id: 'ffdb35b4-1b73-4d56-9215-1944344f23e5',
//         name: "Introduction à l'IA",
//         ues: [
//           {
//             id: 'd96f74a2-bd8d-4b9e-a0a5-c939bd305218',
//             ue: {
//               id: 'd96f74a2-bd8d-4b9e-a0a5-c939bd305218',
//               ue_name: "Fondamentaux de l'IA",
//               slug: 'fondamentaux-ia',
//               description:
//                 "Concepts de base et applications de l'intelligence artificielle.",
//               user_creator: 'Prof. Agathe Ndjock',
//               createdAt: '2024-09-19T00:00:00.000Z',
//               updatedAt: '2024-09-19T00:00:00.000Z',
//             },
//             nbr_hours: 40,
//             nbr_credits: 4,
//             tailored_description:
//               "Introduction à l'IA, ses algorithmes et ses cas d'utilisation.",
//             teacher: 'Prof. Agathe Ndjock',
//           },
//           {
//             id: 'f658d4d5-4d22-44ff-b403-c526a930f289',
//             ue: {
//               id: 'f658d4d5-4d22-44ff-b403-c526a930f289',
//               ue_name: 'Apprentissage Machine',
//               slug: 'apprentissage-machine',
//               description: 'Introduction aux algorithmes de machine learning.',
//               user_creator: 'Prof. Agathe Ndjock',
//               createdAt: '2024-09-19T00:00:00.000Z',
//               updatedAt: '2024-09-19T00:00:00.000Z',
//             },
//             nbr_hours: 50,
//             nbr_credits: 5,
//             tailored_description:
//               'Étude des principaux algorithmes de machine learning supervisé et non-supervisé.',
//             teacher: 'Prof. Michel Manga',
//           },
//         ],
//         createdAt: '2024-09-19T00:00:00.000Z',
//         updatedAt: '2024-09-19T00:00:00.000Z',
//       },
//       {
//         id: 'b993d835-fb7b-46fb-81cb-37efab73fa19',
//         name: 'Deep Learning',
//         ues: [
//           {
//             id: 'aa607afa-123e-41b6-b14d-9e9471692ef3',
//             ue: {
//               id: 'aa607afa-123e-41b6-b14d-9e9471692ef3',
//               ue_name: 'Réseaux de Neurones',
//               slug: 'reseaux-neurones',
//               description:
//                 'Introduction aux réseaux de neurones artificiels et au deep learning.',
//               user_creator: 'Prof. Agathe Ndjock',
//               createdAt: '2024-09-19T00:00:00.000Z',
//               updatedAt: '2024-09-19T00:00:00.000Z',
//             },
//             nbr_hours: 60,
//             nbr_credits: 5,
//             tailored_description:
//               'Apprentissage des modèles de réseaux neuronaux profonds et de leur implémentation.',
//             teacher: 'Prof. Michel Manga',
//           },
//           {
//             id: 'b7d830af-7b9d-4200-97d5-7592c8d1dca5',
//             ue: {
//               id: 'b7d830af-7b9d-4200-97d5-7592c8d1dca5',
//               ue_name: 'Convolutional Neural Networks (CNN)',
//               slug: 'cnn',
//               description:
//                 "Étude des réseaux neuronaux convolutifs pour l'analyse d'images.",
//               user_creator: 'Prof. Agathe Ndjock',
//               createdAt: '2024-09-19T00:00:00.000Z',
//               updatedAt: '2024-09-19T00:00:00.000Z',
//             },
//             nbr_hours: 45,
//             nbr_credits: 4,
//             tailored_description:
//               'Apprentissage des techniques CNN appliquées à la vision par ordinateur.',
//             teacher: 'Prof. Michel Manga',
//           },
//         ],
//         createdAt: '2024-09-19T00:00:00.000Z',
//         updatedAt: '2024-09-19T00:00:00.000Z',
//       },
//       {
//         id: '71a05b8d-594a-4047-8ae2-3067bcad63e5',
//         name: 'Traitement du Langage Naturel',
//         ues: [
//           {
//             id: '73119b5f-4f2e-418b-819e-1b29b54c2513',
//             ue: {
//               id: '73119b5f-4f2e-418b-819e-1b29b54c2513',
//               ue_name: 'NLP : Fondamentaux',
//               slug: 'nlp-fondamentaux',
//               description:
//                 'Introduction au traitement automatique des langues et à ses applications.',
//               user_creator: 'Prof. Agathe Ndjock',
//               createdAt: '2024-09-19T00:00:00.000Z',
//               updatedAt: '2024-09-19T00:00:00.000Z',
//             },
//             nbr_hours: 40,
//             nbr_credits: 4,
//             tailored_description:
//               'Traitement des données textuelles, analyse et génération automatique.',
//             teacher: 'Prof. Michel Manga',
//           },
//           {
//             id: '09e7c7df-e4bb-453b-83e0-37961599e19a',
//             ue: {
//               id: '09e7c7df-e4bb-453b-83e0-37961599e19a',
//               ue_name: 'Modèles de Langage',
//               slug: 'modeles-langage',
//               description:
//                 'Étude des modèles de langage modernes comme GPT, BERT et autres.',
//               user_creator: 'Prof. Agathe Ndjock',
//               createdAt: '2024-09-19T00:00:00.000Z',
//               updatedAt: '2024-09-19T00:00:00.000Z',
//             },
//             nbr_hours: 55,
//             nbr_credits: 5,
//             tailored_description:
//               'Compréhension et création de modèles de langage pour la classification et la génération de texte.',
//             teacher: 'Prof. Michel Manga',
//           },
//         ],
//         createdAt: '2024-09-19T00:00:00.000Z',
//         updatedAt: '2024-09-19T00:00:00.000Z',
//       },
//     ],
//     createdAt: '2024-09-19T00:00:00.000Z',
//     updatedAt: '2024-09-19T00:00:00.000Z',
//   },
//   {
//     id: '3729c842-4af3-4b34-b7d6-f47a7e4d93e8',
//     name: 'Sécurité Informatique',
//     modules: [
//       {
//         id: '08315468-7f10-4b75-9f3f-c372f6a857bb',
//         name: 'Introduction à la sécurité',
//         ues: [
//           {
//             id: 'a1221e55-53b3-40c2-bf6d-719bf1d7b198',
//             ue: {
//               id: 'a1221e55-53b3-40c2-bf6d-719bf1d7b198',
//               ue_name: 'Principes de sécurité informatique',
//               slug: 'principes-securite-informatique',
//               description:
//                 'Introduction aux principes et concepts de sécurité des systèmes.',
//               user_creator: 'Prof. Joseph Tchaptchet',
//               createdAt: '2024-09-19T00:00:00.000Z',
//               updatedAt: '2024-09-19T00:00:00.000Z',
//             },
//             nbr_hours: 40,
//             nbr_credits: 4,
//             tailored_description:
//               'Bases de la sécurité informatique pour protéger les systèmes et les réseaux.',
//             teacher: 'Prof. Joseph Tchaptchet',
//           },
//           {
//             id: '947be705-9589-4bfa-bb98-7289a43faba4',
//             ue: {
//               id: '947be705-9589-4bfa-bb98-7289a43faba4',
//               ue_name: 'Cryptographie',
//               slug: 'cryptographie',
//               description:
//                 'Introduction aux techniques de cryptographie et leur application en sécurité.',
//               user_creator: 'Prof. Joseph Tchaptchet',
//               createdAt: '2024-09-19T00:00:00.000Z',
//               updatedAt: '2024-09-19T00:00:00.000Z',
//             },
//             nbr_hours: 50,
//             nbr_credits: 5,
//             tailored_description:
//               'Techniques cryptographiques et leur utilisation pour sécuriser les données.',
//             teacher: 'Prof. Michel Kengne',
//           },
//         ],
//         createdAt: '2024-09-19T00:00:00.000Z',
//         updatedAt: '2024-09-19T00:00:00.000Z',
//       },
//       {
//         id: 'f358c245-0f7c-4f57-bd76-5e5aabbcdddf',
//         name: 'Sécurité des réseaux',
//         ues: [
//           {
//             id: 'db681b44-4b90-4f55-985b-3a5dcd8c9198',
//             ue: {
//               id: 'db681b44-4b90-4f55-985b-3a5dcd8c9198',
//               ue_name: 'Réseaux Sécurisés',
//               slug: 'reseaux-securises',
//               description:
//                 "Sécurisation des réseaux d'entreprise et des infrastructures IT.",
//               user_creator: 'Prof. Joseph Tchaptchet',
//               createdAt: '2024-09-19T00:00:00.000Z',
//               updatedAt: '2024-09-19T00:00:00.000Z',
//             },
//             nbr_hours: 50,
//             nbr_credits: 5,
//             tailored_description:
//               'Protection des réseaux contre les menaces, attaques et intrusions.',
//             teacher: 'Prof. Michel Kengne',
//           },
//           {
//             id: 'c6b5e34c-8b6d-4e25-975d-0f4ddcba85c9',
//             ue: {
//               id: 'c6b5e34c-8b6d-4e25-975d-0f4ddcba85c9',
//               ue_name: 'Firewalls et VPN',
//               slug: 'firewalls-vpn',
//               description:
//                 'Technologies de firewalls et de VPN pour la protection des communications.',
//               user_creator: 'Prof. Joseph Tchaptchet',
//               createdAt: '2024-09-19T00:00:00.000Z',
//               updatedAt: '2024-09-19T00:00:00.000Z',
//             },
//             nbr_hours: 45,
//             nbr_credits: 4,
//             tailored_description:
//               'Utilisation de firewalls et de VPN pour protéger les communications.',
//             teacher: 'Prof. Michel Kengne',
//           },
//         ],
//         createdAt: '2024-09-19T00:00:00.000Z',
//         updatedAt: '2024-09-19T00:00:00.000Z',
//       },
//     ],
//     createdAt: '2024-09-19T00:00:00.000Z',
//     updatedAt: '2024-09-19T00:00:00.000Z',
//   },
//   {
//     id: 'a2a97abf-fac5-4b36-b0b5-5084fc048aed',
//     name: 'Big Data',
//     modules: [
//       {
//         id: '35c34e4b-3c3c-4a22-80d2-94e1d2faac0a',
//         name: 'Introduction au Big Data',
//         ues: [
//           {
//             id: '5bc657b4-23b1-4d7f-ae36-09c499d939a9',
//             ue: {
//               id: '5bc657b4-23b1-4d7f-ae36-09c499d939a9',
//               ue_name: 'Concepts du Big Data',
//               slug: 'concepts-big-data',
//               description:
//                 'Introduction aux concepts fondamentaux du Big Data.',
//               user_creator: 'Prof. David Fouda',
//               createdAt: '2024-09-19T00:00:00.000Z',
//               updatedAt: '2024-09-19T00:00:00.000Z',
//             },
//             nbr_hours: 40,
//             nbr_credits: 4,
//             tailored_description:
//               'Compréhension des principes de base des systèmes Big Data.',
//             teacher: 'Prof. David Fouda',
//           },
//           {
//             id: '63b9de2e-0147-4112-9b0f-fb804b8973a9',
//             ue: {
//               id: '63b9de2e-0147-4112-9b0f-fb804b8973a9',
//               ue_name: 'Technologies Big Data',
//               slug: 'technologies-big-data',
//               description:
//                 'Exploration des outils et plateformes Big Data (Hadoop, Spark).',
//               user_creator: 'Prof. David Fouda',
//               createdAt: '2024-09-19T00:00:00.000Z',
//               updatedAt: '2024-09-19T00:00:00.000Z',
//             },
//             nbr_hours: 50,
//             nbr_credits: 5,
//             tailored_description:
//               'Utilisation des plateformes comme Hadoop et Spark pour la gestion des grands ensembles de données.',
//             teacher: 'Prof. Michel Nkolo',
//           },
//         ],
//         createdAt: '2024-09-19T00:00:00.000Z',
//         updatedAt: '2024-09-19T00:00:00.000Z',
//       },
//       {
//         id: 'b3f7da54-6375-4fae-beca-f31b1691ff36',
//         name: 'Analyse des Données Massives',
//         ues: [
//           {
//             id: 'fc6bb62a-bd9e-4141-85f2-c9f11f6a5313',
//             ue: {
//               id: 'fc6bb62a-bd9e-4141-85f2-c9f11f6a5313',
//               ue_name: 'Data Mining',
//               slug: 'data-mining',
//               description:
//                 'Exploration des techniques de data mining appliquées aux grands ensembles de données.',
//               user_creator: 'Prof. David Fouda',
//               createdAt: '2024-09-19T00:00:00.000Z',
//               updatedAt: '2024-09-19T00:00:00.000Z',
//             },
//             nbr_hours: 60,
//             nbr_credits: 6,
//             tailored_description:
//               'Techniques de data mining pour extraire des informations à partir de grands ensembles de données.',
//             teacher: 'Prof. Michel Nkolo',
//           },
//           {
//             id: 'e5e0717b-8541-467e-b68d-9a3b29145df0',
//             ue: {
//               id: 'e5e0717b-8541-467e-b68d-9a3b29145df0',
//               ue_name: 'Analyse Prédictive',
//               slug: 'analyse-predictive',
//               description:
//                 "Introduction aux techniques d'analyse prédictive sur les grands volumes de données.",
//               user_creator: 'Prof. David Fouda',
//               createdAt: '2024-09-19T00:00:00.000Z',
//               updatedAt: '2024-09-19T00:00:00.000Z',
//             },
//             nbr_hours: 55,
//             nbr_credits: 5,
//             tailored_description:
//               "Apprentissage des techniques d'analyse prédictive pour la modélisation et la prévision à partir de données massives.",
//             teacher: 'Prof. Michel Nkolo',
//           },
//         ],
//         createdAt: '2024-09-19T00:00:00.000Z',
//         updatedAt: '2024-09-19T00:00:00.000Z',
//       },
//     ],
//     createdAt: '2024-09-19T00:00:00.000Z',
//     updatedAt: '2024-09-19T00:00:00.000Z',
//   },
// ];