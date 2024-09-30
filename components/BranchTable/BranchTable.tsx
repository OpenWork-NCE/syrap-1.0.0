'use client';

import { useMemo, useState } from 'react';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
  type MRT_ColumnFilterFnsState,
  MRT_EditActionButtons,
  MRT_TableOptions,
  MRT_Row,
} from 'mantine-react-table';
import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Flex,
  Menu,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import {
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
import { modals } from '@mantine/modals';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { download, generateCsv, mkConfig } from 'export-to-csv';

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});

type Branch = {
  id: string;
  name: string;
};

type BranchApiResponse = {
  data: Array<Branch>;
};

interface Params {
  columnFilterFns: MRT_ColumnFilterFnsState;
  columnFilters: MRT_ColumnFiltersState;
  globalFilter: string;
  sorting: MRT_SortingState;
  pagination: MRT_PaginationState;
}

//custom react-query hook
const useGetBranchs = ({
  columnFilterFns,
  columnFilters,
  globalFilter,
  sorting,
  pagination,
}: Params) => {
  //build the URL (https://www.mantine-react-table.com/api/data?start=0&size=10&filters=[]&globalFilter=&sorting=[])
  const fetchURL = new URL(
    '/api/branches',
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

  return useQuery<BranchApiResponse>({
    // queryKey: ['branches', fetchURL.href], //refetch whenever the URL changes (columnFilters, globalFilter, sorting, pagination),
    queryKey: ['branches'], //refetch whenever the URL changes (columnFilters, globalFilter, sorting, pagination)
    queryFn: () => fetch(fetchURL.href).then((res) => res.json()),
    placeholderData: keepPreviousData, //useful for paginated queries by keeping data from previous pages on screen while fetching the next page
    staleTime: 30_000, //don't refetch previously viewed pages until cache is more than 30 seconds old
  });
};

const Section = () => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const handleExportRows = (rows: MRT_Row<Branch>[]) => {
    const doc = new jsPDF();
    const tableData = rows.map((row) => Object.values(row.original));
    const tableHeaders = columns.map((c) => c.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    });

    doc.save('syrap-filières.pdf');
  };

  const handleExportRowsAsCSV = (rows: MRT_Row<Branch>[]) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportDataAsCSV = () => {
    const csv = generateCsv(csvConfig)(fetchedBranchs);
    download(csvConfig)(csv);
  };

  const columns = useMemo<MRT_ColumnDef<Branch>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Identifiant',
        enableEditing: false,
      },
      {
        accessorKey: 'name',
        header: 'Nom',
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
  const { data, isError, isFetching, isLoading, refetch } = useGetBranchs({
    columnFilterFns,
    columnFilters,
    globalFilter,
    pagination,
    sorting,
  });

  //this will depend on your API response shape
  const fetchedBranchs = data?.data ?? [];
  // const totalRowCount = data?.meta?.totalRowCount ?? 0;

  //call CREATE hook
  const { mutateAsync: createBranch, isPending: isCreatingBranch } =
    useCreateBranch();
  //call UPDATE hook
  const { mutateAsync: updateBranch, isPending: isUpdatingBranch } =
    useUpdateBranch();
  //call DELETE hook
  const { mutateAsync: deleteBranch, isPending: isDeletingBranch } =
    useDeleteBranch();

  //CREATE action
  const handleCreateBranch: MRT_TableOptions<Branch>['onCreatingRowSave'] =
    async ({ values, exitCreatingMode }) => {
      const newValidationErrors = validateBranch(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      await createBranch(values);
      exitCreatingMode();
    };

  //UPDATE action
  const handleSaveBranch: MRT_TableOptions<Branch>['onEditingRowSave'] =
    async ({ values, table, row }) => {
      const newValidationErrors = validateBranch(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      await updateBranch({ id: row.id, name: values.name });
      table.setEditingRow(null); //exit editing mode
    };

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<Branch>) =>
    modals.openConfirmModal({
      title: 'Etes vous sur de vouloir supprimer cette Filière ?',
      children: (
        <Text>
          Etes vous sure de vouloir supprimer {row.original.name}? Cette action
          est irreversible.
        </Text>
      ),
      labels: { confirm: 'Supprimer', cancel: 'Annuler' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteBranch(row.original.id),
    });

  const table = useMantineReactTable({
    columns,
    data: fetchedBranchs,
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
      placeholder: 'Rechercher des Filières',
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
        minHeight: '500px',
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateBranch,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveBranch,
    renderCreateRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Nouvelle Filière</Title>
        {internalEditComponents}
        <Flex justify="flex-end" mt="xl">
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </Flex>
      </Stack>
    ),
    renderEditRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Editer la filière</Title>
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
              Intitulé de la filière :{' '}
              <span style={{ fontWeight: 'bolder' }}>{row.original.name}</span>
            </Text>
            <Divider my={10} />
            {/*<Title order={5} mb={5}>*/}
            {/*  Niveaux de la filière*/}
            {/*</Title>*/}
            {/*<LevelTable*/}
            {/*  datas={*/}
            {/*    fakeDataWithLevel.find((el) => el.id === row.original.id)*/}
            {/*      ?.levels*/}
            {/*  }*/}
            {/*/>*/}
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
            Nouvelle Filière
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
      columnFilterFns,
      columnFilters,
      globalFilter,
      pagination,
      isLoading: isLoading,
      isSaving: isCreatingBranch || isUpdatingBranch || isDeletingBranch,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      sorting,
    },
  });

  return <MantineReactTable table={table} />;
};

