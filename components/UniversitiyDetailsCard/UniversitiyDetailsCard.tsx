'use client';

import { University } from '@/types';
import {
  Box,
  Button,
  Divider,
  Flex,
  Menu,
  Paper,
  PaperProps,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextProps,
  Title,
  useMantineTheme,
} from '@mantine/core';
import {
  IconBusinessplan,
  IconCategory,
  IconCloudDownload,
  IconCoins,
  IconEye,
  IconListCheck,
  IconMail,
  IconPrinter,
  IconSchool,
  IconSend,
  IconShare,
  IconStack3,
} from '@tabler/icons-react';
import { useColorScheme, useMediaQuery } from '@mantine/hooks';
import { BranchTable, ProfileStatsCard, Surface } from '@/components';
import UniversityStatsCard from '@/components/UniversityStatsCard/UniversityStatsCard';

const ICON_SIZE = 16;

type UniversityDetailsProps = {
  data?: University;
} & PaperProps;

const elements = [
  { description: 'Front and rear brake cables', unitPrice: 100, amount: 100 },
  { description: 'New set of pedal arms', unitPrice: 25, amount: 25 },
  { description: 'Labor - 3hrs', unitPrice: 15, amount: 15 },
];

const TEXT_PROPS: TextProps = {
  fz: 'sm',
};

const UniversityDetails = ({
  data,
  ...PAPER_PROPS
}: UniversityDetailsProps) => {
  const theme = useMantineTheme();
  const colorScheme = useColorScheme();
  const LINK_PROPS: TextProps = {
    c:
      colorScheme === 'dark'
        ? theme.colors[theme.primaryColor][4]
        : theme.colors[theme.primaryColor][6],
    td: 'underline',
  };
  const tablet_match = useMediaQuery('(max-width: 768px)');

  const rows = elements.map((element) => (
    <Table.Tr key={element.description}>
      <Table.Td>{element.description}</Table.Td>
      <Table.Td>${element.unitPrice}</Table.Td>
      <Table.Td>${element.amount}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <SimpleGrid
        cols={{ base: 1, md: 1, lg: 3 }}
        spacing={{ base: 10, sm: 'xl' }}
        verticalSpacing={{ base: 'md', sm: 'xl' }}
      >
        <UniversityStatsCard
          amount={data ? data.ipes_count : 0}
          title="Nombre d'IPES"
          icon={IconSchool}
          color="indigo.7"
          {...PAPER_PROPS}
        />
        <UniversityStatsCard
          amount={data ? data.branch_count : 0}
          title="Nombre de filière"
          icon={IconCategory}
          color="teal.7"
          {...PAPER_PROPS}
        />
        <UniversityStatsCard
          amount={data ? 10 : 0}
          title="Nombre de niveaux"
          icon={IconStack3}
          color="lime.7"
          {...PAPER_PROPS}
        />
      </SimpleGrid>
      <Surface component={Paper} {...PAPER_PROPS}>
        {data ? (
          <Stack>
            <Flex gap="sm" justify="flex-end">
              <Button
                leftSection={<IconCloudDownload size={ICON_SIZE} />}
                variant="light"
              >
                Télécharger
              </Button>
              <Button
                leftSection={<IconPrinter size={ICON_SIZE} />}
                variant="light"
              >
                Imprimer
              </Button>
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <Button
                    leftSection={<IconShare size={ICON_SIZE} />}
                    variant="light"
                  >
                    Partager
                  </Button>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item leftSection={<IconMail size={14} />}>
                    Via email
                  </Menu.Item>
                  <Menu.Item leftSection={<IconSend size={14} />} disabled>
                    Dans un Chat
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Flex>
            <Box style={{ width: '100%' }}>
              <Box style={{ fontSize: '16px', marginBottom: '25px' }}>
                <Title order={5} mb={15}>
                  Informations Générales
                </Title>
                <Text {...TEXT_PROPS} size={'sm'}>
                  Identifiant Unique :{' '}
                  <span style={{ fontWeight: 'bolder' }}>{data.id}</span>
                </Text>
                <Text {...TEXT_PROPS} size={'sm'}>
                  Intitulé de l'Université :{' '}
                  <span style={{ fontWeight: 'bolder' }}>{data.name}</span>
                </Text>
                <Text {...TEXT_PROPS} size={'sm'}>
                  Téléphone :{' '}
                  <span style={{ fontWeight: 'bolder' }}>{data.phone}</span>
                </Text>
                <Text {...TEXT_PROPS} size={'sm'}>
                  Email :{' '}
                  <span style={{ fontWeight: 'bolder' }}>{data.email}</span>
                </Text>
                <Text {...TEXT_PROPS} size={'sm'}>
                  Créé par :{' '}
                  <span style={{ fontWeight: 'bolder' }}>
                    {data.created_user}
                  </span>
                </Text>
                <Text {...TEXT_PROPS} size={'sm'}>
                  Nombre d'IPES :{' '}
                  <span style={{ fontWeight: 'bolder' }}>
                    {data.ipes_count}
                  </span>
                </Text>
                <Text {...TEXT_PROPS} size={'sm'}>
                  Nombre de filières :{' '}
                  <span style={{ fontWeight: 'bolder' }}>
                    {data.branch_count}
                  </span>
                </Text>
                <Text {...TEXT_PROPS} size={'sm'}>
                  Pourcentage moyen de matching IPES :{' '}
                  <span style={{ fontWeight: 'bolder' }}>
                    {data.global_matching}%
                  </span>
                </Text>
              </Box>
              <Title order={5} mb={5}>
                Filières de l'université
              </Title>
              <BranchTable datas={data.branchs} />
              {/*<Table striped horizontalSpacing="xs" verticalSpacing="xs">*/}
              {/*  <Table.Thead>*/}
              {/*    <Table.Tr>*/}
              {/*      <Table.Th>Description</Table.Th>*/}
              {/*      <Table.Th>Unit Price</Table.Th>*/}
              {/*      <Table.Th>Amount</Table.Th>*/}
              {/*    </Table.Tr>*/}
              {/*  </Table.Thead>*/}
              {/*  <Table.Tbody>*/}
              {/*    {rows}*/}
              {/*    <Table.Tr>*/}
              {/*      <Table.Td></Table.Td>*/}
              {/*      <Table.Td>Subtotal</Table.Td>*/}
              {/*      <Table.Td>$140</Table.Td>*/}
              {/*    </Table.Tr>*/}
              {/*    <Table.Tr>*/}
              {/*      <Table.Td></Table.Td>*/}
              {/*      <Table.Td>Shipping</Table.Td>*/}
              {/*      <Table.Td>$5</Table.Td>*/}
              {/*    </Table.Tr>*/}
              {/*    <Table.Tr>*/}
              {/*      <Table.Td></Table.Td>*/}
              {/*      <Table.Td>Discount</Table.Td>*/}
              {/*      <Table.Td>2.5%</Table.Td>*/}
              {/*    </Table.Tr>*/}
              {/*    <Table.Tr>*/}
              {/*      <Table.Td></Table.Td>*/}
              {/*      <Table.Td>Total</Table.Td>*/}
              {/*      <Table.Td>$137.75</Table.Td>*/}
              {/*    </Table.Tr>*/}
              {/*  </Table.Tbody>*/}
              {/*</Table>*/}
            </Box>
          </Stack>
        ) : (
          <p>Aucune université selectionnée ou trouvée</p>
        )}
      </Surface>
    </>
  );
};

export default UniversityDetails;
