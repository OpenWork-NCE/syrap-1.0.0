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
import { PATH_BOARD } from '@/routes';
import { PageHeader, UesTable } from '@/components';

const items = [
  { title: 'Cenadi', href: PATH_BOARD.cenadi },
  { title: 'Ues', href: '#' },
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
  //   data: uesData,
  //   loading: uesLoading,
  //   error: uesError,
  // } = useFetchData('/mocks/Ues.json');

  return (
    <>
      <>
        <title>Unitées d'Enseignement | SYRAP</title>
        <meta name="description" content="" />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Unitées d'Enseignement" breadcrumbItems={items} />
          <Paper {...PAPER_PROPS}>
            <UesTable />
          </Paper>
        </Stack>
      </Container>
    </>
  );
}

export default Page;
