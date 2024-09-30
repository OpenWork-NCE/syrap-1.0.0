'use client';

import { useEffect, useState } from 'react';
import { Anchor, Container, PaperProps, Stack } from '@mantine/core';
import { InvoiceDetailsCard, IpesDetailsCard, PageHeader } from '@/components';
import { PATH_DASHBOARD, PATH_INVOICES } from '@/routes';
import { Invoices, Ipes } from '@/types';
import { fakeData } from '@/components/IpesTable/makeData';

const items = [
  { title: 'Cenadi', href: PATH_DASHBOARD.default },
  { title: 'Ipes', href: PATH_INVOICES.invoices.all },
  { title: 'Details', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

const PAPER_PROPS: PaperProps = {
  p: 'xs',
  shadow: 'xs',
  radius: 'xs',
};

function UniversityDetails({ params }: { params: { id: string } }) {
  const [selectedData, setSelectedData] = useState<Ipes>();
  // const {
  //   data: ipesData,
  //   loading: ipesLoading,
  //   error: ipesError,
  // } = useFetchData(fakeData);
  const ipesData = fakeData;

  useEffect(() => {
    setSelectedData(ipesData.find((_: Ipes) => _.id === params.id));
  }, [ipesData, params]);

  return (
    <>
      <>
        <title>
          Ipes - {selectedData ? selectedData?.name : 'Ipes non trouvée'} |
          SYRAP
        </title>
        <meta name="description" content="" />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title={`${selectedData?.name}`} breadcrumbItems={items} />
          <IpesDetailsCard data={selectedData} {...PAPER_PROPS} />
        </Stack>
      </Container>
    </>
  );
}

export default UniversityDetails;
