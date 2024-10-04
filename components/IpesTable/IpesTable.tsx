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
  MRT_TableOptions,
  MRT_EditActionButtons,
} from 'mantine-react-table';
import {
  ActionIcon,
  Tooltip,
  Text,
  Stack,
  Title,
  Flex,
  Box,
  Divider,
  Button,
  Menu,
  Select,
  TextInput,
} from '@mantine/core';
import {
  IconDownload,
  IconEdit,
  IconEye,
  IconFileTypeCsv,
  IconFileTypePdf,
  IconMail,
  IconPlus,
  IconRefresh,
  IconTableExport,
  IconTrash,
} from '@tabler/icons-react';
import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
  useQuery,
  useQueryClient,
  useMutation,
} from '@tanstack/react-query';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { modals, ModalsProvider } from '@mantine/modals';
import { PATH_SECTIONS } from '@/routes';
import { useRouter } from 'next/navigation';

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});

type Ipes = {
  id: string;
  name: string;
  code?: string;
  description?: string;
  phone?: string;
  email?: string;
  arrondissement_id: string;
  user_id?: string;
  cenadi_id?: string;
};

type IpesApiResponse = {
  data: Array<Ipes>;
  messages: Array<string>;
  success: string;
};

type Localization = {
  id: string;
  name: string;
};

