'use client';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css'; //if using mantine date picker features
import 'mantine-react-table/styles.css'; //make sure MRT styles were imported in your app root (once)
import { useMemo, useState } from 'react';
import {
  MRT_EditActionButtons,
  MantineReactTable,
  // createRow,
  type MRT_ColumnDef,
  type MRT_Row,
  type MRT_TableOptions,
  useMantineReactTable,
} from 'mantine-react-table';
import {
  ActionIcon,
  Box,
  Menu,
  Button,
  Flex,
  Stack,
  Text,
  Title,
  Tooltip,
  Divider,
} from '@mantine/core';
import { ModalsProvider, modals } from '@mantine/modals';
import {
  IconBook,
  IconDownload,
  IconEdit,
  IconFileTypeCsv,
  IconFileTypePdf,
  IconPlus,
  IconTableExport,
  IconTrash,
} from '@tabler/icons-react';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { type Level } from '@/types';
import { jsPDF } from 'jspdf'; //or use your library of choice here
import autoTable from 'jspdf-autotable';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { masterInformaticsProgram } from './makeData';

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});

type LevelTableProps = {
  datas: Level[] | undefined;
};

const Section = ({ fakeData }: { fakeData: Level[] }) => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const handleExportRows = (rows: MRT_Row<Level>[]) => {
    const doc = new jsPDF();
    const tableData = rows.map((row) => Object.values(row.original));
    const tableHeaders = columns.map((c) => c.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    });

    doc.save('syrap-level.pdf');
  };

  const handleExportRowsAsCSV = (rows: MRT_Row<Level>[]) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportDataAsCSV = () => {
    const csv = generateCsv(csvConfig)(fakeData);
    download(csvConfig)(csv);
  };

  const columns = useMemo<MRT_ColumnDef<Level>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Identifiant',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'name',
        header: 'Niveau',

        mantineEditTextInputProps: {
          type: 'text',
          required: true,
          error: validationErrors?.name,
          //remove any previous validation errors when level focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              name: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
    ],
    [validationErrors],
  );

  //call CREATE hook
  const { mutateAsync: createLevel, isPending: isCreatingLevel } =
    useCreateLevel();
  //call UPDATE hook
  const { mutateAsync: updateLevel, isPending: isUpdatingLevel } =
    useUpdateLevel();
  //call DELETE hook
  const { mutateAsync: deleteLevel, isPending: isDeletingLevel } =
    useDeleteLevel();

  //CREATE action
  const handleCreateLevel: MRT_TableOptions<Level>['onCreatingRowSave'] =
    async ({ values, exitCreatingMode }) => {
      const newValidationErrors = validateLevel(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      await createLevel(values);
      exitCreatingMode();
    };

  //UPDATE action
  const handleSaveLevel: MRT_TableOptions<Level>['onEditingRowSave'] = async ({
    values,
    table,
  }) => {
    const newValidationErrors = validateLevel(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateLevel(values);
    table.setEditingRow(null); //exit editing mode
  };

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<Level>) =>
    modals.openConfirmModal({
      title: 'Etes vous sur de vouloir supprimer ce niveau ?',
      children: (
        <Text>
          Etes vous sure de vouloir supprimer {row.original.name}? Cette action
          est irreversible.
        </Text>
      ),
      labels: { confirm: 'Supprimer', cancel: 'Annuler' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteLevel(row.original.id),
    });

  const table = useMantineReactTable({
    columns,
    data: fakeData,
    createDisplayMode: 'row', //default ('row', and 'custom' are also available)
    editDisplayMode: 'row', //default ('row', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
    enableRowSelection: true,
    positionToolbarAlertBanner: 'bottom',
    positionActionsColumn: 'last',
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableDensityToggle: true,
    enableGlobalFilterModes: true,
    enableMultiRowSelection: true,
    enableFacetedValues: true,
    enableRowNumbers: true,
    enableRowActions: true,
    enableColumnPinning: true,
    enableGrouping: true,
    enablePagination: true,
    initialState: {
      density: 'xs',
      columnVisibility: {
        id: false,
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
      placeholder: 'Rechercher un Niveau',
    },
    // renderTopToolbarCustomActions: ({ table }) => (
    //
    // ),
    getRowId: (row) => row.id,
    // mantineToolbarAlertBannerProps: isLoadingLevelError
    //   ? {
    //       color: 'red',
    //       children: 'Erreur de chargement des données',
    //     }
    //   : undefined,
    mantineTableContainerProps: {
      style: {
        minHeight: '500px',
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateLevel,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveLevel,
    renderCreateRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Nouveau Niveau de Filière</Title>
        {internalEditComponents}
        <Flex justify="flex-end" mt="xl">
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </Flex>
      </Stack>
    ),
    renderEditRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Editer le niveau</Title>
        {internalEditComponents}
        <Flex justify="flex-end" mt="xl">
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </Flex>
      </Stack>
    ),

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
          <Title order={5}>{row.original.name}</Title>
          <Divider pb={1} mb={10} />
          <Box style={{ fontSize: '16px' }}>
            <Text size={'sm'}>
              Identifiant Unique :{' '}
              <span style={{ fontWeight: 'bolder' }}>{row.original.id}</span>
            </Text>
            <Text size={'sm'}>
              Intitulé du niveau :{' '}
              <span style={{ fontWeight: 'bolder' }}>{row.original.name}</span>
            </Text>
            <Divider pb={1} mb={10} />
            <Button leftSection={<IconBook />}>Aller aux programmes</Button>
          </Box>
        </Box>
      </Box>
    ),

    renderRowActions: ({ row, table }) => (
      <Flex gap="md">
        {/*<Tooltip label="Details">*/}
        {/*  <ActionIcon onClick={() => table.setEditingRow(row)}>*/}
        {/*    <IconDetails />*/}
        {/*  </ActionIcon>*/}
        {/*</Tooltip>*/}
        <Tooltip label="Editer">
          <ActionIcon color={'green'} onClick={() => table.setEditingRow(row)}>
            <IconEdit />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Supprimer">
          <ActionIcon color="red" onClick={() => openDeleteConfirmModal(row)}>
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      </Flex>
    ),

    renderTopToolbarCustomActions: ({ table }) => (
      <>
        <Flex gap={4} justify={'flex-end'}>
          <Button
            onClick={() => {
              table.setCreatingRow(true); //simplest way to open the create row modal with no default values
              //or you can pass in a row object to set default values with the `createRow` helper function
              // table.setCreatingRow(
              //   createRow(table, {
              //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
              //   }),
              // );
            }}
            leftSection={<IconPlus />}
          >
            Nouveau Niveau
          </Button>
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
    state: {
      // isLoading: isLoadingLevel,
      isSaving: isCreatingLevel || isUpdatingLevel || isDeletingLevel,
      // showAlertBanner: isLoadingLevelError,
      // showProgressBars: isFetchingLevel,
    },
  });

  return <MantineReactTable table={table} />;
};

//CREATE hook (post new level to api)
function useCreateLevel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (level: Level) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newLevelInfo: Level) => {
      queryClient.setQueryData(
        ['levels'],
        (prevLevels: any) =>
          [
            ...prevLevels,
            {
              ...newLevelInfo,
              id: (Math.random() + 1).toString(36).substring(7),
            },
          ] as Level[],
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['levels'] }), //refetch levels after mutation, disabled for demo
  });
}

