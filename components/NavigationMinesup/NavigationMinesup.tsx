import { ActionIcon, Box, Flex, Group, ScrollArea, Text } from '@mantine/core';
import {
  IconAffiliate,
  IconChartArea,
  IconChartBar,
  IconCross,
  IconFile,
  IconFileDownload,
  IconFiles,
  IconFileUpload,
  IconFolders,
  IconFolderShare,
  IconFridge,
  IconGitCompare,
  IconNotebook,
  IconSchool,
  IconUserCheck,
  IconUsers,
  IconUsersGroup,
  IconX,
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
      { label: 'Accueil', icon: IconChartBar, link: PATH_BOARD.minesup },
      { label: 'UEs', icon: IconFolders, link: PATH_SECTIONS.ues },
      {
        label: 'Filières et Niveaux',
        icon: IconFridge,
        link: PATH_SECTIONS.branchNlevel,
      },
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
        label: 'Croiser et Comparer',
        icon: IconGitCompare,
        link: PATH_SECTIONS.crosscompare,
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
    title: 'Raports et Logs',
    links: [
      {
        label: 'Rapports',
        icon: IconFolderShare,
        link: PATH_SECTIONS.reports,
      },
      {
        label: 'Logs',
        icon: IconChartArea,
        link: PATH_SECTIONS.logs,
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

      <ScrollArea className={classes.links}>
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
