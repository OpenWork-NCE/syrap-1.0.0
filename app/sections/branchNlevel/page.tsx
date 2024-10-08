'use client';

import {
  ActionIcon,
  Anchor,
  Container,
  Grid,
  Group,
  Paper,
  PaperProps,
  Stack,
  Text,
} from '@mantine/core';
import { PATH_BOARD } from '@/routes';
import { BranchTable, LevelTable, PageHeader, UesTable } from '@/components';

const items = [
  { title: 'Cenadi', href: PATH_BOARD.cenadi },
  { title: 'Filières et Niveaux', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

function Page() {
  // const {
  //   data: uesData,
  //   loading: uesLoading,
  //   error: uesError,
  // } = useFetchData('/mocks/Ues.json');

  return (
    <>
      <>
        <title>Filières et Niveaux | SYRAP</title>
        <meta name="description" content="" />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Filières et Niveaux" breadcrumbItems={items} />
          <Grid my={10}>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <PageHeader title="Filières" />
              <BranchTable />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <PageHeader title="Niveaux" />
              <LevelTable />
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </>
  );
}

export default Page;
