import { useDisclosure } from '@mantine/hooks';
import { Drawer, Button } from '@mantine/core';
import { Invoices } from '@/types';
import { ReactNode } from 'react';

type UeFormTableProps = {
  data: Invoices[];
  error?: ReactNode;
  loading?: boolean;
};

function Demo() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer
        opened={opened}
        position={'right'}
        onClose={close}
        title="Création d'une Unité d'Enseignement"
      >
        {/* Drawer content */}
      </Drawer>

      <Button onClick={open}>Open Drawer</Button>
    </>
  );
}
