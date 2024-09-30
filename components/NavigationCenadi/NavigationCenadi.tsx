import { ActionIcon, Box, Flex, Group, ScrollArea, Text } from '@mantine/core';
import {
  IconChartArea,
  IconChartBar,
  IconCross,
  IconFileDownload,
  IconFiles,
  IconFileUpload,
  IconFolders,
  IconFolderShare,
  IconGitCompare,
  IconMatchstick,
  IconNotebook,
  IconSchool,
  IconUsers,
  IconUsersGroup,
  IconX,
  IconFile,
} from '@tabler/icons-react';
import { Logo, UserProfileButton } from '@/components';
import { PATH_APPS, PATH_SECTIONS, PATH_BOARD } from '@/routes';
import UserProfileData from '@/public/mocks/UserProfile.json';
import { useMediaQuery } from '@mantine/hooks';
import classes from './Navigation.module.css';
import { LinksGroup } from '@/components/Navigation/Links/Links';

const mockdata = [
  {
    title: 'Infos Metiers',
    links: [
      { label: 'Accueil', icon: IconChartBar, link: PATH_BOARD.cenadi },
      { label: 'UEs', icon: IconFolders, link: PATH_SECTIONS.ues },
      {
        label: 'Universités de Tutelle',
        icon: IconSchool,
        // link: PATH_SECTIONS.universities,
        links: [
          {
            label: 'Vue Globale',
            icon: IconGitCompare,
            link: PATH_SECTIONS.universities.all,
          },
          {
            label: 'Programmes',
            icon: IconFiles,
            link: PATH_SECTIONS.universities.syllabus,
          },
          // {
          //   label: 'Documents',
          //   icon: IconFileUpload,
          //   link: PATH_SECTIONS.universities.documents,
          // },
        ],
      },
      {
        label: 'IPES',
        icon: IconNotebook,
        // link: PATH_SECTIONS.ipes,
        links: [
          {
            label: 'Vue Globale',
            icon: IconGitCompare,
            link: PATH_SECTIONS.ipes.all,
          },
          {
            label: 'Programmes',
            icon: IconFiles,
            link: PATH_SECTIONS.ipes.syllabus,
          },
          // {
          //   label: 'Documents',
          //   icon: IconFileUpload,
          //   link: PATH_SECTIONS.ipes.documents,
          // },
        ],
      },
      {
        label: 'Croiser et Comparer',
        icon: IconGitCompare,
        link: PATH_SECTIONS.crosscompare,
      },
    ],
  },
  {
    title: 'Documents',
    links: [
      {
        label: 'Tous les documents',
        icon: IconFile,
        link: PATH_SECTIONS.documents,
      },
    ],
  },
  {
    title: 'Utilisateurs & Rôles',
    links: [
      {
        label: 'Utilisateurs',
        icon: IconUsers,
        link: PATH_SECTIONS.users,
      },
      {
        label: 'Habilitations',
        icon: IconUsersGroup,
        link: PATH_SECTIONS.authorizations,
      },
    ],
  },
  {
    title: 'Raports et Logs',
    links: [
      {
        label: 'Rapports',
        icon: IconFolderShare,
        link: PATH_APPS.profile,
      },
      {
        label: 'Logs',
        icon: IconChartArea,
        link: PATH_APPS.settings,
      },
    ],
  },
];

type NavigationProps = {
  onClose: () => void;
};

const NavigationCenadi = ({ onClose }: NavigationProps) => {
  const tablet_match = useMediaQuery('(max-width: 768px)');

  const links = mockdata.map((m) => (
    <Box pl={0} mb="md" key={m.title}>
      <Text
        tt="uppercase"
        size="sm"
        pl="md"
        fw={500}
        mb="sm"
        className={classes.linkHeader}
      >
        {m.title}
      </Text>
      {m.links.map((item) => (
        <LinksGroup
          key={item.label}
          {...item}
          closeSidebar={() => {
            setTimeout(() => {
              onClose();
            }, 250);
          }}
        />
      ))}
    </Box>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Flex justify="space-between" align="center" gap="sm">
          <Group
            justify="space-between"
            style={{ flex: tablet_match ? 'auto' : 1 }}
          >
            <Logo className={classes.logo} />
          </Group>
          {tablet_match && (
            <ActionIcon onClick={onClose} variant="transparent">
              <IconX color="white" />
            </ActionIcon>
          )}
        </Flex>
      </div>

      <ScrollArea className={classes.links} px={10}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>

      <div className={classes.footer}>
        <UserProfileButton
          email={UserProfileData.email}
          image={UserProfileData.avatar}
          name={UserProfileData.name}
        />
      </div>
    </nav>
  );
};

export default NavigationCenadi;
