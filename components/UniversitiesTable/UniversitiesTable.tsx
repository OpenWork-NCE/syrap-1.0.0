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
import { ActionIcon, Button, Flex, Text, Tooltip } from '@mantine/core';
import { ModalsProvider, modals } from '@mantine/modals';
import { IconTrash } from '@tabler/icons-react';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { fakeData } from './makeData';
import { type University } from '@/types';

const Example = () => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});
  //keep track of rows that have been edited
  const [editedUniversities, setEditedUniversities] = useState<
    Record<string, University>
  >({});

  //call CREATE hook
  const { mutateAsync: createUniversity, isPending: isCreatingUniversity } =
    useCreateUniversity();
  //call READ hook
  const {
    data: fetchedUniversities = [],
    isError: isLoadingUniversityError,
    isFetching: isFetchingUniversities,
    isLoading: isLoadingUniversities,
  } = useGetUniversities();
  //call UPDATE hook
  const { mutateAsync: updateUniversities, isPending: isUpdatingUniversity } =
    useUpdateUniversities();
  //call DELETE hook
  const { mutateAsync: deleteUniversity, isPending: isDeletingUniversity } =
    useDeleteUniversity();

  //CREATE action
  const handleCreateUniversity: MRT_TableOptions<University>['onCreatingRowSave'] =
    async ({ values, exitCreatingMode }) => {
      const newValidationErrors = validateUniversity(values);
      if (Object.values(newValidationErrors).some((error) => !!error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      await createUniversity(values);
      exitCreatingMode();
    };

  //UPDATE action
  const handleSaveUniversities = async () => {
    if (Object.values(validationErrors).some((error) => !!error)) return;
    await updateUniversities(Object.values(editedUniversities));
    setEditedUniversities({});
  };

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<University>) =>
    modals.openConfirmModal({
      title: 'Are you sure you want to delete this university?',
      children: (
        <Text>
          Etes vous sure de vouloir supprimer {row.original.name} ? Cette action
          n'est pas reversible.
        </Text>
      ),
      labels: { confirm: 'Supprimer', cancel: 'Annuler' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteUniversity(row.original.id),
    });

  const columns = useMemo<MRT_ColumnDef<University>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'name',
        header: 'Université',
        mantineEditTextInputProps: ({ cell, row }) => ({
          type: 'text',
          required: true,
          error: validationErrors?.[cell.id],
          //store edited university in state to be saved later
          onBlur: (event) => {
            const validationError = !validateRequired(event.currentTarget.value)
              ? 'Required'
              : undefined;
            setValidationErrors({
              ...validationErrors,
              [cell.id]: validationError,
            });
            setEditedUniversities({
              ...editedUniversities,
              [row.id]: row.original,
            });
          },
        }),
      },
      {
        accessorKey: 'phone',
        header: 'Téléphone',
        mantineEditTextInputProps: ({ cell, row }) => ({
          type: 'tel',
          required: true,
          error: validationErrors?.[cell.id],
          //store edited university in state to be saved later
          onBlur: (event) => {
            const validationError = !validateRequired(event.currentTarget.value)
              ? 'Required'
              : undefined;
            setValidationErrors({
              ...validationErrors,
              [cell.id]: validationError,
            });
            setEditedUniversities({
              ...editedUniversities,
              [row.id]: row.original,
            });
          },
        }),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        mantineEditTextInputProps: ({ cell, row }) => ({
          type: 'email',
          required: true,
          error: validationErrors?.[cell.id],
          //store edited university in state to be saved later
          onBlur: (event) => {
            const validationError = !validateEmail(event.currentTarget.value)
              ? 'Email non valide'
              : undefined;
            setValidationErrors({
              ...validationErrors,
              [cell.id]: validationError,
            });
            setEditedUniversities({
              ...editedUniversities,
              [row.id]: row.original,
            });
          },
        }),
      },
      {
        accessorKey: 'borough',
        header: 'Arrondissement',
        mantineEditTextInputProps: ({ cell, row }) => ({
          type: 'text',
          required: true,
          error: validationErrors?.[cell.id],
          //store edited university in state to be saved later
          onBlur: (event) => {
            const validationError = !validateEmail(event.currentTarget.value)
              ? 'Arrondissement non valide'
              : undefined;
            setValidationErrors({
              ...validationErrors,
              [cell.id]: validationError,
            });
            setEditedUniversities({
              ...editedUniversities,
              [row.id]: row.original,
            });
          },
        }),
      },
      {
        accessorKey: 'created_user',
        header: 'Utilisateur auteur',
        mantineEditTextInputProps: ({ cell, row }) => ({
          type: 'text',
          required: true,
          error: validationErrors?.[cell.id],

          //store edited university in state to be saved later
          onBlur: (event) => {
            const validationError = !validateEmail(event.currentTarget.value)
              ? 'Utilisateur non valide'
              : undefined;
            setValidationErrors({
              ...validationErrors,
              [cell.id]: validationError,
            });
            setEditedUniversities({
              ...editedUniversities,
              [row.id]: row.original,
            });
          },
        }),
      },
    ],
    [editedUniversities, validationErrors],
  );

  const table = useMantineReactTable({
    columns,
    data: fetchedUniversities,
    createDisplayMode: 'row', // ('modal', and 'custom' are also available)
    editDisplayMode: 'cell', // ('modal', 'row', 'table', and 'custom' are also available)
    enableEditing: true,
    enableRowActions: true,
    positionActionsColumn: 'last',
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
    renderRowActions: ({ row }) => (
      <Tooltip label="Supprimer">
        <ActionIcon color="red" onClick={() => openDeleteConfirmModal(row)}>
          <IconTrash />
        </ActionIcon>
      </Tooltip>
    ),
    renderBottomToolbarCustomActions: () => (
      <Flex align="center" gap="md">
        <Button
          color="blue"
          onClick={handleSaveUniversities}
          disabled={
            Object.keys(editedUniversities).length === 0 ||
            Object.values(validationErrors).some((error) => !!error)
          }
          loading={isUpdatingUniversity}
        >
          Save
        </Button>
        {Object.values(validationErrors).some((error) => !!error) && (
          <Text color="red">Fix errors before submitting</Text>
        )}
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
        Ficher une nouvelle université
      </Button>
    ),
    state: {
      isLoading: isLoadingUniversities,
      isSaving:
        isCreatingUniversity || isUpdatingUniversity || isDeletingUniversity,
      showAlertBanner: isLoadingUniversityError,
      showProgressBars: isFetchingUniversities,
    },
  });

  return <MantineReactTable table={table} />;
};

