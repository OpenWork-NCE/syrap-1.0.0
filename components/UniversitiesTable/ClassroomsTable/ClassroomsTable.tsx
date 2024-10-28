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
import { modals } from '@mantine/modals';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { notifications } from '@mantine/notifications';
import { Classroom, University } from '@/types/real-types';

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});

type ClassroomApiResponse = {
  data: Array<Classroom>;
};

interface Params {
  columnFilterFns: MRT_ColumnFilterFnsState;
  columnFilters: MRT_ColumnFiltersState;
  globalFilter: string;
  sorting: MRT_SortingState;
  pagination: MRT_PaginationState;
}

//custom react-query hook
const useGetClassrooms = (universityId: string) => {
  //build the URL (https://www.mantine-react-table.com/api/data?start=0&size=10&filters=[]&globalFilter=&sorting=[])
  const fetchURL = new URL(
    '/api/classrooms/' + universityId + '/university',
    process.env.NODE_ENV === 'production'
      ? 'https://www.mantine-react-table.com'
      : 'http://localhost:3000',
  );

  return useQuery<ClassroomApiResponse>({
    // queryKey: ['classrooms', fetchURL.href], //refetch whenever the URL changes (columnFilters, globalFilter, sorting, pagination),
    queryKey: ['university'], //refetch whenever the URL changes (columnFilters, globalFilter, sorting, pagination)
    queryFn: () => fetch(fetchURL.href).then((res) => res.json()),
    placeholderData: keepPreviousData, //useful for paginated queries by keeping data from previous pages on screen while fetching the next page
    staleTime: 30_000, //don't refetch previously viewed pages until cache is more than 30 seconds old
  });
};

