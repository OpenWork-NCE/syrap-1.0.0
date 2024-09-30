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
import { DocumentsTable, PageHeader } from '@/components';
import { IconDotsVertical } from '@tabler/icons-react';

const items = [
  { title: 'Cenadi', href: PATH_BOARD.cenadi },
  { title: 'Téléversements', href: '#' },
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
        <title>Téléversements | SYRAP</title>
        <meta name="description" content="" />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Fichiers téléversés" breadcrumbItems={items} />
          <DocumentsTable />
        </Stack>
      </Container>
    </>
  );
}

export default Page;
