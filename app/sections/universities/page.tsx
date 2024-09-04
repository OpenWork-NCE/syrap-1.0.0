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
import { PageHeader, UniversitiesTable } from '@/components';
import { IconDotsVertical } from '@tabler/icons-react';
import { useFetchData } from '@/hooks';

const items = [
  { title: 'Cenadi', href: PATH_BOARD.cenadi },
  { title: 'Universités', href: '#' },
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
        <title>Universités | SYRAP</title>
        <meta name="description" content="" />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Universités" breadcrumbItems={items} />
          <Paper {...PAPER_PROPS}>
            <Group justify="space-between" mb="md">
              <ActionIcon>
                <IconDotsVertical size={18} />
              </ActionIcon>
            </Group>
            <UniversitiesTable />
          </Paper>
        </Stack>
      </Container>
    </>
  );
}

export default Page;
