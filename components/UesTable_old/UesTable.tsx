'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import {
  DataTable,
  DataTableProps,
  DataTableSortStatus,
} from 'mantine-datatable';
import {
  ActionIcon,
  Flex,
  Group,
  HoverCard,
  Stack,
  Text,
  TextInput,
  Tooltip,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import sortBy from 'lodash/sortBy';
import { Ues } from '@/types';
import { useDebouncedValue } from '@mantine/hooks';
import {
  IconEdit,
  IconEye,
  IconFileExport,
  IconSearch,
  IconTrash,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { PATH_UES } from '@/routes';
import { ErrorAlert } from '@/components';

const PAGE_SIZES = [10, 20];

const ICON_SIZE = 18;

type UesTableProps = {
  data: Ues[];
  error?: ReactNode;
  loading?: boolean;
};

const UesTable = ({ data, error, loading }: UesTableProps) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [selectedRecords, setSelectedRecords] = useState<Ues[]>([]);
  const [records, setRecords] = useState<Ues[]>(data.slice(0, pageSize));
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'ue_name',
    direction: 'asc',
  });
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const router = useRouter();

  const columns: DataTableProps<Ues>['columns'] = [
    {
      accessor: 'ue_name',
      title: 'UE',
      render: ({ ue_name, slug }: any) => {
        return (
          <HoverCard shadow="md" openDelay={500} closeDelay={500}>
            <HoverCard.Target>
              <Flex component={UnstyledButton} gap="xs" align="center">
                <Stack gap={1}>
                  <Text fw={600}>{ue_name}</Text>
                  <Text fz="sm">{slug}</Text>
                </Stack>
              </Flex>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <Stack gap="xs">
                <Text fz="sm">Unité : {ue_name}</Text>
                <Text fz="sm">Sigle: {slug}</Text>
              </Stack>
            </HoverCard.Dropdown>
          </HoverCard>
        );
      },
      sortable: true,
      filter: (
        <TextInput
          label="Unité d'enseignement"
          description="Rechercher l'unité d'enseignement qui contient ce mot"
          placeholder="Rechercher une UE..."
          leftSection={<IconSearch size={16} />}
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
        />
      ),
      filtering: query !== '',
    },
    {
      accessor: 'Identifiant',
      render: (item: any) => <Text>#{item.id.slice(0, 10)}...</Text>,
    },
    {
      accessor: "Nbrs d'heures",
      sortable: true,
      render: (item: any) => <Text>{item.nbr_hours}</Text>,
    },
    {
      accessor: 'Derniere Modif',
      render: (item: any) => <Text>{item.last_update_date}</Text>,
    },
    {
      accessor: '',
      title: 'Actions',
      render: (item: any) => (
        <Group gap="sm">
          <Tooltip label="Afficher les détails">
            <ActionIcon
              onClick={() => router.push(PATH_UES.ues.ue_details(item.id))}
            >
              <IconEye size={ICON_SIZE} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Exporter UE">
            <ActionIcon>
              <IconFileExport size={ICON_SIZE} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Editer">
            <ActionIcon>
              <IconEdit size={ICON_SIZE} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Supprimer">
            <ActionIcon>
              <IconTrash size={ICON_SIZE} />
            </ActionIcon>
          </Tooltip>
        </Group>
      ),
    },
  ];

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    const d = sortBy(data, sortStatus.columnAccessor) as Ues[];
    const dd = sortStatus.direction === 'desc' ? d.reverse() : d;
    let filtered = dd.slice(from, to) as Ues[];

    if (debouncedQuery || selectedStatuses.length) {
      filtered = data
        .filter(({ ue_name }) => {
          if (
            debouncedQuery !== '' &&
            !ue_name.toLowerCase().includes(debouncedQuery.trim().toLowerCase())
          ) {
            return false;
          }

          // @ts-ignore
          if (
            selectedStatuses.length &&
            !selectedStatuses.some((s) => s === status)
          ) {
            return false;
          }
          return true;
        })
        .slice(from, to);
    }

    setRecords(filtered);
  }, [sortStatus, data, page, pageSize, debouncedQuery, selectedStatuses]);

  return error ? (
    <ErrorAlert title="Error loading invoices" message={error.toString()} />
  ) : (
    <DataTable
      minHeight={200}
      verticalSpacing="xs"
      striped
      highlightOnHover
      // @ts-ignore
      columns={columns}
      records={records}
      selectedRecords={selectedRecords}
      // @ts-ignore
      onSelectedRecordsChange={setSelectedRecords}
      totalRecords={
        debouncedQuery || selectedStatuses.length > 0
          ? records.length
          : data.length
      }
      recordsPerPage={pageSize}
      page={page}
      onPageChange={(p) => setPage(p)}
      recordsPerPageOptions={PAGE_SIZES}
      onRecordsPerPageChange={setPageSize}
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
      fetching={loading}
    />
  );
};

export default UesTable;
