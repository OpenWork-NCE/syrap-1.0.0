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
} from '@mantine/core';
import {
  IconCheck,
  IconDownload,
  IconEdit,
  IconFileTypeCsv,
  IconFileTypePdf,
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
import { notifications } from '@mantine/notifications';

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});

type Authorizations = {
  id: string;
  name: string;
};

type AuthorizationsApiResponse = {
  data: Array<Authorizations>;
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
const useGetAuthorizationss = ({
  columnFilterFns,
  columnFilters,
  globalFilter,
  sorting,
  pagination,
}: Params) => {
  //build the URL (https://www.mantine-react-table.com/api/data?start=0&size=10&filters=[]&globalFilter=&sorting=[])
  const fetchURL = new URL(
    '/api/authorizations',
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

  return useQuery<AuthorizationsApiResponse>({
    // queryKey: ['authorization', fetchURL.href], //refetch whenever the URL changes (columnFilters, globalFilter, sorting, pagination)
    queryKey: ['authorizations'], //refetch whenever the URL changes (columnFilters, globalFilter, sorting, pagination)
    queryFn: () => fetch(fetchURL.href).then((res) => res.json()),
    placeholderData: keepPreviousData, //useful for paginated queries by keeping data from previous pages on screen while fetching the next page
    staleTime: 30_000, //don't refetch previously viewed pages until cache is more than 30 seconds old
  });
};

const Section = () => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const handleExportRows = (rows: MRT_Row<Authorizations>[]) => {
    const doc = new jsPDF();
    const tableData = rows.map((row) => Object.values(row.original));
    const tableHeaders = columns.map((c) => c.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    });

    doc.save('syrap-permissions.pdf');
  };

  const handleExportRowsAsCSV = (rows: MRT_Row<Authorizations>[]) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportDataAsCSV = () => {
    const csv = generateCsv(csvConfig)(fetchedAuthorizationss);
    download(csvConfig)(csv);
  };

  const columns = useMemo<MRT_ColumnDef<Authorizations>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Identifiant',
        enableEditing: false,
      },
      {
        accessorKey: 'name',
        header: 'Permission',
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
  const { data, isError, isFetching, isLoading, refetch } =
    useGetAuthorizationss({
      columnFilterFns,
      columnFilters,
      globalFilter,
      pagination,
      sorting,
    });

  //this will depend on your API response shape
  const fetchedAuthorizationss = data?.data ?? [];
  // const totalRowCount = data?.meta?.totalRowCount ?? 0;

  //call CREATE hook
  const {
    mutateAsync: createAuthorizations,
    isPending: isCreatingAuthorizations,
  } = useCreateAuthorizations();
  //call UPDATE hook
  const {
    mutateAsync: updateAuthorizations,
    isPending: isUpdatingAuthorizations,
  } = useUpdateAuthorizations();
  //call DELETE hook
  const {
    mutateAsync: deleteAuthorizations,
    isPending: isDeletingAuthorizations,
  } = useDeleteAuthorizations();

  //CREATE action
  const handleCreateAuthorizations: MRT_TableOptions<Authorizations>['onCreatingRowSave'] =
    async ({ values, exitCreatingMode }) => {
      const newValidationErrors = validateAuthorizations(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      await createAuthorizations(values);
      exitCreatingMode();
    };

  //UPDATE action
  const handleSaveAuthorizations: MRT_TableOptions<Authorizations>['onEditingRowSave'] =
    async ({ values, table, row }) => {
      const newValidationErrors = validateAuthorizations(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      await updateAuthorizations({
        id: row.id,
        name: values.name,
      });
      table.setEditingRow(null); //exit editing mode
    };

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<Authorizations>) =>
    modals.openConfirmModal({
      title: 'Etes vous sur de vouloir supprimer cette permission ?',
      children: (
        <Text>
          Etes vous sure de vouloir supprimer {row.original.name}? Cette action
          est irreversible.
        </Text>
      ),
      labels: { confirm: 'Supprimer', cancel: 'Annuler' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteAuthorizations(row.original.id),
    });

  const table = useMantineReactTable({
    columns,
    data: fetchedAuthorizationss,
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
        pageSize: 10,
      },
    },
    mantineSearchTextInputProps: {
      placeholder: 'Rechercher des permissions',
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
    onCreatingRowSave: handleCreateAuthorizations,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveAuthorizations,

    onColumnFilterFnsChange: setColumnFilterFns,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    renderCreateRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Nouvelle permission</Title>
        {internalEditComponents}
        <Flex justify="flex-end" mt="xl">
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </Flex>
      </Stack>
    ),
    renderEditRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Editer la permission</Title>
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
              Intitulé de la permission :{' '}
              <span style={{ fontWeight: 'bolder' }}>{row.original.name}</span>
            </Text>
            <Divider my={10} />
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
            Nouvelle permission
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
      isSaving:
        isCreatingAuthorizations ||
        isUpdatingAuthorizations ||
        isDeletingAuthorizations,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      pagination,
      sorting,
    },
  });

  return <MantineReactTable table={table} />;
};

