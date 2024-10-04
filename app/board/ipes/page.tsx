'use client';

import {
  Button,
  Container,
  Grid,
  Group,
  Paper,
  PaperProps,
  Stack,
  Text,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import {
  MobileDesktopChart,
  PageHeader,
  ProjectsTable,
  RevenueChart,
  SalesChart,
  StatsGrid,
} from '@/components';
import Link from 'next/link';
import { PATH_TASKS } from '@/routes';
import { useFetchData } from '@/hooks';
import { useTheme, useRole } from '@/app/lib/store';
import { myTheme } from '@/theme/ipes-theme';
import LogTable from '@/components/LogsTable/LogsTable';

const PAPER_PROPS: PaperProps = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
  style: { height: '100%' },
};

function Page() {
  const {
    data: projectsData,
    error: projectsError,
    loading: projectsLoading,
  } = useFetchData('/mocks/Projects.json');
  const {
    data: statsData,
    error: statsError,
    loading: statsLoading,
  } = useFetchData('/mocks/StatsGrid.json');
  const changeTheme = useTheme((state: any) => state.changeTheme);
  changeTheme(myTheme);

  const changeRole = useRole((state: any) => state.changeRole);
  changeRole('Ipes');

  return (
    <>
      <>
        <title>Board | SYRAP</title>
        <meta name="description" content="" />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="IPES" withActions={true} />
        </Stack>
      </Container>
    </>
  );
}

export default Page;