//UPDATE hook (put level in api)
function useUpdateLevel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (level: Level) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newLevelInfo: Level) => {
      queryClient.setQueryData(
        ['levels'],
        (prevLevels: any) =>
          prevLevels?.map((prevLevel: Level) =>
            prevLevel.id === newLevelInfo.id ? newLevelInfo : prevLevel,
          ),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['levels'] }), //refetch levels after mutation, disabled for demo
  });
}

//DELETE hook (delete level in api)
function useDeleteLevel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (levelId: string) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (levelId: string) => {
      queryClient.setQueryData(
        ['levels'],
        (prevLevels: any) =>
          prevLevels?.filter((level: Level) => level.id !== levelId),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['levels'] }), //refetch levels after mutation, disabled for demo
  });
}

const queryClient = new QueryClient();

const LevelTable = ({ datas }: LevelTableProps) => (
  //Put this with your other react-query providers near root of your app
  <QueryClientProvider client={queryClient}>
    <ModalsProvider>
      <Section fakeData={datas === undefined ? [] : datas} />
    </ModalsProvider>
  </QueryClientProvider>
);

export default LevelTable;

const validateRequired = (value: string) => !!value.length;

function validateLevel(level: Level) {
  return {
    name: !validateRequired(level.name)
      ? "L'intitulé du niveau est requis"
      : '',
  };
}
