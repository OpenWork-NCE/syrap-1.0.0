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
import { PageHeader, InvoicesTable } from '@/components';
import { IconDotsVertical } from '@tabler/icons-react';
import { useFetchData } from '@/hooks';

const items = [
  { title: 'Dashboard', href: PATH_BOARD.cenadi },
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
  const {
    data: invoicesData,
    loading: invoicesLoading,
    error: invoicesError,
  } = useFetchData('/mocks/Invoices.json');

  return (
    <>
      <>
        <title>Invoices | SYRAP</title>
        <meta name="description" content="" />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            title="Unitiés d'Enseignement"
            breadcrumbItems={items}
            invoiceAction={true}
          />
          <Paper {...PAPER_PROPS}>
            <Group justify="space-between" mb="md">
              <ActionIcon>
                <IconDotsVertical size={18} />
              </ActionIcon>
            </Group>
            <InvoicesTable
              data={invoicesData}
              error={invoicesError}
              loading={invoicesLoading}
            />
          </Paper>
        </Stack>
      </Container>
    </>
  );
}

export default Page;