//CREATE hook (post new branch to api)
function useCreateBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (branch: Branch) => {
      // Envoie de la requête API pour créer une nouvelle branche
      const response = await fetch(
        'http://localhost:3000/api/branches/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(branch), // Envoyer les informations de la nouvelle branche au serveur
        },
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la filière');
      }

      // Retourner la réponse du serveur (optionnel)
      return await response.json();
    },
    //client side optimistic update
    onMutate: (newBranchInfo: Branch) => {
      queryClient.setQueryData(['branches'], (prevBranchs: any) => {
        // Vérifier si prevBranchs est un tableau, sinon, initialisez-le comme un tableau vide
        const branchList = Array.isArray(prevBranchs) ? prevBranchs : [];
        return [
          ...branchList,
          {
            ...newBranchInfo,
            id: (Math.random() + 1).toString(36).substring(7), // Créer un ID temporaire
          },
        ] as Branch[];
      });
    },
    // Rafraîchissement des données après la mutation
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
    },
  });
}

//UPDATE hook (put branch in api)
function useUpdateBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (branch: Branch) => {
      // Envoie de la requête API pour mettre a jour une nouvelle branche
      const response = await fetch(
        `http://localhost:3000/api/branches/${branch.id}/update`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(branch), // Envoyer les informations pour la modification de la branche
        },
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de la filière');
      }

      // Retourner la réponse du serveur (optionnel)
      return await response.json();
    },
    //client side optimistic update
    onMutate: (newBranchInfo: Branch) => {
      queryClient.setQueryData(['branches'], (prevBranchs: any) => {
        const branchList = Array.isArray(prevBranchs) ? prevBranchs : [];

        return branchList.map((branch: Branch) =>
          branch.id === newBranchInfo.id
            ? { ...branch, ...newBranchInfo }
            : branch,
        );
      });
    },
    // Invalider le cache après la mutation pour obtenir les données actualisées
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
    },
  });
}

//DELETE hook (delete branch in api)
function useDeleteBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (branchId: string) => {
      // Envoi de la requête API pour supprimer la branche
      const response = await fetch(
        `http://localhost:3000/api/branches/${branchId}/delete`,
        {
          method: 'DELETE', // DELETE pour signifier la suppression
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: branchId }), // Envoyer l'ID de la branche à supprimer
        },
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la filière');
      }

      // Retourner une confirmation (optionnel)
      return await response.json();
    },
    // Mise à jour optimiste côté client
    onMutate: (branchId: string) => {
      // Annuler toute requête en cours pour ne pas avoir des données en conflit
      queryClient.cancelQueries({ queryKey: ['branches'] });

      // Sauvegarder les données actuelles dans le cache pour un rollback éventuel
      const previousBranches = queryClient.getQueryData(['branches']);

      // Optimistiquement mettre à jour le cache
      queryClient.setQueryData(
        ['branches'],
        (prevBranches: any | undefined) => {
          return prevBranches?.data?.filter(
            (branch: Branch) => branch.id !== branchId,
          );
        },
      );

      // Retourner un contexte de rollback au cas où on aurait besoin d'annuler cette opération
      return { previousBranches };
    },
    // Si la mutation échoue, restaurer les données précédentes
    onError: (err, branchId, context: any) => {
      if (context?.previousBranches) {
        queryClient.setQueryData(['branches'], context.previousBranches);
      }
    },
    // Rafraîchir les données après la suppression réussie
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
    },
  });
}

const queryClient = new QueryClient();

const BranchTable = () => (
  //Put this with your other react-query providers near root of your app
  <QueryClientProvider client={queryClient}>
    <Section />
  </QueryClientProvider>
);

export default BranchTable;

const validateRequired = (value: string) => !!value.length;
const validateNumberRequired = (value: number) => !!value;

function validateBranch(branch: Branch) {
  return {
    name: !validateRequired(branch.name)
      ? "L'intitulé de la filière est requise"
      : '',
  };
}
