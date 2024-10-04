'use client';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css'; //if using mantine date picker features
import 'mantine-react-table/styles.css'; //make sure MRT styles were imported in your app root (once)
import { useMemo, useState } from 'react';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
  type MRT_ColumnFilterFnsState,
  MRT_Row,
} from 'mantine-react-table';
import {
  ActionIcon,
  Tooltip,
  Text,
  Title,
  Flex,
  Box,
  Divider,
  Button,
  Menu,
} from '@mantine/core';
import {
  IconDownload,
  IconFileTypeCsv,
  IconFileTypePdf,
  IconRefresh,
  IconTableExport,
} from '@tabler/icons-react';
import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { useRouter } from 'next/navigation';

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});

// Enum pour les types d'actions loggées
enum ActionType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  ERROR = 'ERROR',
}

// Enum pour les niveaux de gravité du log
enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

type Log = {
  id: string; // Identifiant unique du log
  timestamp: string; // Horodatage de l'événement
  user?: {
    id: string;
    name: string;
  }; // ID de l'utilisateur (facultatif, si applicable)
  actionType: string; // Type d'action (enum)
  level: string; // Niveau de gravité du log (enum)
  message: string; // Message descriptif
  metadata?: object; // Métadonnées supplémentaires (facultatif)
};

type LogApiResponse = {
  data: Array<Log>;
  messages: Array<string>;
  success: string;
};

interface Params {
  columnFilterFns: MRT_ColumnFilterFnsState;
  columnFilters: MRT_ColumnFiltersState;
  globalFilter: string;
  sorting: MRT_SortingState;
  pagination: MRT_PaginationState;
}

//custom react-query hook
const useGetLogs = ({} // columnFilterFns,
// columnFilters,
// globalFilter,
// sorting,
// pagination,
: Params) => {
  //build the URL (https://www.mantine-react-table.com/api/data?start=0&size=10&filters=[]&globalFilter=&sorting=[])
  const fetchURL = new URL(
    '/api/logs',
    process.env.NODE_ENV === 'production'
      ? 'https://www.mantine-react-table.com'
      : 'http://localhost:3000',
  );
  // fetchURL.searchParams.set(
  //   'start',
  //   `${pagination.pageIndex * pagination.pageSize}`,
  // );
  // fetchURL.searchParams.set('size', `${pagination.pageSize}`);
  // fetchURL.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
  // fetchURL.searchParams.set(
  //   'filterModes',
  //   JSON.stringify(columnFilterFns ?? {}),
  // );
  // fetchURL.searchParams.set('globalFilter', globalFilter ?? '');
  // fetchURL.searchParams.set('sorting', JSON.stringify(sorting ?? []));

  return useQuery<LogApiResponse>({
    // queryKey: ['logs', fetchURL.href], //refetch whenever the URL changes (columnFilters, globalFilter, sorting, pagination)
    queryKey: ['logs'], //refetch whenever the URL changes (columnFilters, globalFilter, sorting, pagination)
    queryFn: () => fetch(fetchURL.href).then((res) => res.json()),
    placeholderData: keepPreviousData, //useful for paginated queries by keeping data from previous pages on screen while fetching the next page
    staleTime: 30_000, //don't refetch previously viewed pages until cache is more than 30 seconds old
  });
};

