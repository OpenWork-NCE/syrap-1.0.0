'use client';

import { useEffect, useState } from 'react';
import { Anchor, Container, PaperProps, Stack } from '@mantine/core';
import { InvoiceDetailsCard, PageHeader } from '@/components';
import { PATH_DASHBOARD, PATH_INVOICES } from '@/routes';
import { Invoices } from '@/types';
import { useFetchData } from '@/hooks';

const items = [
  { title: 'Dashboard', href: PATH_DASHBOARD.default },
  { title: 'Invoices', href: PATH_INVOICES.invoices.all },
  { title: 'Details', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

const PAPER_PROPS: PaperProps = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
};

function InvoiceDetails({ params }: { params: { id: string } }) {
  const [selectedData, setSelectedData] = useState<Invoices>();
  const {
    data: invoicesData,
    loading: invoicesLoading,
    error: invoicesError,
  } = useFetchData('mocks/Invoices.json');

  useEffect(() => {
    setSelectedData(invoicesData.find((_: Invoices) => _.id === params.id));
  }, [invoicesData, params]);

  return (
    <>
      <>
        <title>
          Invoice - {selectedData ? selectedData?.id : 'No invoice found'} |
          SYRAP
        </title>
        <meta
          name="description"
          content=""
        />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            title={`Invoice #${selectedData?.id.slice(0, 7)}`}
            breadcrumbItems={items}
          />
          <InvoiceDetailsCard data={selectedData} {...PAPER_PROPS} />
        </Stack>
      </Container>
    </>
  );
}

export default InvoiceDetails;
