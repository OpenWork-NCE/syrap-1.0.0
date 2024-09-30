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
  useCombobox,
  ComboboxData,
} from '@mantine/core';
import { ModalsProvider, modals } from '@mantine/modals';
import {
  IconDetails,
  IconDownload,
  IconEdit,
  IconFileExport,
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
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { fakeData, structuredData, type Ues } from './makeData';
// import { type Ues } from '@/types';
import { jsPDF } from 'jspdf'; //or use your library of choice here
import autoTable from 'jspdf-autotable';
import { mkConfig, generateCsv, download } from 'export-to-csv';

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});

const Section = () => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const handleExportRows = (rows: MRT_Row<Ues>[]) => {
    const doc = new jsPDF();
    const tableData = rows.map((row) => Object.values(row.original));
    const tableHeaders = columns.map((c) => c.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    });

    doc.save('syrap-ues.pdf');
  };

  const handleExportRowsAsCSV = (rows: MRT_Row<Ues>[]) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportDataAsCSV = () => {
    const csv = generateCsv(csvConfig)(fakeData);
    download(csvConfig)(csv);
  };

  const columns = useMemo<MRT_ColumnDef<Ues>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'N°',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'ue_name',
        header: 'UE',

        mantineEditTextInputProps: {
          type: 'text',
          required: true,
          error: validationErrors?.ue_name,
          //remove any previous validation errors when ue focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              ue_name: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: 'slug',
        header: 'Intitulé',
        enableHiding: true,
        mantineEditTextInputProps: {
          type: 'text',
          required: true,
          error: validationErrors?.slug,
          //remove any previous validation errors when ue focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              slug: undefined,
            }),
        },
      },
      {
        accessorKey: 'nbr_hours',
        header: 'Nombre Heures',
        mantineEditTextInputProps: {
          type: 'text',
          required: true,
          error: validationErrors?.nbr_hours,
          //remove any previous validation errors when ue focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              nbr_hours: undefined,
            }),
        },
      },
      {
        accessorKey: 'description',
        header: 'Description',
        mantineEditTextInputProps: {
          type: 'text',
          required: true,
          error: validationErrors?.description,
          //remove any previous validation errors when ue focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              description: undefined,
            }),
        },
      },
      {
        accessorKey: 'ue_creator',
        header: 'Utilisateur Createur',
        mantineEditTextInputProps: {
          type: 'text',
          required: true,
          error: validationErrors?.ue_creator,
          //remove any previous validation errors when ue focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              ue_creator: undefined,
            }),
        },
      },
      {
        accessorKey: 'module',
        header: 'Module',
        editVariant: 'select',
        mantineEditSelectProps: (props) => {
          const { row } = props;

          const modules = structuredData
            .find((u: any) => u.ipes === row.original.ipes)
            ?.branches.find((b: any) => b.branch === row.original.branch)
            ?.levels.find((l: any) => l.level === row.original.level)?.modules;

          return {
            data: modules,
            error: validationErrors?.module,
          };
        },
      },
      {
        accessorKey: 'level',
        header: 'Niveau',
        editVariant: 'select',
        mantineEditSelectProps: (props) => {
          const { row } = props;

          const levels =
            structuredData
              .find((u: any) => u.ipes === row.original.ipes)
              ?.branches.find((b: any) => b.branch === row.original.branch)
              ?.levels ?? [];

          let returns = [];
          for (let i = 0; i < levels.length; i++) {
            returns.push(levels[i].level);
          }

          return {
            data: returns,
            error: validationErrors?.level,
          };
        },
      },
      {
        accessorKey: 'branch',
        header: 'Filière',
        editVariant: 'select',
        mantineEditSelectProps: (props) => {
          const { row } = props;

          const branches =
            structuredData.find((u: any) => u.ipes === row.original.ipes)
              ?.branches ?? [];

          let returns = [];
          for (let i = 0; i < branches.length; i++) {
            returns.push(branches[i].branch);
          }

          return {
            data: returns,
            error: validationErrors?.branch,
          };
        },
      },
      {
        accessorKey: 'ipes',
        header: 'Ipes',
        editVariant: 'select',
        mantineEditSelectProps: (props) => {
          const { row } = props;

          const extract =
            structuredData.find((u: any) => u.ipes === row.original.ipes)
              ?.ipes ?? '';
          const ipes = [extract];

          return {
            data: ipes,
            error: validationErrors?.ipes,
          };
        },
      },
    ],
    [validationErrors],
  );

  //call CREATE hook
  const { mutateAsync: createUE, isPending: isCreatingUE } = useCreateUe();
  //call READ hook
  const {
    data: fetchedUes = [],
    isError: isLoadingUEError,
    isFetching: isFetchingUE,
    isLoading: isLoadingUE,
  } = useGetUes();
  //call UPDATE hook
  const { mutateAsync: updateUE, isPending: isUpdatingUE } = useUpdateUe();
  //call DELETE hook
  const { mutateAsync: deleteUe, isPending: isDeletingUe } = useDeleteUe();

  //CREATE action
  const handleCreateUe: MRT_TableOptions<Ues>['onCreatingRowSave'] = async ({
    values,
    exitCreatingMode,
  }) => {
    const newValidationErrors = validateUe(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createUE(values);
    exitCreatingMode();
  };

  //UPDATE action
  const handleSaveUe: MRT_TableOptions<Ues>['onEditingRowSave'] = async ({
    values,
    table,
  }) => {
    const newValidationErrors = validateUe(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateUE(values);
    table.setEditingRow(null); //exit editing mode
  };

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<Ues>) =>
    modals.openConfirmModal({
      title: 'Etes vous sur de vouloir supprimer cette UE ?',
      children: (
        <Text>
          Etes vous sure de vouloir supprimer {row.original.ue_name}? Cette
          action ne peut pas être defaite.
        </Text>
      ),
      labels: { confirm: 'Supprimer', cancel: 'Annuler' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteUe(row.original.id),
    });

  const table = useMantineReactTable({
    columns,
    data: fetchedUes,
    createDisplayMode: 'modal', //default ('row', and 'custom' are also available)
    editDisplayMode: 'modal', //default ('row', 'cell', 'table', and 'custom' are also available)
    // enableEditing: true,
    enableExpanding: true,
    enableRowSelection: true,
    positionToolbarAlertBanner: 'bottom',
    positionActionsColumn: 'last',
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableDensityToggle: true,
    enableGlobalFilterModes: true,
    enableMultiRowSelection: true,
    enableFacetedValues: true,
    // enableRowNumbers: true,
    enableRowActions: true,
    // enableColumnPinning: true,
    enableGrouping: true,
    enablePagination: true,
    initialState: {
      density: 'md',
      grouping: ['ipes', 'branch', 'level'],
      columnVisibility: {
        id: false,
        slug: false,
        description: false,
        nbr_hours: false,
        ue_creator: false,
      },
      columnPinning: {
        left: ['mrt-row-select'],
        right: ['mrt-row-actions', 'mrt-row-expand'],
      },
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
    mantineTableProps: {
      highlightOnHover: false,
      striped: 'odd',
      withColumnBorders: true,
      withRowBorders: true,
      withTableBorder: true,
    },
    mantineSearchTextInputProps: {
      placeholder: 'Rechercher des UEs',
    },
    // renderTopToolbarCustomActions: ({ table }) => (
    //
    // ),
    getRowId: (row) => row.id,
    mantineToolbarAlertBannerProps: isLoadingUEError
      ? {
          color: 'red',
          children: 'Erreur de chargement des données',
        }
      : undefined,
    mantineTableContainerProps: {
      style: {
        minHeight: '500px',
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateUe,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveUe,
    renderCreateRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Nouvel UE pour la filière</Title>
        {internalEditComponents}
        <Flex justify="flex-end" mt="xl">
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </Flex>
      </Stack>
    ),
    renderEditRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Editer l'UE pour la filière</Title>
        {internalEditComponents}
        <Flex justify="flex-end" mt="xl">
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </Flex>
      </Stack>
    ),
    // renderRowActionMenuItems: ({ row, table }) => (
    //   <>
    //     <Menu.Item
    //       onClick={() => table.setEditingRow(row)}
    //       leftSection={<IconDetails />}
    //     >
    //       Details
    //     </Menu.Item>
    //     <Menu.Item
    //       onClick={() => table.setEditingRow(row)}
    //       leftSection={<IconEdit />}
    //     >
    //       Editer
    //     </Menu.Item>
    //     <Menu.Item
    //       onClick={() => openDeleteConfirmModal(row)}
    //       leftSection={<IconTrash />}
    //     >
    //       Supprimer
    //     </Menu.Item>
    //   </>
    // ),

    renderDetailPanel: ({ row }) => (
      <Box
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: '16px',
          padding: '16px',
        }}
      >
        <Box style={{}}>
          <Title order={5}>{row.original.ue_name}</Title>
          <Divider pb={1} mb={10} />
          <Box style={{ fontSize: '16px' }}>
            <Text size={'sm'}>
              Identifiant Unique :{' '}
              <span style={{ fontWeight: 'bolder' }}>{row.original.id}</span>
            </Text>
            <Text size={'sm'}>
              Intitulé de l'UE :{' '}
              <span style={{ fontWeight: 'bolder' }}>
                {row.original.ue_name}
              </span>
            </Text>
            <Text size={'sm'}>
              Description :{' '}
              <span style={{ fontWeight: 'bolder' }}>
                {row.original.description}
              </span>
            </Text>
            <Text size={'sm'}>
              Nombre d'heures :{' '}
              <span style={{ fontWeight: 'bolder' }}>
                {row.original.nbr_hours}
              </span>
            </Text>
            <Text size={'sm'}>
              Créé par :{' '}
              <span style={{ fontWeight: 'bolder' }}>
                {row.original.user_creator}
              </span>
            </Text>
            <Text size={'sm'}>
              Module :{' '}
              <span style={{ fontWeight: 'bolder' }}>
                {row.original.module}
              </span>
            </Text>
            <Text size={'sm'}>
              Niveau :{' '}
              <span style={{ fontWeight: 'bolder' }}>{row.original.level}</span>
            </Text>
            <Text size={'sm'}>
              Filière :{' '}
              <span style={{ fontWeight: 'bolder' }}>
                {row.original.module}
              </span>
            </Text>
            <Text size={'sm'}>
              Ipes :{' '}
              <span style={{ fontWeight: 'bolder' }}>{row.original.ipes}</span>
            </Text>
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
        {/*<Tooltip label="Editer">*/}
        {/*  <ActionIcon color={'green'} onClick={() => table.setEditingRow(row)}>*/}
        {/*    <IconEdit />*/}
        {/*  </ActionIcon>*/}
        {/*</Tooltip>*/}
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
            Nouvelle UE
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
      isLoading: isLoadingUE,
      isSaving: isCreatingUE || isUpdatingUE || isDeletingUe,
      showAlertBanner: isLoadingUEError,
      showProgressBars: isFetchingUE,
    },
  });

  return <MantineReactTable table={table} />;
};

