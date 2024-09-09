'use client';

import { useEffect, useState } from 'react';
import { Anchor, Container, PaperProps, Stack } from '@mantine/core';
import { InvoiceDetailsCard, PageHeader } from '@/components';
import { PATH_DASHBOARD, PATH_INVOICES } from '@/routes';
import { Invoices, University } from '@/types';
import { useFetchData } from '@/hooks';
import UniversitiyDetailsCard from '@/components/UniversitiyDetailsCard/UniversitiyDetailsCard';
import { fakeData } from '@/components/UniversitiesTable/makeData';

const items = [
  { title: 'Cenadi', href: PATH_DASHBOARD.default },
  { title: 'Universités', href: PATH_INVOICES.invoices.all },
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

function UniversityDetails({ params }: { params: { id: string } }) {
  const [selectedData, setSelectedData] = useState<University>();
  // const {
  //   data: universityData,
  //   loading: universityLoading,
  //   error: universityError,
  // } = useFetchData(fakeData);
  const universityData = fakeData;

  useEffect(() => {
    setSelectedData(universityData.find((_: University) => _.id === params.id));
  }, [universityData, params]);

  return (
    <>
      <>
        <title>
          Université -{' '}
          {selectedData ? selectedData?.name : 'Université non trouvée'} | SYRAP
        </title>
        <meta name="description" content="" />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title={`${selectedData?.name}`} breadcrumbItems={items} />
          <UniversitiyDetailsCard data={selectedData} {...PAPER_PROPS} />
        </Stack>
      </Container>
    </>
  );
}

export default UniversityDetails;