const Section = ({ universityId }: { universityId: string }) => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const handleExportRows = (rows: MRT_Row<Classroom>[]) => {
    const doc = new jsPDF('portrait', 'pt', 'A4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const logoUrl = '/thumbnail.png'; // Path to your logo

    // French Column (Left)
    const frenchText = `
      REPUBLIQUE DU CAMEROUN
             Paix – Travail – Patrie
              -------------------------
        MINISTERE DES FINANCES
              -------------------------
         SECRETARIAT GENERAL
              ------------------------
          CENTRE NATIONAL DE
           DEVELOPPEMENT DE
               L’INFORMATIQUE
               -------------------------
    `;

    // English Column (Right)
    const englishText = `
          REPUBLIC OF CAMEROON
           Peace – Work – Fatherland
                  -------------------------
             MINISTRY OF FINANCE
                  -------------------------
            GENERAL SECRETARIAT
                  -------------------------
          NATIONAL CENTRE FOR THE
        DEVELOPMENT OF COMPUTER
                           SERVICES
              ------------------------------------
    `;

    // Add Header with 3 columns
    doc.setFontSize(10);

    // Column 1: French text
    doc.text(frenchText, 40, 50); // Positioned on the left side

    // Column 2: Logo
    doc.addImage(logoUrl, 'PNG', pageWidth / 2 - 30, 40, 60, 60); // Centered logo

    // Column 3: English text
    doc.text(englishText, pageWidth - 250, 50); // Positioned on the right side

    // Draw a line separating the header from the rest of the content
    // doc.setLineWidth(0.5);
    // doc.line(30, 170, pageWidth - 30, 170); // Line under the header

    // doc.setLineWidth(0.5);
    // doc.line(30, 60, 180, 60); // Draw a line under the header

    // doc.text();
    const tableData = rows.map((row) => Object.values(row.original));
    const tableHeaders = columns.map((c) => c.header);

    autoTable(doc, {
      startY: 200, // Start after the header
      head: [tableHeaders],
      body: [['classroomName', 'classroomDescription', 'levelName']],
    });

    doc.save('syrap-classrooms.pdf');
  };

  const handleExportRowsAsCSV = (rows: MRT_Row<Classroom>[]) => {
    const rowData = rows.map((row) => ({
      classroomName: row.original.filiere.name,
      classroomDescription: row.original.filiere.description,
      levelName: row.original.niveau.name,
    }));
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportDataAsCSV = () => {
    const allData = fetchedClassrooms.map((row: any) => ({
      classroomName: row.original.filiere.name,
      classroomDescription: row.original.filiere.description,
      levelName: row.original.niveau.name,
    }));
    const csv = generateCsv(csvConfig)(allData);
    download(csvConfig)(csv);
  };

  const columns = useMemo<MRT_ColumnDef<Classroom>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Identifiant',
        enableEditing: false,
      },
      {
        accessorKey: 'filiere.name',
        header: 'Filière',
        editVariant: 'select',
        // mantineEditSelectProps: {
        //   data: fetchedClassroom.map((classroom: Classroom) => ({
        //     value: String(classroom.id),
        //     label: classroom.name,
        //   })),
        // },
        // mantineEditTextInputProps: {
        //   type: 'text',
        //   required: true,
        //   error: validationErrors?.classroomName,
        //   //remove any previous validation errors when user focuses on the input
        //   onFocus: () =>
        //     setValidationErrors({
        //       ...validationErrors,
        //       classroomName: undefined,
        //     }),
        //   //optionally add validation checking for onBlur or onChange
        // },
      },
      {
        accessorKey: 'filiere.description',
        header: 'Description de filiere',
        enableEditing: false,
        // mantineEditTextInputProps: {
        //   type: 'text',
        //   required: true,
        //   error: validationErrors?.classroomName,
        //   //remove any previous validation errors when user focuses on the input
        //   onFocus: () =>
        //     setValidationErrors({
        //       ...validationErrors,
        //       classroomName: undefined,
        //     }),
        // },
      },
      {
        accessorKey: 'niveau.name',
        header: 'Intitulé du niveau',
        editVariant: 'select',
        // mantineEditSelectProps: {
        //   data: fetchedLevels.map((level: Level) => ({
        //     value: String(level.id),
        //     label: level.name,
        //   })),
        // },
        // mantineEditTextInputProps: {
        //   type: 'text',
        //   required: true,
        //   error: validationErrors?.classroomName,
        //   //remove any previous validation errors when user focuses on the input
        //   onFocus: () =>
        //     setValidationErrors({
        //       ...validationErrors,
        //       classroomName: undefined,
        //     }),
        // },
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
    useGetClassrooms(universityId);

  //this will depend on your API response shape
  const fetchedClassrooms = data?.data ?? [];
  // const totalRowCount = data?.meta?.totalRowCount ?? 0;

  //call CREATE hook
  const { mutateAsync: createClassroom, isPending: isCreatingClassroom } =
    useCreateClassroom();
  //call UPDATE hook
  const { mutateAsync: updateClassroom, isPending: isUpdatingClassroom } =
    useUpdateClassroom();
  //call DELETE hook
  const { mutateAsync: deleteClassroom, isPending: isDeletingClassroom } =
    useDeleteClassroom();

  //CREATE action
  const handleCreateClassroom: MRT_TableOptions<Classroom>['onCreatingRowSave'] =
    async ({ values, exitCreatingMode }) => {
      const newValidationErrors = validateClassroom(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      await createClassroom(values);
      exitCreatingMode();
    };

  //UPDATE action
  const handleSaveClassroom: MRT_TableOptions<Classroom>['onEditingRowSave'] =
    async ({ values, table, row }) => {
      const newValidationErrors = validateClassroom(values);
      console.log('Voici les valeurs : ', values, " et l'id : ", row.id);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      await updateClassroom({ ...values, id: row.id });
      table.setEditingRow(null); //exit editing mode
    };

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<Classroom>) =>
    modals.openConfirmModal({
      title: 'Etes vous sur de vouloir supprimer cette Filière ?',
      children: (
        <Text>
          Etes vous sure de vouloir supprimer cette Salle? Cette action est
          irreversible.
        </Text>
      ),
      labels: { confirm: 'Supprimer', cancel: 'Annuler' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteClassroom(row.original.id),
    });

  const table = useMantineReactTable({
    columns,
    data: fetchedClassrooms,
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
        minHeight: 'auto',
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateClassroom,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveClassroom,
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
          <Title order={5}>
            {row.original.filiere.name} : {row.original.niveau.name}
          </Title>
          <Divider pb={1} mb={10} />
          <Box style={{ fontSize: '16px' }}>
            <Text size={'sm'}>
              Intitulé de la filière :{' '}
              <span style={{ fontWeight: 'bolder' }}>
                {row.original.filiere.name}
              </span>
            </Text>
            <Text size={'sm'}>
              Description de la filière :{' '}
              <span style={{ fontWeight: 'bolder' }}>
                {row.original.filiere.description}
              </span>
            </Text>
            <Text size={'sm'}>
              Intitulé du niveau :{' '}
              <span style={{ fontWeight: 'bolder' }}>
                {row.original.niveau.name}
              </span>
            </Text>
            <Divider my={10} />
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
      isSaving:
        isCreatingClassroom || isUpdatingClassroom || isDeletingClassroom,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      sorting,
    },
  });

  return <MantineReactTable table={table} />;
};

//CREATE hook (post new classroom to api)
function useCreateClassroom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (classroom: Classroom) => {
      // Envoie de la requête API pour créer une nouvelle classroome
      const response = await fetch(
        'http://localhost:3000/api/classrooms/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(classroom), // Envoyer les informations de la nouvelle classroome au serveur
        },
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la filière');
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
    onMutate: (newClassroomInfo: Classroom) => {
      queryClient.setQueryData(['classrooms'], (prevClassrooms: any) => {
        // Vérifier si prevClassrooms est un tableau, sinon, initialisez-le comme un tableau vide
        const classroomList = Array.isArray(prevClassrooms)
          ? prevClassrooms
          : [];
        return [
          ...classroomList,
          {
            ...newClassroomInfo,
            id: (Math.random() + 1).toString(36).substring(7), // Créer un ID temporaire
          },
        ] as Classroom[];
      });
    },
    // Rafraîchissement des données après la mutation
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
    },
  });
}