type LocalizationApiResponse = {
  data: Array<Localization>;
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
const useGetIpeses = ({} // columnFilterFns,
// columnFilters,
// globalFilter,
// sorting,
// pagination,
: Params) => {
  //build the URL (https://www.mantine-react-table.com/api/data?start=0&size=10&filters=[]&globalFilter=&sorting=[])
  const fetchURL = new URL(
    '/api/ipeses',
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

  return useQuery<IpesApiResponse>({
    // queryKey: ['ipeses', fetchURL.href], //refetch whenever the URL changes (columnFilters, globalFilter, sorting, pagination)
    queryKey: ['ipeses'], //refetch whenever the URL changes (columnFilters, globalFilter, sorting, pagination)
    queryFn: () => fetch(fetchURL.href).then((res) => res.json()),
    placeholderData: keepPreviousData, //useful for paginated queries by keeping data from previous pages on screen while fetching the next page
    staleTime: 30_000, //don't refetch previously viewed pages until cache is more than 30 seconds old
  });
};

const useGetLocalizations = () => {
  //build the URL (https://www.mantine-react-table.com/api/data?start=0&size=10&filters=[]&globalFilter=&sorting=[])
  const fetchURL = new URL(
    '/api/boroughs',
    process.env.NODE_ENV === 'production'
      ? 'https://www.mantine-react-table.com'
      : 'http://localhost:3000',
  );

  return useQuery<LocalizationApiResponse>({
    queryKey: ['boroughs'], //refetch whenever the URL changes (columnFilters, globalFilter, sorting, pagination)
    queryFn: () => fetch(fetchURL.href).then((res) => res.json()),
    placeholderData: keepPreviousData, //useful for paginated queries by keeping data from previous pages on screen while fetching the next page
    staleTime: 30_000, //don't refetch previously viewed pages until cache is more than 30 seconds old
  });
};

const Section = () => {
  const { push } = useRouter();
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const {
    data: lData,
    isError: lIsError,
    isFetching: lIsFetching,
    isLoading: lIsLoading,
    refetch: lRefresh,
  } = useGetLocalizations();

  const fetchedLocalizations = lData?.data ?? [];

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
    const csv = generateCsv(csvConfig)(fetchedIpeses);
    download(csvConfig)(csv);
  };

  const columns = useMemo<MRT_ColumnDef<Ipes>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Sigle',

        mantineEditTextInputProps: {
          type: 'text',
          required: true,
          error: validationErrors?.code,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              code: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: 'name',
        header: 'Ipes',
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
        accessorKey: 'description',
        header: 'Description',
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
      // {
      //   accessorKey: 'ipes_count',
      //   header: 'Nbre IPES sous tutelle',
      //   Edit: () => null,
      //   enableHiding: true,
      // },
      {
        accessorKey: 'phone',
        header: 'Téléphone',
        enableHiding: true,
        mantineEditTextInputProps: {
          type: 'tel',
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
        editVariant: 'select',
        mantineEditSelectProps: {
          data: fetchedLocalizations.map((localization) => ({
            value: localization.id,
            label: localization.name,
          })),
        },
        // Cell: (props) => {
        //   const { row, cell, table, column } = props;
        //   const [selectedLocalization, setSelectedLocalization] = useState(
        //     cell.getValue() as string,
        //   );
        //
        //   // Find the corresponding arrondissement name based on the ID
        //   const selectedName = fetchedLocalizations.find(
        //     (localization) => localization.id === selectedLocalization,
        //   )?.name;
        //   return (
        //     <Select
        //       data={fetchedLocalizations.map((localization) => ({
        //         value: localization.id,
        //         label: localization.name,
        //       }))}
        //       value={selectedLocalization}
        //       onChange={(value) => {
        //         // Update the selected value (arrondissementId)
        //         setSelectedLocalization(value as string);
        //
        //         // Optional: Handle this change to update the table row data
        //         // Example: Update the row data in your state or pass the value to a handler
        //       }}
        //     />
        //   );
        // },
        // mantineEditTextInputProps: {
        //   type: 'text',
        //   required: true,
        //   error: validationErrors?.localization,
        //   //remove any previous validation errors when user focuses on the input
        //   onFocus: () =>
        //     setValidationErrors({
        //       ...validationErrors,
        //       localization: undefined,
        //     }),
        // },
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
  const { data, isError, isFetching, isLoading, refetch } = useGetIpeses({
    columnFilterFns,
    columnFilters,
    globalFilter,
    pagination,
    sorting,
  });

  //this will depend on your API response shape
  const fetchedIpeses = data?.data ?? [];
  console.log('Voici les arrondissements : ', fetchedLocalizations);
  // const totalRowCount = data?.meta?.totalRowCount ?? 0;

  //call CREATE hook
  const { mutateAsync: createIpes, isPending: isCreatingIpes } =
    useCreateIpes();
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
    console.log("VOici l'ipes : ", values);
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
    row,
  }) => {
    const newValidationErrors = validateIpes(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateIpes({
      id: row.id,
      code: values.code,
      name: values.name,
      phone: values.phone,
      email: values.email,
      arrondissement_id: values.localization,
      cenadi_id: values.cenadi_id,
      user_id: values.user_id,
    });
    table.setEditingRow(null); //exit editing mode
  };

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<Ipes>) =>
    modals.openConfirmModal({
      title: 'Etes vous sur de vouloir supprimer cette Ipes ?',
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
    mantineSearchTextInputProps: {
      placeholder: 'Rechercher des Ipess',
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
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateIpes,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveIpes,

    onColumnFilterFnsChange: setColumnFilterFns,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    renderCreateRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Nouvel Ipes</Title>
        {internalEditComponents}
        <Flex justify="flex-end" mt="xl">
          <MRT_EditActionButtons variant={'text'} table={table} row={row} />
        </Flex>
      </Stack>
    ),
    renderEditRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Editer l'Ipes</Title>
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
          <Title order={5} pb={10}>
            {row.original.name}
          </Title>
          <Box style={{ fontSize: '16px' }}>
            <Text size={'sm'}>
              Intitulé de l'Ipes :{' '}
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
            {/*<Text size={'sm'}>*/}
            {/*  Nombre d'IPES sous tutelle :{' '}*/}
            {/*  <span style={{ fontWeight: 'bolder' }}>*/}
            {/*    {row.original.ipes_count}*/}
            {/*  </span>*/}
            {/*</Text>*/}
            {/*<Text size={'sm'}>*/}
            {/*  Nombre de filières :{' '}*/}
            {/*  <span style={{ fontWeight: 'bolder' }}>*/}
            {/*    {row.original.branch_count}*/}
            {/*  </span>*/}
            {/*</Text>*/}
            {/*<Text size={'sm'}>*/}
            {/*  Nombre de ipess :{' '}*/}
            {/*  <span style={{ fontWeight: 'bolder' }}>*/}
            {/*    {row.original.level_count}*/}
            {/*  </span>*/}
            {/*</Text>*/}
            <Divider pb={1} mb={10} />
            {/*<Button*/}
            {/*  leftSection={<IconEye />}*/}
            {/*  onClick={() => {*/}
            {/*    push(PATH_SECTIONS.ipeses.ipes_details(row.original.id));*/}
            {/*  }}*/}
            {/*>*/}
            {/*  Details*/}
            {/*</Button>*/}
          </Box>
        </Box>
      </Box>
    ),

    renderRowActions: ({ row, table }) => (
      <Flex gap="md">
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
        <Flex gap={4} justify={'flex-end'} align={'center'}>
          <Tooltip label="Rafraichir des données">
            <ActionIcon onClick={() => refetch()}>
              <IconRefresh />
            </ActionIcon>
          </Tooltip>
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
            Nouvel Ipes
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
    // onRowSelectionChange: setRowSelection,
    // rowCount: totalRowCount,
    state: {
      columnFilterFns,
      columnFilters,
      globalFilter,
      isLoading: isLoading,
      isSaving: isCreatingIpes || isUpdatingIpes || isDeletingIpes,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      pagination,
      sorting,
    },
  });

  return <MantineReactTable table={table} />;
};

//CREATE hook (post new ipes to api)
function useCreateIpes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ipes: Ipes) => {
      // Envoie de la requête API pour créer une nouvelle ipese
      const response = await fetch('http://localhost:3000/api/ipeses/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ipes), // Envoyer les informations de la nouvelle ipese au serveur
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de l'ipes");
      }

      // Retourner la réponse du serveur (optionnel)
      return await response.json();
    },
    //client side optimistic update
    onMutate: (newIpesInfo: Ipes) => {
      queryClient.setQueryData(['ipeses'], (prevIpeses: any) => {
        // Vérifier si prevIpeses est un tableau, sinon, initialisez-le comme un tableau vide
        const ipesList = Array.isArray(prevIpeses) ? prevIpeses : [];
        return [
          ...ipesList,
          {
            ...newIpesInfo,
            id: (Math.random() + 1).toString(36).substring(7), // Créer un ID temporaire
          },
        ] as Ipes[];
      });
    },
    // Rafraîchissement des données après la mutation
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['ipeses'] });
    },
  });
}
//UPDATE hook (put ipes in api)
function useUpdateIpes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ipes: Ipes) => {
      // Envoie de la requête API pour mettre a jour une nouvelle ipese
      console.log("Ici voici l'Id : ", ipes);
      const response = await fetch(
        `http://localhost:3000/api/ipeses/${ipes.id}/update`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(ipes), // Envoyer les informations pour la modification de la ipese
        },
      );

      if (!response.ok) {
        console.log('Voici la reponse : ', response);
        throw new Error("Erreur lors de la mise à jour de l'ipes");
      }

      // Retourner la réponse du serveur (optionnel)
      return await response.json();
    },
    //client side optimistic update
    onMutate: (newIpesInfo: Ipes) => {
      queryClient.setQueryData(['ipeses'], (prevIpeses: any) => {
        const ipesList = Array.isArray(prevIpeses) ? prevIpeses : [];

        return ipesList.map((ipes: Ipes) =>
          ipes.id === newIpesInfo.id ? { ...ipes, ...newIpesInfo } : ipes,
        );
      });
    },
    // Invalider le cache après la mutation pour obtenir les données actualisées
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['ipeses'] });
    },
  });
}

