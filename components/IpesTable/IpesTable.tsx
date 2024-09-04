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
import { IconEdit, IconTrash } from '@tabler/icons-react';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { fakeData } from './makeData';
import { type Ipes } from '@/types';

const Example = () => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const columns = useMemo<MRT_ColumnDef<Ipes>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
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
          //remove any previous validation errors when ipes focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              name: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: 'phone',
        header: 'Téléphone',
        mantineEditTextInputProps: {
          type: 'tel',
          required: true,
          error: validationErrors?.phone,
          //remove any previous validation errors when ipes focuses on the input
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
          //remove any previous validation errors when ipes focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              email: undefined,
            }),
        },
      },
      {
        accessorKey: 'borough',
        header: 'Arrondissement',
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
        header: 'Utilisateur Auteur',
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
        header: 'Promoteur',
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
    isError: isLoadingIpesesError,
    isFetching: isFetchingIpeses,
    isLoading: isLoadingIpeses,
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
      title: 'Etes-vous sure que vous voulez supprimer cet IPES ?',
      children: (
        <Text>
          Etes vous sure de vouloir supprimer {row.original.name} ? Cette action
          n'est irreversible.
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
    getRowId: (row) => row.id,
    mantineToolbarAlertBannerProps: isLoadingIpesesError
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
        <Title order={3}>Fichier un nouvel IPES</Title>
        {internalEditComponents}
        <Flex justify="flex-end" mt="xl">
          <MRT_EditActionButtons variant="text" table={table} row={row} />
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
    renderRowActions: ({ row, table }) => (
      <Flex gap="md">
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
        Ficher un nouvel Ipes
      </Button>
    ),
    state: {
      isLoading: isLoadingIpeses,
      isSaving: isCreatingIpes || isUpdatingIpes || isDeletingIpes,
      showAlertBanner: isLoadingIpesesError,
      showProgressBars: isFetchingIpeses,
    },
  });

  return <MantineReactTable table={table} />;
};

//CREATE hook (post new ipes to api)
function useCreateIpes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ipes: Ipes) => {
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

//UPDATE hook (put ipes in api)
function useUpdateIpes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ipes: Ipes) => {
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

//DELETE hook (delete ipes in api)
function useDeleteIpes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ipesId: string) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (ipesId: string) => {
      queryClient.setQueryData(
        ['ipeses'],
        (prevIpeses: any) =>
          prevIpeses?.filter((ipes: Ipes) => ipes.id !== ipesId),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['ipeses'] }), //refetch ipeses after mutation, disabled for demo
  });
}

const queryClient = new QueryClient();

const ExampleWithProviders = () => (
  //Put this with your other react-query providers near root of your app
  <QueryClientProvider client={queryClient}>
    <ModalsProvider>
      <Example />
    </ModalsProvider>
  </QueryClientProvider>
);

export default ExampleWithProviders;

const validateRequired = (value: string) => !!value.length;
const validateEmail = (email: string) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

function validateIpes(ipes: Ipes) {
  return {
    name: !validateRequired(ipes.name) ? "Intitulé de l'IPES requis" : '',
    phone: !validateRequired(ipes.phone) ? 'Téléphone requis' : '',
    email: !validateEmail(ipes.email) ? 'Format Email incorrect' : '',
    borough: !validateRequired(ipes.borough) ? 'Arrondissement requis' : '',
    creator_user: !validateRequired(ipes.created_user) ? 'Requis' : '',
    university: !validateRequired(ipes.university) ? 'Requis' : '',
    promoter: !validateRequired(ipes.promoter) ? 'Requis' : '',
  };
}
