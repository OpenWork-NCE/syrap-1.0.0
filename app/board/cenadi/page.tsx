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
import { useRole, useTheme } from '@/app/lib/store';
import { myTheme } from '@/theme/cenadi-theme';
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
  changeRole('Cenadi');

  return (
    <>
      <>
        <title>Board | SYRAP</title>
        <meta name="description" content="" />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="CENADI" withActions={true} />
          <StatsGrid
            data={statsData.data}
            loading={statsLoading}
            error={statsError}
            paperProps={PAPER_PROPS}
          />
          {/*<Grid gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}>*/}
          {/*  <Grid.Col span={12}>*/}
          {/*    <Paper {...PAPER_PROPS}>*/}
          {/*      <Group justify="space-between" mb="md">*/}
          {/*        <Text size="lg" fw={600}>*/}
          {/*          Logs*/}
          {/*        </Text>*/}
          {/*      </Group>*/}
          {/*      <LogTable />*/}
          {/*    </Paper>*/}
          {/*  </Grid.Col>*/}
          {/*</Grid>*/}
        </Stack>
      </Container>
    </>
  );
}

export default Page;
