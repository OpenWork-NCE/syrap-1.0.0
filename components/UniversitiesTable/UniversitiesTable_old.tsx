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
import { fakeData } from './makeData';
import { type UniversityContext as University } from './makeData';
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
    localization: fake.localization,
    created_user: fake.created_user,
    ipes_count: fake.ipes_count,
    global_matching: fake.global_matching,
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

  const handleExportRows = (rows: MRT_Row<University>[]) => {
    const doc = new jsPDF();
    const tableData = rows.map((row) => Object.values(row.original));
    const tableHeaders = columns.map((c) => c.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    });

    doc.save('syrap-universities.pdf');
  };

  const handleExportRowsAsCSV = (rows: MRT_Row<University>[]) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportDataAsCSV = () => {
    const csv = generateCsv(csvConfig)(mocksDatas);
    download(csvConfig)(csv);
  };

  const columns = useMemo<MRT_ColumnDef<University>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Université',

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
        accessorKey: 'ipes_count',
        header: 'Nbre IPES sous tutelle',
        Edit: () => null,
        enableHiding: true,
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
        accessorKey: 'localization',
        header: 'Localisation',
        mantineEditTextInputProps: {
          type: 'text',
          required: true,
          error: validationErrors?.localization,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              localization: undefined,
            }),
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
  const { mutateAsync: createUniversity, isPending: isCreatingUniversity } =
    useCreateUniversity();
  //call READ hook
  const {
    data: fetchedUniversities = [],
    isError: isLoadingUniversityError,
    isFetching: isFetchingUniversity,
    isLoading: isLoadingUniversity,
  } = useGetUniversities();
  //call UPDATE hook
  const { mutateAsync: updateUniversity, isPending: isUpdatingUniversity } =
    useUpdateUniversity();
  //call DELETE hook
  const { mutateAsync: deleteUniversity, isPending: isDeletingUniversity } =
    useDeleteUniversity();

  //CREATE action
  const handleCreateUniversity: MRT_TableOptions<University>['onCreatingRowSave'] =
    async ({ values, exitCreatingMode }) => {
      const newValidationErrors = validateUniversity(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      await createUniversity(values);
      exitCreatingMode();
    };

  //UPDATE action
  const handleSaveUniversity: MRT_TableOptions<University>['onEditingRowSave'] =
    async ({ values, table }) => {
      const newValidationErrors = validateUniversity(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      await updateUniversity(values);
      table.setEditingRow(null); //exit editing mode
    };

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<University>) =>
    modals.openConfirmModal({
      title: 'Etes vous sur de vouloir supprimer cette Université ?',
      children: (
        <Text>
          Etes vous sure de vouloir supprimer {row.original.name}? Cette action
          est irreversible.
        </Text>
      ),
      labels: { confirm: 'Supprimer', cancel: 'Annuler' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteUniversity(row.original.id),
    });

  const table = useMantineReactTable({
    columns,
    data: fetchedUniversities,
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
    // enableColumnPinning: true,
    enableGrouping: true,
    enablePagination: true,
    initialState: {
      density: 'xs',
      columnVisibility: {
        id: false,
        created_user: false,
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
      placeholder: 'Rechercher des Universités',
    },
    // renderTopToolbarCustomActions: ({ table }) => (
    //
    // ),
    getRowId: (row) => row.id,
    mantineToolbarAlertBannerProps: isLoadingUniversityError
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
    onCreatingRowSave: handleCreateUniversity,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveUniversity,
    renderCreateRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Nouvelle Université</Title>
        {internalEditComponents}
        <Flex justify="flex-end" mt="xl">
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </Flex>
      </Stack>
    ),
    renderEditRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Editer l'Université</Title>
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
              Intitulé de l'Université :{' '}
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
              Nombre d'IPES sous tutelle :{' '}
              <span style={{ fontWeight: 'bolder' }}>
                {row.original.ipes_count}
              </span>
            </Text>
            <Text size={'sm'}>
              Nombre de filières :{' '}
              <span style={{ fontWeight: 'bolder' }}>
                {row.original.branch_count}
              </span>
            </Text>
            <Text size={'sm'}>
              Nombre de niveaux :{' '}
              <span style={{ fontWeight: 'bolder' }}>
                {row.original.level_count}
              </span>
            </Text>
            <Divider pb={1} mb={10} />
            <Button
              leftSection={<IconEye />}
              onClick={() => {
                push(
                  PATH_SECTIONS.universities.university_details(
                    row.original.id,
                  ),
                );
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
            Nouvelle Université
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
      isLoading: isLoadingUniversity,
      isSaving:
        isCreatingUniversity || isUpdatingUniversity || isDeletingUniversity,
      showAlertBanner: isLoadingUniversityError,
      showProgressBars: isFetchingUniversity,
    },
  });

  return <MantineReactTable table={table} />;
};

//CREATE hook (post new user to api)
function useCreateUniversity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: University) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newUniversityInfo: University) => {
      queryClient.setQueryData(
        ['users'],
        (prevUniversities: any) =>
          [
            ...prevUniversities,
            {
              ...newUniversityInfo,
              id: (Math.random() + 1).toString(36).substring(7),
            },
          ] as University[],
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}

//READ hook (get users from api)
function useGetUniversities() {
  return useQuery<University[]>({
    queryKey: ['universities'],
    queryFn: async () => {
      //send api request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve(
        fakeData.map((fake) => {
          return {
            id: fake.id,
            name: fake.name,
            phone: fake.phone,
            email: fake.email,
            localization: fake.localization,
            created_user: fake.created_user,
            ipes_count: fake.ipes_count,
            global_matching: fake.global_matching,
            branch_count: fake.branch_count,
            level_count: fake.level_count,
          };
        }),
      );
    },
    refetchOnWindowFocus: false,
  });
}

//UPDATE hook (put user in api)
function useUpdateUniversity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: University) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newUniversityInfo: University) => {
      queryClient.setQueryData(
        ['users'],
        (prevUniversities: any) =>
          prevUniversities?.map((prevUniversity: University) =>
            prevUniversity.id === newUniversityInfo.id
              ? newUniversityInfo
              : prevUniversity,
          ),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}

//DELETE hook (delete user in api)
function useDeleteUniversity() {
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
        ['users'],
        (prevUniversities: any) =>
          prevUniversities?.filter((user: University) => user.id !== userId),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}

const queryClient = new QueryClient();

const UniversityTable = () => (
  //Put this with your other react-query providers near root of your app
  <QueryClientProvider client={queryClient}>
    <ModalsProvider>
      <Section />
    </ModalsProvider>
  </QueryClientProvider>
);

export default UniversityTable;

const validateRequired = (value: string) => !!value.length;
const validateEmail = (email: string) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

function validateUniversity(universities: University) {
  return {
    name: !validateRequired(universities.name)
      ? "L'intitulé de l'Université est requis"
      : '',
    phone: !validateRequired(universities.phone)
      ? "Le nombre d'heures est requis : "
      : '',
    email: !validateEmail(universities.email)
      ? "L'intitulé de l'Université est requis"
      : '',
    localization: !validateRequired(universities.localization)
      ? "Le nombre d'heures est requis : "
      : '',
  };
}