const Section = () => {
  const exportableLogs = (rows: MRT_Row<Log>[]) => {
    const rowData = rows.map((row) => ({
      id: row.original.id,
      timestamp: row.original.timestamp,
      userid: row.original.user?.id,
      username: row.original.user?.name,
      actionType: row.original.actionType,
      level: row.original.level,
      message: row.original.message,
      metadata: String(row.original.metadata),
    }));
    return rowData;
  };

  const handleExportRows = (rows: MRT_Row<Log>[]) => {
    const doc = new jsPDF();
    const tableData = rows.map((row) =>
      Object.values({
        id: row.original.id ?? '', // Gérer les valeurs undefined
        timestamp: row.original.timestamp ?? '',
        userid: row.original.user?.id ?? '',
        username: row.original.user?.name ?? '',
        actionType: row.original.actionType ?? '',
        level: row.original.level ?? '',
        message: row.original.message ?? '',
        metadata: String(row.original.metadata ?? ''),
      }),
    );
    const tableHeaders = [
      'id',
      'timestamp',
      'userId',
      'user',
      'actionType',
      'level',
      'message',
      'metadata',
    ];

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    });

    doc.save('syrap-logs.pdf');
  };

  const handleExportRowsAsCSV = (rows: MRT_Row<Log>[]) => {
    const csv = generateCsv(csvConfig)(exportableLogs(rows));
    download(csvConfig)(csv);
  };

  const handleExportDataAsCSV = () => {
    const csv = generateCsv(csvConfig)(
      fetchedLogs.map((log) => ({
        id: log.id,
        timestamp: log.timestamp,
        userid: log.user?.id,
        username: log.user?.name,
        actionType: log.actionType,
        level: log.level,
        message: log.message,
        metadata: String(log.metadata),
      })),
    );
    download(csvConfig)(csv);
  };

  const columns = useMemo<MRT_ColumnDef<Log>[]>(
    () => [
      {
        accessorKey: 'timestamp',
        header: 'Timestamp',
      },
      {
        accessorKey: 'user.name',
        header: 'Utilisateur',
      },
      {
        accessorKey: 'level',
        header: "Niveau d'action",
        Cell: ({ cell }) => (
          <Box
            style={(theme: any) => ({
              backgroundColor:
                cell.getValue<string>() === 'INFO'
                  ? theme.colors.green[9]
                  : cell.getValue<string>() === 'ERROR'
                    ? theme.colors.red[9]
                    : cell.getValue<string>() === 'DEBUG'
                      ? theme.colors.blue[9]
                      : theme.colors.orange[9],
              borderRadius: '4px',
              color: '#fff',
              maxWidth: '9ch',
              padding: '4px',
            })}
          >
            {cell.getValue<string>()}
          </Box>
        ),
      },
      {
        accessorKey: 'actionType',
        header: "Type d'action",
        enableHiding: true,
      },
      {
        accessorKey: 'message',
        header: 'Message',
      },
      {
        accessorKey: 'metadata',
        header: 'Metadonnées',
      },
    ],
    [],
  );

  //Manage MRT state that we want to pass to our API
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    [],
  );
  const [columnFilterFns, setColumnFilterFns] = //filter modes
    useState<MRT_ColumnFilterFnsState>(
      Object.fromEntries(
        columns.map(({ accessorKey }) => [accessorKey, 'contains']),
      ),
    ); //default to "contains" for all columns
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  //call our custom react-query hook
  const { data, isError, isFetching, isLoading, refetch } = useGetLogs({
    columnFilterFns,
    columnFilters,
    globalFilter,
    pagination,
    sorting,
  });

  //this will depend on your API response shape
  const fetchedLogs = data?.data ?? [];
  console.log('Voici les données en question : ', fetchedLogs);
  // const totalRowCount = data?.meta?.totalRowCount ?? 0;

  const table = useMantineReactTable({
    columns,
    data: fetchedLogs,
    enableEditing: false,
    enableRowSelection: false,
    positionToolbarAlertBanner: 'bottom',
    positionActionsColumn: 'last',
    enableColumnFilterModes: false,
    enableColumnOrdering: false,
    enableDensityToggle: false,
    enableGlobalFilterModes: false,
    enableMultiRowSelection: true,
    enableFacetedValues: true,
    enableRowNumbers: true,
    enableRowActions: false,
    enableColumnPinning: false,
    enableGrouping: false,
    enablePagination: true,
    initialState: {
      density: 'xs',
      columnVisibility: {
        id: false,
        metadata: false,
      },
      columnPinning: {
        left: ['mrt-row-select'],
        right: ['mrt-row-actions', 'mrt-row-expand'],
      },
      pagination: {
        pageIndex: 0,
        pageSize: 5,
      },
    },
    mantineSearchTextInputProps: {
      placeholder: 'Rechercher des Logs',
    },
    // renderTopToolbarCustomActions: ({ table }) => (
    //
    // ),
    getRowId: (row) => row.id,
    mantineToolbarAlertBannerProps: isError
      ? {
          color: 'red',
          children: 'Erreur de chargement des données',
        }
      : undefined,
    mantineTableContainerProps: {
      style: {
        minHeight: 'auto',
      },
    },

    onColumnFilterFnsChange: setColumnFilterFns,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,

    renderDetailPanel: ({ row }) => (
      <Box
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: '16px',
          padding: '16px',
          width: '100%',
        }}
      >
        <Box style={{ width: '100%' }}>
          {/*<Title order={5} pb={10}>*/}
          {/*  {row.original.name}*/}
          {/*</Title>*/}
          {/*<Box style={{ fontSize: '16px' }}>*/}
          {/*  <Text size={'sm'}>*/}
          {/*    Intitulé du Log :{' '}*/}
          {/*    <span style={{ fontWeight: 'bolder' }}>{row.original.name}</span>*/}
          {/*  </Text>*/}
          {/*  <Text size={'sm'}>*/}
          {/*    Téléphone :{' '}*/}
          {/*    <span style={{ fontWeight: 'bolder' }}>{row.original.phone}</span>*/}
          {/*  </Text>*/}
          {/*  <Text size={'sm'}>*/}
          {/*    Email :{' '}*/}
          {/*    <span style={{ fontWeight: 'bolder' }}>{row.original.email}</span>*/}
          {/*  </Text>*/}
          {/*</Box>*/}
        </Box>
      </Box>
    ),

    renderTopToolbarCustomActions: ({ table }) => (
      <>
        <Flex gap={8} justify={'flex-end'} align={'center'}>
          <Tooltip label="Rafraichir des données">
            <ActionIcon onClick={() => refetch()}>
              <IconRefresh />
            </ActionIcon>
          </Tooltip>
          <Menu
            shadow={'md'}
            // width={130}
            trigger="hover"
            openDelay={100}
            closeDelay={400}
          >
            <Menu.Target>
              <Button
                leftSection={<IconTableExport />}
                rightSection={<IconDownload size={14} />}
                variant={'filled'}
              >
                Exporter
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Format PDF</Menu.Label>
              <Menu.Item
                //export all rows, including from the next page, (still respects filtering and sorting)
                disabled={table.getPrePaginationRowModel().rows.length === 0}
                leftSection={<IconFileTypePdf />}
                onClick={() =>
                  handleExportRows(table.getPrePaginationRowModel().rows)
                }
              >
                Exporter tout
              </Menu.Item>
              <Menu.Item
                disabled={table.getRowModel().rows.length === 0}
                //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
                leftSection={<IconFileTypePdf />}
                onClick={() => handleExportRows(table.getRowModel().rows)}
              >
                Exporter la page
              </Menu.Item>
              <Menu.Item
                disabled={
                  !table.getIsSomeRowsSelected() &&
                  !table.getIsAllRowsSelected()
                }
                //only export selected rows
                leftSection={<IconFileTypePdf />}
                onClick={() =>
                  handleExportRows(table.getSelectedRowModel().rows)
                }
              >
                Exporter la selection
              </Menu.Item>
              <Menu.Divider />
              <Menu.Label>Format Excel</Menu.Label>
              <Menu.Item
                //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                onClick={handleExportDataAsCSV}
                leftSection={<IconFileTypeCsv />}
              >
                Exporter tout
              </Menu.Item>
              <Menu.Item
                disabled={table.getPrePaginationRowModel().rows.length === 0}
                //export all rows, including from the next page, (still respects filtering and sorting)
                onClick={() =>
                  handleExportRowsAsCSV(table.getPrePaginationRowModel().rows)
                }
                leftSection={<IconFileTypeCsv />}
              >
                Exporter toute les lignes
              </Menu.Item>
              <Menu.Item
                disabled={table.getRowModel().rows.length === 0}
                //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
                onClick={() => handleExportRowsAsCSV(table.getRowModel().rows)}
                leftSection={<IconFileTypeCsv />}
              >
                Exporter toutes la pages
              </Menu.Item>
              <Menu.Item
                disabled={
                  !table.getIsSomeRowsSelected() &&
                  !table.getIsAllRowsSelected()
                }
                //only export selected rows
                onClick={() =>
                  handleExportRowsAsCSV(table.getSelectedRowModel().rows)
                }
                leftSection={<IconFileTypeCsv />}
              >
                Exporter la selection
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Flex>
      </>
    ),
    // onRowSelectionChange: setRowSelection,
    // rowCount: totalRowCount,
    state: {
      columnFilterFns,
      columnFilters,
      globalFilter,
      isLoading: isLoading,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      pagination,
      sorting,
    },
  });

  return <MantineReactTable table={table} />;
};

const queryClient = new QueryClient();

const LogTable = () => (
  //Put this with your other react-query providers near root of your app
  <QueryClientProvider client={queryClient}>
    <Section />
  </QueryClientProvider>
);

export default LogTable;
