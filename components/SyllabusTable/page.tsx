'use client';

import { Invoices } from '@/types';
import {
  Button,
  Divider,
  Flex,
  Menu,
  Paper,
  PaperProps,
  Stack,
  Table,
  Text,
  TextProps,
  useMantineTheme,
} from '@mantine/core';
import {
  IconCloudDownload,
  IconMail,
  IconPrinter,
  IconSend,
  IconShare,
} from '@tabler/icons-react';
import { useColorScheme, useMediaQuery } from '@mantine/hooks';
import { Surface } from '@/components';

const ICON_SIZE = 16;

type SyllabusProps = {
  data?: Invoices;
} & PaperProps;

const elements = [
  { description: 'Front and rear brake cables', unitPrice: 100, amount: 100 },
  { description: 'New set of pedal arms', unitPrice: 25, amount: 25 },
  { description: 'Labor - 3hrs', unitPrice: 15, amount: 15 },
];

const TEXT_PROPS: TextProps = {
  fz: 'sm',
};

const Syllabus = ({ data, ...others }: SyllabusProps) => {
  const theme = useMantineTheme();
  const colorScheme = useColorScheme();
  const LINK_PROPS: TextProps = {
    c:
      colorScheme === 'dark'
        ? theme.colors[theme.primaryColor][4]
        : theme.colors[theme.primaryColor][6],
    td: 'underline',
  };
  const tablet_match = useMediaQuery('(max-width: 768px)');

  const rows = elements.map((element) => (
    <Table.Tr key={element.description}>
      <Table.Td>{element.description}</Table.Td>
      <Table.Td>${element.unitPrice}</Table.Td>
      <Table.Td>${element.amount}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Surface component={Paper} {...others}>
      {data ? (
        <Stack>
          <Table striped horizontalSpacing="xs" verticalSpacing="xs">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Description</Table.Th>
                <Table.Th>Unit Price</Table.Th>
                <Table.Th>Amount</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows}
              <Table.Tr>
                <Table.Td></Table.Td>
                <Table.Td>Subtotal</Table.Td>
                <Table.Td>$140</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td></Table.Td>
                <Table.Td>Shipping</Table.Td>
                <Table.Td>$5</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td></Table.Td>
                <Table.Td>Discount</Table.Td>
                <Table.Td>2.5%</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td></Table.Td>
                <Table.Td>Total</Table.Td>
                <Table.Td>$137.75</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Stack>
      ) : (
        <p>Invoice not selected</p>
      )}
    </Surface>
  );
};

export default Syllabus;
