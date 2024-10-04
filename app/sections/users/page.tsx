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
import { PageHeader, InvoicesTable, UsersForm, UsersTable } from '@/components';
import { useFetchData } from '@/hooks';
import BranchTable from '@/components/BranchTable/BranchTable';

const items = [
  { title: 'Dashboard', href: PATH_BOARD.cenadi },
  { title: 'Users', href: '#' },
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
  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
  } = useFetchData('/mocks/Users.json');

  return (
    <>
      <>
        <title>Utilisateurs | SYRAP</title>
        <meta name="description" content="" />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Utilisateurs" breadcrumbItems={items} />
          <UsersTable />
        </Stack>
      </Container>
    </>
  );
}

export default Page;
