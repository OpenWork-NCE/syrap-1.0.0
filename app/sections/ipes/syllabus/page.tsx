'use client';

import {
  ActionIcon,
  Anchor,
  Container,
  Group,
  Paper,
  PaperProps,
  Stack,
  Text,
} from '@mantine/core';
import { PATH_BOARD, PATH_DASHBOARD } from '@/routes';
import { PageHeader, SyllabusITable, UniversitiesTable } from '@/components';
const items = [
  { title: 'Cenadi', href: PATH_BOARD.cenadi },
  { title: 'Universités', href: '#' },
  { title: 'Programmes Universités', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

const PAPER_PROPS: PaperProps = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
};

function Page() {
  // const {
  //   data: usersData,
  //   loading: usersLoading,
  //   error: usersError,
  // } = useFetchData('/mocks/Users.json');

  return (
    <>
      <>
        <title>Programmes Universités | SYRAP</title>
        <meta name="description" content="" />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Programmes Universités" breadcrumbItems={items} />
          <SyllabusITable />
        </Stack>
      </Container>
    </>
  );
}

export default Page;