//UPDATE hook (put classroom in api)
function useUpdateClassroom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (classroom: Classroom) => {
      // Envoie de la requête API pour mettre a jour une nouvelle classroome
      const response = await fetch(
        `http://localhost:3000/api/classrooms/${classroom.id}/update`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(classroom), // Envoyer les informations pour la modification de la classroome
        },
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de la filière');
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
    onMutate: (newClassroomInfo: Classroom) => {
      queryClient.setQueryData(['classrooms'], (prevClassrooms: any) => {
        const classroomList = Array.isArray(prevClassrooms)
          ? prevClassrooms
          : [];

        return classroomList.map((classroom: Classroom) =>
          classroom.id === newClassroomInfo.id
            ? { ...classroom, ...newClassroomInfo }
            : classroom,
        );
      });
    },
    // Invalider le cache après la mutation pour obtenir les données actualisées
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
    },
  });
}

//DELETE hook (delete classroom in api)
function useDeleteClassroom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (classroomId: string) => {
      // Envoi de la requête API pour supprimer la classroome
      const response = await fetch(
        `http://localhost:3000/api/classrooms/${classroomId}/delete`,
        {
          method: 'DELETE', // DELETE pour signifier la suppression
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: classroomId }), // Envoyer l'ID de la classroome à supprimer
        },
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la filière');
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
    onMutate: (classroomId: string) => {
      // Annuler toute requête en cours pour ne pas avoir des données en conflit
      queryClient.cancelQueries({ queryKey: ['classrooms'] });

      // Sauvegarder les données actuelles dans le cache pour un rollback éventuel
      const previousClassroom = queryClient.getQueryData(['classrooms']);

      // Optimistiquement mettre à jour le cache
      queryClient.setQueryData(
        ['classrooms'],
        (prevClassroom: any | undefined) => {
          return prevClassroom?.data?.filter(
            (classroom: Classroom) => classroom.id !== classroomId,
          );
        },
      );

      // Retourner un contexte de rollback au cas où on aurait besoin d'annuler cette opération
      return { previousClassroom };
    },
    // Si la mutation échoue, restaurer les données précédentes
    onError: (err, classroomId, context: any) => {
      if (context?.previousClassroom) {
        queryClient.setQueryData(['classrooms'], context.previousClassroom);
      }
    },
    // Rafraîchir les données après la suppression réussie
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
    },
  });
}

const queryClient = new QueryClient();

const ClassroomTable = ({ universityId }: { universityId: string }) => (
  //Put this with your other react-query providers near root of your app
  <QueryClientProvider client={queryClient}>
    <Section universityId={universityId} />
  </QueryClientProvider>
);

export default ClassroomTable;

const validateRequired = (value: string) => !!value.length;
const validateNumberRequired = (value: number) => !!value;

function validateClassroom(classroom: Classroom) {
  return {
    // id: !validateNumberRequired(Number(classroom.id)),
    branch: !validateRequired(classroom.filiere.id)
      ? 'La filière est requise'
      : '',
    level: !validateRequired(classroom.niveau.id) ? 'Le niveau est requis' : '',
  };
}
