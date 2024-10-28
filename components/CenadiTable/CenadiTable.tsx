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
import autoTable, { Pos } from 'jspdf-autotable';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { modals, ModalsProvider } from '@mantine/modals';
import { notifications } from '@mantine/notifications';

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});

type Cenadi = {
  id: string;
  code: string;
  name: string;
};

type CenadiApiResponse = {
  data: Array<Cenadi>;
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
const useGetCenadis = ({
  columnFilterFns,
  columnFilters,
  globalFilter,
  sorting,
  pagination,
}: Params) => {
  //build the URL (https://www.mantine-react-table.com/api/data?start=0&size=10&filters=[]&globalFilter=&sorting=[])
  const fetchURL = new URL(
    '/api/cenadis',
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

  return useQuery<CenadiApiResponse>({
    // queryKey: ['cenadi', fetchURL.href], //refetch whenever the URL changes (columnFilters, globalFilter, sorting, pagination)
    queryKey: ['cenadis'], //refetch whenever the URL changes (columnFilters, globalFilter, sorting, pagination)
    queryFn: () => fetch(fetchURL.href).then((res) => res.json()),
    placeholderData: keepPreviousData, //useful for paginated queries by keeping data from previous pages on screen while fetching the next page
    staleTime: 30_000, //don't refetch previously viewed pages until cache is more than 30 seconds old
  });
};

const Section = () => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const handleExportRows = (rows: MRT_Row<Cenadi>[]) => {
    const doc = new jsPDF();
    const tableData = rows.map((row) => Object.values(row.original));
    const tableHeaders = columns.map((c) => c.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    });

    doc.save('syrap-cenadis.pdf');
  };

  const handleExportRowsAsCSV = (rows: MRT_Row<Cenadi>[]) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportDataAsCSV = () => {
    const csv = generateCsv(csvConfig)(fetchedCenadis);
    download(csvConfig)(csv);
  };

  const columns = useMemo<MRT_ColumnDef<Cenadi>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Identifiant',
        enableEditing: false,
      },
      {
        accessorKey: 'code',
        header: 'Sigle',
        mantineEditTextInputProps: {
          type: 'text',
          required: true,
          error: validationErrors?.code,
          //remove any previous validation errors when cenadi focuses on the input
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
        header: 'Nom Utilisateur',
        mantineEditTextInputProps: {
          type: 'text',
          required: true,
          error: validationErrors?.name,
          //remove any previous validation errors when cenadi focuses on the input
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
  const { data, isError, isFetching, isLoading, refetch } = useGetCenadis({
    columnFilterFns,
    columnFilters,
    globalFilter,
    pagination,
    sorting,
  });

  //this will depend on your API response shape
  const fetchedCenadis = data?.data ?? [];
  // const totalRowCount = data?.meta?.totalRowCount ?? 0;

  //call CREATE hook
  const { mutateAsync: createCenadi, isPending: isCreatingCenadi } =
    useCreateCenadi();
  //call UPDATE hook
  const { mutateAsync: updateCenadi, isPending: isUpdatingCenadi } =
    useUpdateCenadi();
  //call DELETE hook
  const { mutateAsync: deleteCenadi, isPending: isDeletingCenadi } =
    useDeleteCenadi();

  //CREATE action
  const handleCreateCenadi: MRT_TableOptions<Cenadi>['onCreatingRowSave'] =
    async ({ values, exitCreatingMode }) => {
      const newValidationErrors = validateCenadi(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      await createCenadi(values);
      exitCreatingMode();
    };

  //UPDATE action
  const handleSaveCenadi: MRT_TableOptions<Cenadi>['onEditingRowSave'] =
    async ({ values, table, row }) => {
      const newValidationErrors = validateCenadi(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      await updateCenadi({
        ...values,
        id: row.id,
      });
      table.setEditingRow(null); //exit editing mode
    };

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<Cenadi>) =>
    modals.openConfirmModal({
      title: 'Etes vous sur de vouloir supprimer cet entité Cenadi ?',
      children: (
        <Text>
          Etes vous sure de vouloir supprimer {row.original.name}? Cette action
          est irreversible.
        </Text>
      ),
      labels: { confirm: 'Supprimer', cancel: 'Annuler' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteCenadi(row.original.id),
    });

  const table = useMantineReactTable({
    columns,
    data: fetchedCenadis,
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
      placeholder: 'Rechercher des cenadis',
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
    onCreatingRowSave: handleCreateCenadi,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveCenadi,

    onColumnFilterFnsChange: setColumnFilterFns,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    renderCreateRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Nouveau Cenadi</Title>
        {internalEditComponents}
        <Flex justify="flex-end" mt="xl">
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </Flex>
      </Stack>
    ),
    renderEditRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Editer le Cenadi</Title>
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
              Sigle de l'instance Cenadi :{' '}
              <span style={{ fontWeight: 'bolder' }}>{row.original.code}</span>
            </Text>
            <Text size={'sm'}>
              Intitulé de l'instance Cenadi :{' '}
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
            Nouveau Cenadi
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
      isSaving: isCreatingCenadi || isUpdatingCenadi || isDeletingCenadi,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      pagination,
      sorting,
    },
  });

  return <MantineReactTable table={table} />;
};

//CREATE hook (post new cenadi to api)
function useCreateCenadi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cenadi: Cenadi) => {
      // Envoie de la requête API pour créer un nouveau utilisateur
      const response = await fetch('http://localhost:3000/api/cenadis/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cenadi), // Envoyer les informations de la nouveau l'utilisateur au serveur
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du Cenadi');
      }

      notifications.show({
        color: 'teal',
        title: 'Cenadi créé',
        message: 'Merci de votre patience',
        icon: <IconCheck />,
        loading: false,
        autoClose: 2000,
      });
      // Retourner la réponse du serveur (optionnel)
      return await response.json();
    },
    //client side optimistic update
    onMutate: (newCenadiInfo: Cenadi) => {
      queryClient.setQueryData(['cenadis'], (prevCenadis: any) => {
        // Vérifier si prevCenadis est un tableau, sinon, initialisez-le comme un tableau vide
        const cenadiList = Array.isArray(prevCenadis) ? prevCenadis : [];
        return [
          ...cenadiList,
          {
            ...newCenadiInfo,
            id: (Math.random() + 1).toString(36).substring(7), // Créer un ID temporaire
          },
        ] as Cenadi[];
      });
    },
    // Rafraîchissement des données après la mutation
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cenadis'] });
    },
  });
}
//UPDATE hook (put cenadi in api)
function useUpdateCenadi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cenadi: Cenadi) => {
      // Envoie de la requête API pour mettre a jour un nouveau utilisateur
      const response = await fetch(
        `http://localhost:3000/api/cenadis/${cenadi.id}/update`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cenadi), // Envoyer les informations pour la modification de l'utilisateur
        },
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de l'utilisateur");
      }

      notifications.show({
        color: 'green',
        title: 'Cenadi mis à jour',
        message: 'Merci de votre patience',
        icon: <IconCheck />,
        loading: false,
        autoClose: 2000,
      });
      // Retourner la réponse du serveur (optionnel)
      return await response.json();
    },
    //client side optimistic update
    onMutate: (newCenadiInfo: Cenadi) => {
      queryClient.setQueryData(['cenadis'], (prevCenadis: any) => {
        const cenadiList = Array.isArray(prevCenadis) ? prevCenadis : [];

        return cenadiList.map((cenadi: Cenadi) =>
          cenadi.id === newCenadiInfo.id
            ? { ...cenadi, ...newCenadiInfo }
            : cenadi,
        );
      });
    },
    // Invalider le cache après la mutation pour obtenir les données actualisées
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cenadis'] });
    },
  });
}

