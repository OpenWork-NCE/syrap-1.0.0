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
  Button,
  Flex,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { ModalsProvider, modals } from '@mantine/modals';
import { IconEdit, IconFileDownload, IconTrash } from '@tabler/icons-react';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { documentState, fakeData } from './makeData';
import { type Document } from '@/types';

const Section = () => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const columns = useMemo<MRT_ColumnDef<Document>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'document_name',
        header: 'Document',
        mantineEditTextInputProps: {
          type: 'file',
          required: true,
          error: validationErrors?.document_name,
          //remove any previous validation errors when document focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              document_name: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: 'document_description',
        header: 'Description',
        mantineEditTextInputProps: {
          type: 'text',
          required: true,
          error: validationErrors?.document_description,
          //remove any previous validation errors when document focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              document_description: undefined,
            }),
        },
      },
      {
        accessorKey: 'document_type',
        header: 'Type',
        mantineEditTextInputProps: {
          type: 'text',
          required: true,
          error: validationErrors?.document_type,
          //remove any previous validation errors when document focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              document_type: undefined,
            }),
        },
      },
      {
        accessorKey: 'document_size',
        header: 'Taille',
        mantineEditTextInputProps: {
          type: 'text',
          required: true,
          error: validationErrors?.document_size,
          //remove any previous validation errors when document focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              document_size: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: 'upload_date',
        header: "Date d'ajout",
        mantineEditTextInputProps: {
          type: 'date',
          required: true,
          error: validationErrors?.upload_date,
          //remove any previous validation errors when document focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              upload_date: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: 'uploaded_user',
        header: 'Utilisateur Auteur',
        mantineEditTextInputProps: {
          type: 'text',
          required: true,
          error: validationErrors?.uploaded_user,
          //remove any previous validation errors when document focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              uploaded_user: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: 'state',
        header: 'Status',
        editVariant: 'select',
        mantineEditSelectProps: {
          data: documentState,
          error: validationErrors?.state,
        },
      },
    ],
    [validationErrors],
  );

  //call CREATE hook
  const { mutateAsync: createDocument, isPending: isCreatingDocument } =
    useCreateDocument();
  //call READ hook
  const {
    data: fetchedDocuments = [],
    isError: isLoadingDocumentsError,
    isFetching: isFetchingDocuments,
    isLoading: isLoadingDocuments,
  } = useGetDocuments();
  //call UPDATE hook
  const { mutateAsync: updateDocument, isPending: isUpdatingDocument } =
    useUpdateDocument();
  //call DELETE hook
  const { mutateAsync: deleteDocument, isPending: isDeletingDocument } =
    useDeleteDocument();

  //CREATE action
  const handleCreateDocument: MRT_TableOptions<Document>['onCreatingRowSave'] =
    async ({ values, exitCreatingMode }) => {
      const newValidationErrors = validateDocument(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      await createDocument(values);
      exitCreatingMode();
    };

  //UPDATE action
  const handleSaveDocument: MRT_TableOptions<Document>['onEditingRowSave'] =
    async ({ values, table }) => {
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
      title: 'Etes-vous sure que vous voulez supprimer cet Document ?',
      children: (
        <Text>
          Etes vous sure de vouloir supprimer {row.original.document_name} ?
          Cette action n'est irreversible.
        </Text>
      ),
      labels: { confirm: 'Supprimer', cancel: 'Annuler' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteDocument(row.original.id),
    });

  const table = useMantineReactTable({
    columns,
    data: fetchedDocuments,
    createDisplayMode: 'modal', //default ('row', and 'custom' are also available)
    editDisplayMode: 'modal', //default ('row', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
    getRowId: (row) => row.id,
    mantineToolbarAlertBannerProps: isLoadingDocumentsError
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
    onCreatingRowSave: handleCreateDocument,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveDocument,
    renderCreateRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Enregistrer un nouveau Document</Title>
        {internalEditComponents}
        <Flex justify="flex-end" mt="xl">
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </Flex>
      </Stack>
    ),
    renderEditRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Editer le Document</Title>
        {internalEditComponents}
        <Flex justify="flex-end" mt="xl">
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </Flex>
      </Stack>
    ),
    positionActionsColumn: 'last',
    renderRowActions: ({ row, table }) => (
      <Flex gap="md">
        <Tooltip label="Télécharger">
          <ActionIcon onClick={() => table.setEditingRow(row)}>
            <IconFileDownload />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Editer">
          <ActionIcon onClick={() => table.setEditingRow(row)}>
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
      >
        Ficher un nouveau Document
      </Button>
    ),
    state: {
      isLoading: isLoadingDocuments,
      isSaving: isCreatingDocument || isUpdatingDocument || isDeletingDocument,
      showAlertBanner: isLoadingDocumentsError,
      showProgressBars: isFetchingDocuments,
    },
  });

  return <MantineReactTable table={table} />;
};

//CREATE hook (post new document to api)
function useCreateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (document: Document) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newDocumentInfo: Document) => {
      queryClient.setQueryData(
        ['documents'],
        (prevDocuments: any) =>
          [
            ...prevDocuments,
            {
              ...newDocumentInfo,
              id: (Math.random() + 1).toString(36).substring(7),
            },
          ] as Document[],
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['documents'] }), //refetch documents after mutation, disabled for demo
  });
}

//READ hook (get documents from api)
function useGetDocuments() {
  return useQuery<Document[]>({
    queryKey: ['documents'],
    queryFn: async () => {
      //send api request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve(fakeData);
    },
    refetchOnWindowFocus: false,
  });
}

//UPDATE hook (put document in api)
function useUpdateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (document: Document) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newDocumentInfo: Document) => {
      queryClient.setQueryData(
        ['documents'],
        (prevDocuments: any) =>
          prevDocuments?.map((prevDocument: Document) =>
            prevDocument.id === newDocumentInfo.id
              ? newDocumentInfo
              : prevDocument,
          ),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['documents'] }), //refetch documents after mutation, disabled for demo
  });
}

//DELETE hook (delete document in api)
function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (documentId: string) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (documentId: string) => {
      queryClient.setQueryData(
        ['documents'],
        (prevDocuments: any) =>
          prevDocuments?.filter(
            (document: Document) => document.id !== documentId,
          ),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['documents'] }), //refetch documents after mutation, disabled for demo
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

const validateRequired = (value: string) => !!value.length;
const validateRequiredNumber = (value: number) => !!value;
const validateEmail = (email: string) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

function validateDocument(document: Document) {
  return {
    document_name: !validateRequired(document.document_name) ? 'Requis' : '',
    document_description: !validateRequired(document.document_description)
      ? 'Requis'
      : '',
    document_type: !validateEmail(document.document_type) ? 'Requis' : '',
    document_size: !validateRequiredNumber(document.document_size)
      ? 'Requis'
      : '',
    upload_date: !validateRequired(document.upload_date) ? 'Requis' : '',
    uploaded_user: !validateRequired(document.uploaded_user) ? 'Requis' : '',
  };
}
