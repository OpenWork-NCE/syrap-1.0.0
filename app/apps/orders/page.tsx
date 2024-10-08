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
import { PATH_DASHBOARD } from '@/routes';
import { OrdersTable, PageHeader } from '@/components';
import { IconDotsVertical } from '@tabler/icons-react';
import { useFetchData } from '@/hooks';

const items = [
  { title: 'Dashboard', href: PATH_DASHBOARD.default },
  { title: 'Apps', href: '#' },
  { title: 'Orders', href: '#' },
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
    data: ordersData,
    loading: ordersLoading,
    error: ordersError,
  } = useFetchData('/mocks/Orders.json');

  return (
    <>
      <>
        <title>Orders | SYRAP</title>
        <meta
          name="description"
          content=""
        />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Orders" breadcrumbItems={items} />
          <Paper {...PAPER_PROPS}>
            <Group justify="space-between" mb="md">
              <Text fz="lg" fw={600}>
                Orders
              </Text>
              <ActionIcon>
                <IconDotsVertical size={18} />
              </ActionIcon>
            </Group>
            <OrdersTable
              data={ordersData}
              error={ordersError}
              loading={ordersLoading}
            />
          </Paper>
        </Stack>
      </Container>
    </>
  );
}

export default Page;