//DELETE hook (delete cenadi in api)
function useDeleteCenadi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cenadiId: string) => {
      // Envoi de la requête API pour supprimer de l'utilisateur
      const response = await fetch(
        `http://localhost:3000/api/cenadis/${cenadiId}/delete`,
        {
          method: 'DELETE', // DELETE pour signifier la suppression
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: cenadiId }), // Envoyer l'ID de l'utilisateur à supprimer
        },
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du Cenadi');
      }

      notifications.show({
        color: 'red',
        title: 'Cenadi supprimé',
        message: 'Merci de votre patience',
        icon: <IconCheck />,
        loading: false,
        autoClose: 2000,
      });
      // Retourner une confirmation (optionnel)
      return await response.json();
    },
    // Mise à jour optimiste côté client
    onMutate: (cenadiId: string) => {
      // Annuler toute requête en cours pour ne pas avoir des données en conflit
      queryClient.cancelQueries({ queryKey: ['cenadis'] });

      // Sauvegarder les données actuelles dans le cache pour un rollback éventuel
      const previousCenadis = queryClient.getQueryData(['cenadis']);

      // Optimistiquement mettre à jour le cache
      queryClient.setQueryData(['cenadis'], (prevCenadis: any | undefined) => {
        return prevCenadis?.data?.filter(
          (cenadi: Cenadi) => cenadi.id !== cenadiId,
        );
      });

      // Retourner un contexte de rollback au cas où on aurait besoin d'annuler cette opération
      return { previousCenadis };
    },
    // Si la mutation échoue, restaurer les données précédentes
    onError: (err, cenadiId, context: any) => {
      if (context?.previousCenadis) {
        queryClient.setQueryData(['cenadis'], context.previousCenadis);
      }
    },
    // Rafraîchir les données après la suppression réussie
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cenadis'] });
    },
  });
}

const queryClient = new QueryClient();

const CenadiTable = () => (
  //Put this with your other react-query providers near root of your app
  <QueryClientProvider client={queryClient}>
    <Section />
  </QueryClientProvider>
);

export default CenadiTable;

const validateRequired = (value: string) =>
  !!value.length && value.length >= 3 && value.length <= 100;

function validateCenadi(cenadi: Cenadi) {
  return {
    code: !validateRequired(cenadi.code) ? 'Ce champ est requis' : '',
    name: !validateRequired(cenadi.name) ? 'Ce champs est requis' : '',
  };
}