//CREATE hook (post new authorization to api)
function useCreateAuthorizations() {
  // const notificationId = notifications.show({
  //   loading: true,
  //   title: 'Creation de la permission',
  //   message: 'Veuillez patienter que la requette se termine.',
  //   autoClose: false,
  //   withCloseButton: false,
  // });
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (authorization: Authorizations) => {
      // Envoie de la requête API pour créer une nouvelle permission
      const response = await fetch(
        'http://localhost:3000/api/authorizations/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(authorization), // Envoyer les informations de la nouvelle permission au serveur
        },
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la permission');
      }

      notifications.show({
        color: 'teal',
        title: 'Permission créee',
        message: 'Merci de votre patience',
        icon: <IconCheck />,
        loading: false,
        autoClose: 2000,
      });
      // Retourner la réponse du serveur (optionnel)
      return await response.json();
    },
    //client side optimistic update
    onMutate: (newAuthorizationsInfo: Authorizations) => {
      queryClient.setQueryData(
        ['authorizations'],
        (prevAuthorizationss: any) => {
          // Vérifier si prevAuthorizationss est un tableau, sinon, initialisez-le comme un tableau vide
          const authorizationList = Array.isArray(prevAuthorizationss)
            ? prevAuthorizationss
            : [];
          return [
            ...authorizationList,
            {
              ...newAuthorizationsInfo,
              id: (Math.random() + 1).toString(36).substring(7), // Créer un ID temporaire
            },
          ] as Authorizations[];
        },
      );
    },
    // Rafraîchissement des données après la mutation
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['authorizations'] });
    },
  });
}
//UPDATE hook (put authorization in api)
function useUpdateAuthorizations() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (authorization: Authorizations) => {
      // Envoie de la requête API pour mettre a jour une nouvelle permission
      const response = await fetch(
        `http://localhost:3000/api/authorizations/${authorization.id}/update`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(authorization), // Envoyer les informations pour la modification de la permission
        },
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de la permission');
      }

      notifications.show({
        color: 'green',
        title: 'Permission mise à jour',
        message: 'Merci de votre patience',
        icon: <IconCheck />,
        loading: false,
        autoClose: 2000,
      });
      // Retourner la réponse du serveur (optionnel)
      return await response.json();
    },
    //client side optimistic update
    onMutate: (newAuthorizationsInfo: Authorizations) => {
      queryClient.setQueryData(
        ['authorizations'],
        (prevAuthorizationss: any) => {
          const authorizationList = Array.isArray(prevAuthorizationss)
            ? prevAuthorizationss
            : [];

          return authorizationList.map((authorization: Authorizations) =>
            authorization.id === newAuthorizationsInfo.id
              ? { ...authorization, ...newAuthorizationsInfo }
              : authorization,
          );
        },
      );
    },
    // Invalider le cache après la mutation pour obtenir les données actualisées
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['authorizations'] });
    },
  });
}

//DELETE hook (delete authorization in api)
function useDeleteAuthorizations() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (authorizationId: string) => {
      // Envoi de la requête API pour supprimer de la permission
      const response = await fetch(
        `http://localhost:3000/api/authorizations/${authorizationId}/delete`,
        {
          method: 'DELETE', // DELETE pour signifier la suppression
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: authorizationId }), // Envoyer l'ID de la permission à supprimer
        },
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la permission');
      }

      notifications.show({
        color: 'red',
        title: 'Permission supprimée',
        message: 'Merci de votre patience',
        icon: <IconCheck />,
        loading: false,
        autoClose: 2000,
      });
      // Retourner une confirmation (optionnel)
      return await response.json();
    },
    // Mise à jour optimiste côté client
    onMutate: (authorizationId: string) => {
      // Annuler toute requête en cours pour ne pas avoir des données en conflit
      queryClient.cancelQueries({ queryKey: ['authorizations'] });

      // Sauvegarder les données actuelles dans le cache pour un rollback éventuel
      const previousAuthorizationss = queryClient.getQueryData([
        'authorizations',
      ]);

      // Optimistiquement mettre à jour le cache
      queryClient.setQueryData(
        ['authorizations'],
        (prevAuthorizationss: any | undefined) => {
          return prevAuthorizationss?.data?.filter(
            (authorization: Authorizations) =>
              authorization.id !== authorizationId,
          );
        },
      );

      // Retourner un contexte de rollback au cas où on aurait besoin d'annuler cette opération
      return { previousAuthorizationss };
    },
    // Si la mutation échoue, restaurer les données précédentes
    onError: (err, authorizationId, context: any) => {
      if (context?.previousAuthorizationss) {
        queryClient.setQueryData(
          ['authorizations'],
          context.previousAuthorizationss,
        );
      }
    },
    // Rafraîchir les données après la suppression réussie
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['authorizations'] });
    },
  });
}

const queryClient = new QueryClient();

const AuthorizationsTable = () => (
  //Put this with your other react-query providers near root of your app
  <QueryClientProvider client={queryClient}>
    <Section />
  </QueryClientProvider>
);

export default AuthorizationsTable;

const validateRequired = (value: string) =>
  !!value.length && value.length > 3 && value.length <= 100;
function validateAuthorizations(authorization: Authorizations) {
  return {
    name: !validateRequired(authorization.name)
      ? 'Ce champs doit contenir entre 3 et 100 caractères.'
      : '',
  };
}
