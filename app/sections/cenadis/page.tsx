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
import {
  PageHeader,
  InvoicesTable,
  UsersForm,
  UsersTable,
  CenadiTable,
} from '@/components';
import { useFetchData } from '@/hooks';
import BranchTable from '@/components/BranchTable/BranchTable';

const items = [
  { title: 'Dashboard', href: PATH_BOARD.cenadi },
  { title: 'Cenadis', href: '#' },
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
  return (
    <>
      <>
        <title>Cenadis | SYRAP</title>
        <meta name="description" content="" />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Cenadis" breadcrumbItems={items} />
          <CenadiTable />
        </Stack>
      </Container>
    </>
  );
}

export default Page;