//CREATE hook (post new ue to api)
function useCreateUe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ue: Ues) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newUeInfo: Ues) => {
      queryClient.setQueryData(
        ['ues'],
        (prevUes: any) =>
          [
            ...prevUes,
            {
              ...newUeInfo,
              id: (Math.random() + 1).toString(36).substring(7),
            },
          ] as Ues[],
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['ues'] }), //refetch ues after mutation, disabled for demo
  });
}

//READ hook (get ues from api)
function useGetUes() {
  return useQuery<Ues[]>({
    queryKey: ['ues'],
    queryFn: async () => {
      //send api request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve(fakeData);
    },
    refetchOnWindowFocus: false,
  });
}

//UPDATE hook (put ue in api)
function useUpdateUe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ue: Ues) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newUeInfo: Ues) => {
      queryClient.setQueryData(
        ['ues'],
        (prevUes: any) =>
          prevUes?.map((prevUe: Ues) =>
            prevUe.id === newUeInfo.id ? newUeInfo : prevUe,
          ),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['ues'] }), //refetch ues after mutation, disabled for demo
  });
}

//DELETE hook (delete ue in api)
function useDeleteUe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ueId: string) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (ueId: string) => {
      queryClient.setQueryData(
        ['ues'],
        (prevUes: any) => prevUes?.filter((ue: Ues) => ue.id !== ueId),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['ues'] }), //refetch ues after mutation, disabled for demo
  });
}

const queryClient = new QueryClient();

const SyllabusITable = () => (
  //Put this with your other react-query providers near root of your app
  <QueryClientProvider client={queryClient}>
    <ModalsProvider>
      <Section />
    </ModalsProvider>
  </QueryClientProvider>
);

export default SyllabusITable;

const validateRequired = (value: string) => !!value.length;
const validateRequiredNumber = (value: number) => !!value;
const validateEmail = (email: string) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

function validateUe(ues: Ues) {
  return {
    ue_name: !validateRequired(ues.ue_name)
      ? "L'intitulé de l'UE est requis"
      : '',
    nbr_hours: !validateRequiredNumber(ues.nbr_hours)
      ? "Le nombre d'heures est requis : "
      : '',
  };
}
