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
  IconDetails,
  IconDownload,
  IconEdit,
  IconEye,
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
import { fakeData, type IpesContext as Ipes } from './makeData';
import { jsPDF } from 'jspdf'; //or use your library of choice here
import autoTable from 'jspdf-autotable';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { useRouter } from 'next/navigation';
import { PATH_SECTIONS } from '@/routes';

const mocksDatas: any = fakeData.map((fake) => {
  return {
    id: fake.id,
    name: fake.name,
    phone: fake.phone,
    email: fake.email,
    borough: fake.borough,
    created_user: fake.created_user,
    university: fake.university,
    decret_of_creation: fake.decret_of_creation,
    opening_stop: fake.opening_stop,
    promoter: fake.promoter,
    matching: fake.matching,
    branch_count: fake.branch_count,
    level_count: fake.level_count,
  };
});

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});

const Section = () => {
  const { push } = useRouter();
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const handleExportRows = (rows: MRT_Row<Ipes>[]) => {
    const doc = new jsPDF();
    const tableData = rows.map((row) => Object.values(row.original));
    const tableHeaders = columns.map((c) => c.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    });

    doc.save('syrap-ipeses.pdf');
  };

  const handleExportRowsAsCSV = (rows: MRT_Row<Ipes>[]) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportDataAsCSV = () => {
    const csv = generateCsv(csvConfig)(mocksDatas);
    download(csvConfig)(csv);
  };

  const columns = useMemo<MRT_ColumnDef<Ipes>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'N°',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'name',
        header: 'IPES',

        mantineEditTextInputProps: {
          type: 'text',
          required: true,
          error: validationErrors?.name,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              name: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        id: 'global_matching',
        header: 'Université Tutelle',
        columns: [
          {
            accessorKey: 'matching',
            header: 'Score Matching',
            size: 200,
            filterVariant: 'range-slider',
            enableEditing: false,
            Edit: () => null,

            mantineFilterRangeSliderProps: {
              color: 'blue',

              // label: (value) =>
              //   value?.toLocaleString?.('fr-FR', {
              //     minimumFractionDigits: 0,
              //     maximumFractionDigits: 0,
              //   }),
            },
            //custom conditional format and styling
            Cell: ({ cell }) => (
              <Box
                style={(theme) => ({
                  backgroundColor:
                    cell.getValue<number>() < 40
                      ? theme.colors.red[9]
                      : cell.getValue<number>() >= 40 &&
                          cell.getValue<number>() < 65
                        ? theme.colors.yellow[9]
                        : theme.colors.green[9],
                  borderRadius: '4px',
                  color: '#fff',
                  maxWidth: '9ch',
                  padding: '4px',
                  textAlign: 'center',
                })}
              >
                {cell.getValue<number>()?.toLocaleString?.('fr-FR', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
                %
              </Box>
            ),
          },
        ],
      },
      {
        accessorKey: 'phone',
        header: 'Téléphone',
        enableHiding: true,
        mantineEditTextInputProps: {
          type: 'tel',
          required: true,
          error: validationErrors?.phone,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              phone: undefined,
            }),
        },
      },
      {
        accessorKey: 'email',
        header: 'Email',
        mantineEditTextInputProps: {
          type: 'email',
          required: true,
          error: validationErrors?.email,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              email: undefined,
            }),
        },
      },
      {
        accessorKey: 'borough',
        header: 'Adresse',
        mantineEditTextInputProps: {
          type: 'text',
          required: true,
          error: validationErrors?.borough,
          //remove any previous validation errors when ipes focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              borough: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: 'created_user',
        header: 'Créé par',
        Edit: () => null,
        mantineEditTextInputProps: {
          type: 'text',
          required: true,
          error: validationErrors?.created_user,
          //remove any previous validation errors when ipes focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              created_user: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: 'university',
        header: 'Université Tutelle',
        mantineEditTextInputProps: {
          type: 'text',
          required: true,
          error: validationErrors?.university,
          //remove any previous validation errors when ipes focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              university: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: 'decret_of_creation',
        header: 'Décrêt de creation',
        mantineEditTextInputProps: {
          type: 'file',
          required: false,
          error: validationErrors?.decret_of_create,
          //remove any previous validation errors when ipes focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              decret_of_create: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: 'opening_stop',
        header: 'Arreté de creation',
        mantineEditTextInputProps: {
          type: 'file',
          required: false,
          error: validationErrors?.opening_stop,
          //remove any previous validation errors when ipes focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              opening_stop: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: 'promoter',
        header: 'Recteur',
        mantineEditTextInputProps: {
          type: 'text',
          required: true,
          error: validationErrors?.promoter,
          //remove any previous validation errors when ipes focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              promoter: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      // {
      //   accessorKey: 'state',
      //   header: 'State',
      //   editVariant: 'select',
      //   mantineEditSelectProps: {
      //     data: usStates,
      //     error: validationErrors?.state,
      //   },
      // },
    ],
    [validationErrors],
  );

  //call CREATE hook
  const { mutateAsync: createIpes, isPending: isCreatingIpes } =
    useCreateIpes();
  //call READ hook
  const {
    data: fetchedIpeses = [],
    isError: isLoadingIpesError,
    isFetching: isFetchingIpes,
    isLoading: isLoadingIpes,
  } = useGetIpeses();
  //call UPDATE hook
  const { mutateAsync: updateIpes, isPending: isUpdatingIpes } =
    useUpdateIpes();
  //call DELETE hook
  const { mutateAsync: deleteIpes, isPending: isDeletingIpes } =
    useDeleteIpes();

  //CREATE action
  const handleCreateIpes: MRT_TableOptions<Ipes>['onCreatingRowSave'] = async ({
    values,
    exitCreatingMode,
  }) => {
    const newValidationErrors = validateIpes(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createIpes(values);
    exitCreatingMode();
  };

  //UPDATE action
  const handleSaveIpes: MRT_TableOptions<Ipes>['onEditingRowSave'] = async ({
    values,
    table,
  }) => {
    const newValidationErrors = validateIpes(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateIpes(values);
    table.setEditingRow(null); //exit editing mode
  };

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<Ipes>) =>
    modals.openConfirmModal({
      title: 'Etes vous sur de vouloir supprimer cette IPES ?',
      children: (
        <Text>
          Etes vous sure de vouloir supprimer {row.original.name}? Cette action
          est irreversible.
        </Text>
      ),
      labels: { confirm: 'Supprimer', cancel: 'Annuler' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteIpes(row.original.id),
    });

  const table = useMantineReactTable({
    columns,
    data: fetchedIpeses,
    createDisplayMode: 'modal', //default ('row', and 'custom' are also available)
    editDisplayMode: 'modal', //default ('row', 'cell', 'table', and 'custom' are also available)
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
        created_user: false,
        phone: false,
        email: false,
        decret_of_creation: false,
        opening_stop: false,
      },
      columnPinning: {
        left: ['mrt-row-select'],
        right: ['mrt-row-actions', 'mrt-row-expand'],
      },
      pagination: {
        pageIndex: 0,
        pageSize: 20,
      },
    },

    mantineSearchTextInputProps: {
      placeholder: 'Rechercher des IPESs',
    },
    // renderTopToolbarCustomActions: ({ table }) => (
    //
    // ),
    getRowId: (row) => row.id,
    mantineToolbarAlertBannerProps: isLoadingIpesError
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
    onCreatingRowSave: handleCreateIpes,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveIpes,
    renderCreateRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Nouvel IPES</Title>
        {internalEditComponents}
        <Flex justify="flex-end" mt="xl">
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </Flex>
      </Stack>
    ),
    renderEditRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Editer l'IPES</Title>
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
          width: '100%',
        }}
      >
        <Box style={{ width: '100%' }}>
          <Title order={5} pb={10}>
            {row.original.name}
          </Title>
          <Box style={{ fontSize: '16px' }}>
            <Text size={'sm'}>
              Identifiant Unique :{' '}
              <span style={{ fontWeight: 'bolder' }}>{row.original.id}</span>
            </Text>
            <Text size={'sm'}>
              Intitulé de l'IPES :{' '}
              <span style={{ fontWeight: 'bolder' }}>{row.original.name}</span>
            </Text>
            <Text size={'sm'}>
              Téléphone :{' '}
              <span style={{ fontWeight: 'bolder' }}>{row.original.phone}</span>
            </Text>
            <Text size={'sm'}>
              Email :{' '}
              <span style={{ fontWeight: 'bolder' }}>{row.original.email}</span>
            </Text>
            <Text size={'sm'}>
              Créé par :{' '}
              <span style={{ fontWeight: 'bolder' }}>
                {row.original.created_user}
              </span>
            </Text>
            <Text size={'sm'}>
              Addresse :{' '}
              <span style={{ fontWeight: 'bolder' }}>
                {row.original.borough}
              </span>
            </Text>
            <Text size={'sm'}>
              Université de tutelle :{' '}
              <span style={{ fontWeight: 'bolder' }}>
                {row.original.university}
              </span>
            </Text>
            <Text size={'sm'}>
              Promoteur :{' '}
              <span style={{ fontWeight: 'bolder' }}>
                {row.original.promoter}
              </span>
            </Text>
            <Text size={'sm'}>
              Matching Global avec l'université de tutelle :{' '}
              <span style={{ fontWeight: 'bolder' }}>
                {row.original.matching}%
              </span>
            </Text>
            <Divider pb={1} mb={10} />
            <Button
              leftSection={<IconEye />}
              onClick={() => {
                push(PATH_SECTIONS.ipes.ipes_details(row.original.id));
              }}
            >
              Details
            </Button>
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
            Nouvelle Ipes
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
      isLoading: isLoadingIpes,
      isSaving: isCreatingIpes || isUpdatingIpes || isDeletingIpes,
      showAlertBanner: isLoadingIpesError,
      showProgressBars: isFetchingIpes,
    },
  });

  return <MantineReactTable table={table} />;
};

