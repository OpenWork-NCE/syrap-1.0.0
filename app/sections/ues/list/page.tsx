'use client';

import { Anchor, Container, Stack } from '@mantine/core';
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
          <UesTable />
        </Stack>
      </Container>
    </>
  );
}

export default Page;