//DELETE hook (delete ipes in api)
function useDeleteIpes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ipesId: string) => {
      // Envoi de la requête API pour supprimer la ipese
      const response = await fetch(
        `http://localhost:3000/api/ipeses/${ipesId}/delete`,
        {
          method: 'DELETE', // DELETE pour signifier la suppression
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: ipesId }), // Envoyer l'ID du ipes à supprimer
        },
      );

      console.log('Voici les informations pour le ipes : ', ipesId);

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'ipes");
      }

      // Retourner une confirmation (optionnel)
      return await response.json();
    },
    // Mise à jour optimiste côté client
    onMutate: (ipesId: string) => {
      // Annuler toute requête en cours pour ne pas avoir des données en conflit
      queryClient.cancelQueries({ queryKey: ['ipeses'] });

      // Sauvegarder les données actuelles dans le cache pour un rollback éventuel
      const previousIpeses = queryClient.getQueryData(['ipeses']);

      // Optimistiquement mettre à jour le cache
      queryClient.setQueryData(['ipeses'], (prevIpeses: any | undefined) => {
        return prevIpeses?.data?.filter((ipes: Ipes) => ipes.id !== ipesId);
      });

      // Retourner un contexte de rollback au cas où on aurait besoin d'annuler cette opération
      return { previousIpeses };
    },
    // Si la mutation échoue, restaurer les données précédentes
    onError: (err, ipesId, context: any) => {
      if (context?.previousIpeses) {
        queryClient.setQueryData(['ipeses'], context.previousIpeses);
      }
    },
    // Rafraîchir les données après la suppression réussie
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['ipeses'] });
    },
  });
}

const queryClient = new QueryClient();

const IpesTable = () => (
  //Put this with your other react-query providers near root of your app
  <QueryClientProvider client={queryClient}>
    <Section />
  </QueryClientProvider>
);

export default IpesTable;

const validateRequired = (value: string) => !!value.length;
const validateEmail = (email: string) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

function validateIpes(ipeses: Ipes) {
  return {
    // code: !validateRequired(ipeses.code)
    //   ? "L'intitulé de l'Ipes est requis"
    //   : '',
    name: !validateRequired(ipeses.name)
      ? "L'intitulé de l'Ipes est requis"
      : '',
    // phone: !validateRequired(ipeses.phone)
    //   ? "Le nombre d'heures est requis : "
    //   : '',
    // email: !validateEmail(ipeses.email)
    //   ? "L'intitulé de l'Ipes est requis"
    //   : '',
    // localization: !validateRequired(ipeses.localization)
    //   ? "Le nombre d'heures est requis : "
    //   : '',
  };
}
