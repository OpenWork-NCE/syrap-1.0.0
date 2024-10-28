'use client';

import { Anchor, Container, PaperProps, Stack, Text } from '@mantine/core';
import { PATH_BOARD } from '@/routes';
import { MinesupTable, PageHeader, UsersTable } from '@/components';

const items = [
  { title: 'Dashboard', href: PATH_BOARD.cenadi },
  { title: 'Minesups', href: '#' },
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
        <title>Minesups | SYRAP</title>
        <meta name="description" content="" />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Minesups" breadcrumbItems={items} />
          <MinesupTable />
        </Stack>
      </Container>
    </>
  );
}

export default Page;
