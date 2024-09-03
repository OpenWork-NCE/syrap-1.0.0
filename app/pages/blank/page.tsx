'use client';

import {
  Anchor,
  Container,
  Paper,
  PaperProps,
  Stack,
  Text,
} from '@mantine/core';
import { PATH_DASHBOARD } from '@/routes';
import { PageHeader, Surface } from '@/components';
import { Metadata } from 'next';

const items = [
  { title: 'Dashboard', href: PATH_DASHBOARD.default },
  { title: 'Pages', href: '#' },
  { title: 'Blank', href: '#' },
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

function Pricing() {
  return (
    <>
      <>
        <title>Blank page | SYRAP</title>
        <meta
          name="description"
          content=""
        />
      </>
      <Container>
        <Stack gap="lg">
          <PageHeader title="Blank page" breadcrumbItems={items} />
          <Surface component={Paper} {...PAPER_PROPS}>
            <Text size="lg" fw={600} mb="xl">
              Empty card header
            </Text>
            <Text>Empty card text</Text>
          </Surface>
        </Stack>
      </Container>
    </>
  );
}

export default Pricing;
