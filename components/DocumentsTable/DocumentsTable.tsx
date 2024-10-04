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

type Document = {
  id: string;
  name: string;
  file: File;
};

type DocumentApiResponse = {
  data: Array<Document>;
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
const useGetUDocuments = ({} // columnFilterFns,
// columnFilters,
// globalFilter,
// sorting,
// pagination,
: Params) => {
  //build the URL (https://www.mantine-react-table.com/api/data?start=0&size=10&filters=[]&globalFilter=&sorting=[])
  const fetchURL = new URL(
    '/api/documents',
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

  return useQuery<DocumentApiResponse>({
    // queryKey: ['documents', fetchURL.href], //refetch whenever the URL changes (columnFilters, globalFilter, sorting, pagination)
    queryKey: ['documents'], //refetch whenever the URL changes (columnFilters, globalFilter, sorting, pagination)
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // State to store selected file

  // const handleExportRows = (rows: MRT_Row<Document>[]) => {
  //   const doc = new jsPDF();
  //   const tableData = rows.map((row) => Object.values(row.original));
  //   const tableHeaders = columns.map((c) => c.header);
  //
  //   autoTable(doc, {
  //     head: [tableHeaders],
  //     body: tableData,
  //   });
  //
  //   doc.save('syrap-documents.pdf');
  // };
  //
  // const handleExportRowsAsCSV = (rows: MRT_Row<Document>[]) => {
  //   const rowData = rows.map((row) => row.original);
  //   const csv = generateCsv(csvConfig)(rowData);
  //   download(csvConfig)(csv);
  // };
  //
  // const handleExportDataAsCSV = () => {
  //   const csv = generateCsv(csvConfig)(fetchedUDocuments);
  //   download(csvConfig)(csv);
  // };

  const columns = useMemo<MRT_ColumnDef<Document>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'name',
        header: 'Nom du fichier',
        mantineEditTextInputProps: {
          type: 'text',
          error: validationErrors?.name,
          onFocus: () =>
            setValidationErrors({ ...validationErrors, name: undefined }),
        },
      },
      {
        accessorKey: 'file',
        header: 'Fichier',
        mantineEditTextInputProps: {
          type: 'file',
          onChange: (e) => {
            const target = e.target as HTMLInputElement;
            const file = target.files?.[0] || null;
            setSelectedFile(file); // Store the selected file in state
          },
          required: true,
          error: validationErrors?.file,
          onFocus: () =>
            setValidationErrors({ ...validationErrors, file: undefined }),
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
  const { data, isError, isFetching, isLoading, refetch } = useGetUDocuments({
    columnFilterFns,
    columnFilters,
    globalFilter,
    pagination,
    sorting,
  });

  //this will depend on your API response shape
  const fetchedUDocuments = data?.data ?? [];
  // const totalRowCount = data?.meta?.totalRowCount ?? 0;

  //call CREATE hook
  const { mutateAsync: createDocument, isPending: isCreatingDocument } =
    useCreateDocument();
  //call UPDATE hook
  const { mutateAsync: updateDocument, isPending: isUpdatingDocument } =
    useUpdateDocument();
  //call DELETE hook
  const { mutateAsync: deleteDocument, isPending: isDeletingDocument } =
    useDeleteDocument();

  //CREATE action
  const handleCreateDocument: MRT_TableOptions<Document>['onCreatingRowSave'] =
    async ({ values, exitCreatingMode }) => {
      // console.log('Voici le document : ', values);
      // const newValidationErrors = validateDocument(values);
      // if (Object.values(newValidationErrors).some((error) => error)) {
      //   setValidationErrors(newValidationErrors);
      //   return;
      // }
      // setValidationErrors({});
      // await createDocument(values);
      // exitCreatingMode();

      const newValidationErrors = validateDocument({
        ...values,
        file: selectedFile as File,
      });

      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }

      // Prepare FormData to send file
      const formData = new FormData();
      formData.append('name', values.name);
      if (selectedFile) formData.append('file', selectedFile);

      try {
        await createDocument(formData); // API call (see next section)
        exitCreatingMode();
      } catch (error) {
        console.error('Erreur lors de la création du document:', error);
      }
    };

  //UPDATE action
  const handleSaveDocument: MRT_TableOptions<Document>['onEditingRowSave'] =
    async ({ values, table, row }) => {
      const newValidationErrors = validateDocument(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      await updateDocument(values);
      table.setEditingRow(null); //exit editing mode
    };

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<Document>) =>
    modals.openConfirmModal({
      title: 'Etes vous sur de vouloir supprimer ce document ?',
      children: (
        <Text>
          Etes vous sure de vouloir supprimer {row.original.name}? Cette action
          est irreversible.
        </Text>
      ),
      labels: { confirm: 'Supprimer', cancel: 'Annuler' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteDocument(row.original.id),
    });

  const table = useMantineReactTable({
    columns,
    data: fetchedUDocuments,
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
      placeholder: 'Rechercher des documents',
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
    onCreatingRowSave: handleCreateDocument,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveDocument,

    onColumnFilterFnsChange: setColumnFilterFns,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    renderCreateRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Nouvelle document</Title>
        {internalEditComponents}
        <Flex justify="flex-end" mt="xl">
          <MRT_EditActionButtons variant={'text'} table={table} row={row} />
        </Flex>
      </Stack>
    ),
    renderEditRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Editer le document</Title>
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
            {/*<Text size={'sm'}>*/}
            {/*  Intitulé de l'document :{' '}*/}
            {/*  <span style={{ fontWeight: 'bolder' }}>{row.original.name}</span>*/}
            {/*</Text>*/}
            {/*<Text size={'sm'}>*/}
            {/*  Téléphone :{' '}*/}
            {/*  <span style={{ fontWeight: 'bolder' }}>{row.original.phone}</span>*/}
            {/*</Text>*/}
            {/*<Text size={'sm'}>*/}
            {/*  Email :{' '}*/}
            {/*  <span style={{ fontWeight: 'bolder' }}>{row.original.email}</span>*/}
            {/*</Text>*/}
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
            Nouvwau document
          </Button>
          {/*<Menu*/}
          {/*  shadow={'md'}*/}
          {/*  // width={130}*/}
          {/*  trigger="hover"*/}
          {/*  openDelay={100}*/}
          {/*  closeDelay={400}*/}
          {/*>*/}
          {/*  <Menu.Target>*/}
          {/*    <Button*/}
          {/*      leftSection={<IconTableExport />}*/}
          {/*      rightSection={<IconDownload size={14} />}*/}
          {/*      variant={'filled'}*/}
          {/*    >*/}
          {/*      Exporter*/}
          {/*    </Button>*/}
          {/*  </Menu.Target>*/}

          {/*  <Menu.Dropdown>*/}
          {/*    <Menu.Label>Format PDF</Menu.Label>*/}
          {/*    <Menu.Item*/}
          {/*      //export all rows, including from the next page, (still respects filtering and sorting)*/}
          {/*      disabled={table.getPrePaginationRowModel().rows.length === 0}*/}
          {/*      leftSection={<IconFileTypePdf />}*/}
          {/*      onClick={() =>*/}
          {/*        handleExportRows(table.getPrePaginationRowModel().rows)*/}
          {/*      }*/}
          {/*    >*/}
          {/*      Exporter tout*/}
          {/*    </Menu.Item>*/}
          {/*    <Menu.Item*/}
          {/*      disabled={table.getRowModel().rows.length === 0}*/}
          {/*      //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)*/}
          {/*      leftSection={<IconFileTypePdf />}*/}
          {/*      onClick={() => handleExportRows(table.getRowModel().rows)}*/}
          {/*    >*/}
          {/*      Exporter la page*/}
          {/*    </Menu.Item>*/}
          {/*    <Menu.Item*/}
          {/*      disabled={*/}
          {/*        !table.getIsSomeRowsSelected() &&*/}
          {/*        !table.getIsAllRowsSelected()*/}
          {/*      }*/}
          {/*      //only export selected rows*/}
          {/*      leftSection={<IconFileTypePdf />}*/}
          {/*      onClick={() =>*/}
          {/*        handleExportRows(table.getSelectedRowModel().rows)*/}
          {/*      }*/}
          {/*    >*/}
          {/*      Exporter la selection*/}
          {/*    </Menu.Item>*/}
          {/*    <Menu.Divider />*/}
          {/*    <Menu.Label>Format Excel</Menu.Label>*/}
          {/*    <Menu.Item*/}
          {/*      //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)*/}
          {/*      onClick={handleExportDataAsCSV}*/}
          {/*      leftSection={<IconFileTypeCsv />}*/}
          {/*    >*/}
          {/*      Exporter tout*/}
          {/*    </Menu.Item>*/}
          {/*    <Menu.Item*/}
          {/*      disabled={table.getPrePaginationRowModel().rows.length === 0}*/}
          {/*      //export all rows, including from the next page, (still respects filtering and sorting)*/}
          {/*      onClick={() =>*/}
          {/*        handleExportRowsAsCSV(table.getPrePaginationRowModel().rows)*/}
          {/*      }*/}
          {/*      leftSection={<IconFileTypeCsv />}*/}
          {/*    >*/}
          {/*      Exporter toute les lignes*/}
          {/*    </Menu.Item>*/}
          {/*    <Menu.Item*/}
          {/*      disabled={table.getRowModel().rows.length === 0}*/}
          {/*      //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)*/}
          {/*      onClick={() => handleExportRowsAsCSV(table.getRowModel().rows)}*/}
          {/*      leftSection={<IconFileTypeCsv />}*/}
          {/*    >*/}
          {/*      Exporter toutes la pages*/}
          {/*    </Menu.Item>*/}
          {/*    <Menu.Item*/}
          {/*      disabled={*/}
          {/*        !table.getIsSomeRowsSelected() &&*/}
          {/*        !table.getIsAllRowsSelected()*/}
          {/*      }*/}
          {/*      //only export selected rows*/}
          {/*      onClick={() =>*/}
          {/*        handleExportRowsAsCSV(table.getSelectedRowModel().rows)*/}
          {/*      }*/}
          {/*      leftSection={<IconFileTypeCsv />}*/}
          {/*    >*/}
          {/*      Exporter la selection*/}
          {/*    </Menu.Item>*/}
          {/*  </Menu.Dropdown>*/}
          {/*</Menu>*/}
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
      isSaving: isCreatingDocument || isUpdatingDocument || isDeletingDocument,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      pagination,
      sorting,
    },
  });

  return <MantineReactTable table={table} />;
};

//CREATE hook (post new document to api)
// function useCreateDocument() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (document: Document) => {
//       // Envoie de la requête API pour créer une nouvelle documente
//       const response = await fetch(
//         'http://localhost:3000/api/documents/create',
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(document), // Envoyer les informations de la nouvelle documente au serveur
//         },
//       );
//
//       if (!response.ok) {
//         throw new Error("Erreur lors de la création de l'document");
//       }
//
//       // Retourner la réponse du serveur (optionnel)
//       return await response.json();
//     },
//     //client side optimistic update
//     onMutate: (newDocumentInfo: Document) => {
//       queryClient.setQueryData(['documents'], (prevUDocuments: any) => {
//         // Vérifier si prevUDocuments est un tableau, sinon, initialisez-le comme un tableau vide
//         const documentList = Array.isArray(prevUDocuments)
//           ? prevUDocuments
//           : [];
//         return [
//           ...documentList,
//           {
//             ...newDocumentInfo,
//             id: (Math.random() + 1).toString(36).substring(7), // Créer un ID temporaire
//           },
//         ] as Document[];
//       });
//     },
//     // Rafraîchissement des données après la mutation
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: ['documents'] });
//     },
//   });
// }
//UPDATE hook (put document in api)
function useCreateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      // Envoi de la requête API pour créer un nouveau document
      const response = await fetch(
        'http://localhost:3000/api/documents/create',
        {
          method: 'POST',
          body: formData, // Send FormData, not JSON
        },
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la création du document');
      }

      return await response.json();
    },
    onMutate: (newDocumentInfo: FormData) => {
      queryClient.setQueryData(['documents'], (prevDocuments: any) => [
        ...(prevDocuments || []),
        {
          file: newDocumentInfo?.get('file'),
          name: newDocumentInfo?.get('name'),
          id: (Math.random() + 1).toString(36).substring(7),
        },
      ]);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

function useUpdateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (document: Document) => {
      // Envoie de la requête API pour mettre a jour une nouvelle documente
      console.log("Ici voici l'Id : ", document);
      const response = await fetch(
        `http://localhost:3000/api/documents/${document.id}/update`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(document), // Envoyer les informations pour la modification de la documente
        },
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de le document');
      }

      // Retourner la réponse du serveur (optionnel)
      return await response.json();
    },
    //client side optimistic update
    onMutate: (newDocumentInfo: Document) => {
      queryClient.setQueryData(['documents'], (prevUDocuments: any) => {
        const documentList = Array.isArray(prevUDocuments)
          ? prevUDocuments
          : [];

        return documentList.map((document: Document) =>
          document.id === newDocumentInfo.id
            ? { ...document, ...newDocumentInfo }
            : document,
        );
      });
    },
    // Invalider le cache après la mutation pour obtenir les données actualisées
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

