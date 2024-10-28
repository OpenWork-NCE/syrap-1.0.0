'use client';

import { Anchor, Container, PaperProps, Stack } from '@mantine/core';
import { InvoiceDetailsCard, PageHeader } from '@/components';
import { PATH_DASHBOARD, PATH_INVOICES } from '@/routes';
import { University } from '@/types/real-types';
import UniversitiyDetailsCard from '@/components/UniversitiyDetailsCard/UniversitiyDetailsCard';
import { fakeData } from '@/components/UniversitiesTable/makeData';
import { useUniversities } from '@/app/lib/store';
import Loading from '@/app/loading';

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

export default async function UniversityDetails({
  params,
}: {
  params: { id: string };
}) {
  const universities = await fetch(
    new URL('/api/universities', 'http://localhost:3000'),
  ).then(async (res) => {
    return res.json();
  });
  const university = await universities.data.find(
    (_: University) => Number(_.id) === Number(params.id),
  );

  return (
    <>
      <>
        <title>
          Université -{' '}
          {university ? university?.name : 'Université non trouvée'} | SYRAP
        </title>
        <meta name="description" content="" />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title={`${university?.name}`} breadcrumbItems={items} />
          <UniversitiyDetailsCard data={university} {...PAPER_PROPS} />
        </Stack>
      </Container>
    </>
  );
}