//CREATE hook (post new user to api)
function useCreateIpes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: Ipes) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newIpesInfo: Ipes) => {
      queryClient.setQueryData(
        ['ipeses'],
        (prevIpeses: any) =>
          [
            ...prevIpeses,
            {
              ...newIpesInfo,
              id: (Math.random() + 1).toString(36).substring(7),
            },
          ] as Ipes[],
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['ipeses'] }), //refetch ipeses after mutation, disabled for demo
  });
}

//READ hook (get ipeses from api)
function useGetIpeses() {
  return useQuery<Ipes[]>({
    queryKey: ['ipeses'],
    queryFn: async () => {
      //send api request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve(fakeData);
    },
    refetchOnWindowFocus: false,
  });
}

//UPDATE hook (put user in api)
function useUpdateIpes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: Ipes) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newIpesInfo: Ipes) => {
      queryClient.setQueryData(
        ['ipeses'],
        (prevIpeses: any) =>
          prevIpeses?.map((prevIpes: Ipes) =>
            prevIpes.id === newIpesInfo.id ? newIpesInfo : prevIpes,
          ),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['ipeses'] }), //refetch ipeses after mutation, disabled for demo
  });
}

//DELETE hook (delete user in api)
function useDeleteIpes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ueId: string) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (userId: string) => {
      queryClient.setQueryData(
        ['ipeses'],
        (prevIpeses: any) =>
          prevIpeses?.filter((user: Ipes) => user.id !== userId),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['ipeses'] }), //refetch ipeses after mutation, disabled for demo
  });
}

const queryClient = new QueryClient();

const IpesTable = () => (
  //Put this with your other react-query providers near root of your app
  <QueryClientProvider client={queryClient}>
    <ModalsProvider>
      <Section />
    </ModalsProvider>
  </QueryClientProvider>
);

export default IpesTable;

const validateRequired = (value: string) => !!value.length;
const validateRequiredNumber = (value: number) => !!value;
const validateEmail = (email: string) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

function validateIpes(ipeses: Ipes) {
  return {
    name: !validateRequired(ipeses.name) ? "Intitulé de l'IPES requis" : '',
    phone: !validateRequired(ipeses.phone) ? 'Téléphone requis' : '',
    email: !validateEmail(ipeses.email) ? 'Format Email incorrect' : '',
    borough: !validateRequired(ipeses.borough) ? 'Adresse requise' : '',
    creator_user: !validateRequired(ipeses.created_user) ? 'Requis' : '',
    university: !validateRequired(ipeses.university) ? 'Requis' : '',
    promoter: !validateRequired(ipeses.promoter) ? 'Requis' : '',
  };
}
