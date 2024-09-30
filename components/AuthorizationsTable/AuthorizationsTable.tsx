'use client';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css'; //if using mantine date picker features
import 'mantine-react-table/styles.css'; //make sure MRT styles were imported in your app root (once)
import { useMemo, useState } from 'react';
import {
  MantineReactTable,
  // createRow,
  type MRT_ColumnDef,
  type MRT_Row,
  type MRT_TableOptions,
  useMantineReactTable,
} from 'mantine-react-table';
import { ActionIcon, Button, Flex, Text, Tooltip, Chip } from '@mantine/core';
import { ModalsProvider, modals } from '@mantine/modals';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { fakeData, rights } from './makeData';
import { type Authorization } from '@/types';
import { profiles } from '@/components/UsersTable/makeData';

const Section = () => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const columns = useMemo<MRT_ColumnDef<Authorization>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'name',
        header: 'Profile',
        mantineEditTextInputProps: {
          type: 'text',
          required: true,
          error: validationErrors?.name,
          //remove any previous validation errors when authorization focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              name: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: 'rights',
        header: 'Droits',
        editVariant: 'select',
        mantineEditSelectProps: {
          multiple: true,
          data: rights,
          error: validationErrors?.state,
        },
      },
      // {
      //   accessorKey: 'rights',
      //   header: 'Droits',
      //   mantineEditSelectProps: {
      //     // multiple: true,
      //     data: rights,
      //     // required: true,
      //     error: validationErrors?.rights,
      //   },
      // },
    ],
    [validationErrors],
  );

  //call CREATE hook
  const {
    mutateAsync: createAuthorization,
    isPending: isCreatingAuthorization,
  } = useCreateAuthorization();
  //call READ hook
  const {
    data: Authorizations = [],
    isError: isLoadingAuthorizationsError,
    isFetching: isFetchingAuthorizations,
    isLoading: isLoadingAuthorizations,
  } = useGetAuthorizations();
  //call UPDATE hook
  const {
    mutateAsync: updateAuthorization,
    isPending: isUpdatingAuthorization,
  } = useUpdateAuthorization();
  //call DELETE hook
  const {
    mutateAsync: deleteAuthorization,
    isPending: isDeletingAuthorization,
  } = useDeleteAuthorization();

  //CREATE action
  const handleCreateAuthorization: MRT_TableOptions<Authorization>['onCreatingRowSave'] =
    async ({ values, exitCreatingMode }) => {
      const newValidationErrors = validateAuthorization(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      await createAuthorization(values);
      exitCreatingMode();
    };

  //UPDATE action
  const handleSaveAuthorization: MRT_TableOptions<Authorization>['onEditingRowSave'] =
    async ({ values, table }) => {
      const newValidationErrors = validateAuthorization(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      await updateAuthorization(values);
      table.setEditingRow(null); //exit editing mode
    };

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<Authorization>) =>
    modals.openConfirmModal({
      title: 'Etes-vous sure de vouloir supprimer cet utilisateur ?',
      children: (
        <Text>
          Vous êtes sur le point de supprimer le profile {row.original.name}.
          Cette action n'est pas reversible.
        </Text>
      ),
      labels: { confirm: 'Supprimer', cancel: 'Annuler' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteAuthorization(row.original.id),
    });

  const table = useMantineReactTable({
    columns,
    data: Authorizations,
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
    getRowId: (row) => row.id,
    mantineToolbarAlertBannerProps: isLoadingAuthorizationsError
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
    initialState: {
      columnVisibility: {
        id: false,
      },
      density: 'xs',
      columnPinning: {
        left: ['mrt-row-select'],
        right: ['mrt-row-actions', 'mrt-row-expand'],
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateAuthorization,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveAuthorization,
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
        Nouveau profil
      </Button>
    ),
    state: {
      isLoading: isLoadingAuthorizations,
      isSaving:
        isCreatingAuthorization ||
        isUpdatingAuthorization ||
        isDeletingAuthorization,
      showAlertBanner: isLoadingAuthorizationsError,
      showProgressBars: isFetchingAuthorizations,
    },
  });

  return <MantineReactTable table={table} />;
};

//CREATE hook (post new authorization to api)
function useCreateAuthorization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (authorization: Authorization) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newAuthorizationInfo: Authorization) => {
      queryClient.setQueryData(
        ['authorizations'],
        (prevAuthorizations: any) =>
          [
            ...prevAuthorizations,
            {
              ...newAuthorizationInfo,
              id: (Math.random() + 1).toString(36).substring(7),
            },
          ] as Authorization[],
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['authorizations'] }), //refetch authorizations after mutation, disabled for demo
  });
}

//READ hook (get authorizations from api)
function useGetAuthorizations() {
  return useQuery<Authorization[]>({
    queryKey: ['authorizations'],
    queryFn: async () => {
      //send api request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve(fakeData);
    },
    refetchOnWindowFocus: false,
  });
}

//UPDATE hook (put authorization in api)
function useUpdateAuthorization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (authorization: Authorization) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newAuthorizationInfo: Authorization) => {
      queryClient.setQueryData(
        ['authorizations'],
        (prevAuthorizations: any) =>
          prevAuthorizations?.map((prevAuthorization: Authorization) =>
            prevAuthorization.id === newAuthorizationInfo.id
              ? newAuthorizationInfo
              : prevAuthorization,
          ),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['authorizations'] }), //refetch authorizations after mutation, disabled for demo
  });
}

//DELETE hook (delete authorization in api)
function useDeleteAuthorization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (authorizationId: string) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (authorizationId: string) => {
      queryClient.setQueryData(
        ['authorizations'],
        (prevAuthorizations: any) =>
          prevAuthorizations?.filter(
            (authorization: Authorization) =>
              authorization.id !== authorizationId,
          ),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['authorizations'] }), //refetch authorizations after mutation, disabled for demo
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

function validateAuthorization(authorization: Authorization) {
  return {
    name: !validateRequired(authorization.name) ? 'Nom requis' : '',
    // rights: !validateRequired(authorization.rights) ? 'Droits requis' : '',
  };
}