//DELETE hook (delete document in api)
function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (documentId: string) => {
      // Envoi de la requête API pour supprimer la documente
      const response = await fetch(
        `http://localhost:3000/api/documents/${documentId}/delete`,
        {
          method: 'DELETE', // DELETE pour signifier la suppression
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: documentId }), // Envoyer l'ID du document à supprimer
        },
      );

      console.log('Voici les informations pour le document : ', documentId);

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'document");
      }

      // Retourner une confirmation (optionnel)
      return await response.json();
    },
    // Mise à jour optimiste côté client
    onMutate: (documentId: string) => {
      // Annuler toute requête en cours pour ne pas avoir des données en conflit
      queryClient.cancelQueries({ queryKey: ['documents'] });

      // Sauvegarder les données actuelles dans le cache pour un rollback éventuel
      const previousUDocuments = queryClient.getQueryData(['documents']);

      // Optimistiquement mettre à jour le cache
      queryClient.setQueryData(
        ['documents'],
        (prevUDocuments: any | undefined) => {
          return prevUDocuments?.data?.filter(
            (document: Document) => document.id !== documentId,
          );
        },
      );

      // Retourner un contexte de rollback au cas où on aurait besoin d'annuler cette opération
      return { previousUDocuments };
    },
    // Si la mutation échoue, restaurer les données précédentes
    onError: (err, documentId, context: any) => {
      if (context?.previousUDocuments) {
        queryClient.setQueryData(['documents'], context.previousUDocuments);
      }
    },
    // Rafraîchir les données après la suppression réussie
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

const queryClient = new QueryClient();

const SectionWithProviders = () => (
  //Put this with your other react-query providers near root of your app
  <QueryClientProvider client={queryClient}>
    <ModalsProvider>
      <Section />
    </ModalsProvider>
  </QueryClientProvider>
);

export default SectionWithProviders;

const validateRequired = (value: string) => !!value;
const validateRequiredFile = (value: File) => !!value;

function validateDocument(document: Document) {
  return {
    name: !validateRequired(document.name) ? 'Requis' : '',
    file: !validateRequiredFile(document.file) ? 'Requis' : '',
  };
}