//CREATE hook (post new university to api)
function useCreateUniversity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (university: University) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newUniversityInfo: University) => {
      queryClient.setQueryData(
        ['universities'],
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
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['universities'] }), //refetch universities after mutation, disabled for demo
  });
}

//READ hook (get universities from api)
function useGetUniversities() {
  return useQuery<University[]>({
    queryKey: ['universities'],
    queryFn: async () => {
      //send api request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve(fakeData);
    },
    refetchOnWindowFocus: false,
  });
}

//UPDATE hook (put universities in api)
function useUpdateUniversities() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (universities: University[]) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newUniversities: University[]) => {
      queryClient.setQueryData(
        ['universities'],
        (prevUniversities: any) =>
          prevUniversities?.map((university: University) => {
            const newUniversity = newUniversities.find(
              (u) => u.id === university.id,
            );
            return newUniversity ? newUniversity : university;
          }),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['universities'] }), //refetch universities after mutation, disabled for demo
  });
}

//DELETE hook (delete university in api)
function useDeleteUniversity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (universityId: string) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (universityId: string) => {
      queryClient.setQueryData(
        ['universities'],
        (prevUniversities: any) =>
          prevUniversities?.filter(
            (university: University) => university.id !== universityId,
          ),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['universities'] }), //refetch universities after mutation, disabled for demo
  });
}

const queryClient = new QueryClient();

const UniversitiesTable = () => (
  //Put this with your other react-query providers near root of your app
  <QueryClientProvider client={queryClient}>
    <ModalsProvider>
      <Example />
    </ModalsProvider>
  </QueryClientProvider>
);

export default UniversitiesTable;

const validateRequired = (value: string) => !!value?.length;
const validateEmail = (email: string) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

function validateUniversity(university: University) {
  return {
    name: !validateRequired(university.name)
      ? 'Intitulé université requis'
      : '',
    phone: !validateRequired(university.phone) ? 'Téléphone requis' : '',
    email: !validateEmail(university.email) ? 'Incorrect Email Format' : '',
    arrondissement: !validateRequired(university.borough)
      ? 'Arrondissement requis'
      : '',
    creator: !validateRequired(university.created_user) ? 'Requis' : '',
  };
}
