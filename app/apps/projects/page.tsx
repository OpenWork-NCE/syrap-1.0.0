'use client';

import {
  Anchor,
  CardProps,
  Container,
  SimpleGrid,
  Skeleton,
  Stack,
} from '@mantine/core';
import { PATH_DASHBOARD } from '@/routes';
import { ErrorAlert, PageHeader, ProjectsCard } from '@/components';
import { useFetchData } from '@/hooks';

const items = [
  { title: 'Dashboard', href: PATH_DASHBOARD.default },
  { title: 'Apps', href: '#' },
  { title: 'Projects', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

const ICON_SIZE = 18;

const CARD_PROPS: Omit<CardProps, 'children'> = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
};

function Projects() {
  const {
    data: projectsData,
    loading: projectsLoading,
    error: projectsError,
  } = useFetchData('/mocks/Projects2.json');
  const projectItems = projectsData.map((p: any) => (
    <ProjectsCard key={p.id} {...p} {...CARD_PROPS} />
  ));

  return (
    <>
      <>
        <title>Projects | SYRAP</title>
        <meta
          name="description"
          content=""
        />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Projects" breadcrumbItems={items} />
          {projectsError ? (
            <ErrorAlert
              title="Error loading projects"
              message={projectsError.toString()}
            />
          ) : (
            <SimpleGrid
              cols={{ base: 1, sm: 2, lg: 3, xl: 4 }}
              spacing={{ base: 10, sm: 'xl' }}
              verticalSpacing={{ base: 'md', sm: 'xl' }}
            >
              {projectsLoading
                ? Array.from({ length: 8 }).map((o, i) => (
                    <Skeleton
                      key={`project-loading-${i}`}
                      visible={true}
                      height={300}
                    />
                  ))
                : projectItems}
            </SimpleGrid>
          )}
        </Stack>
      </Container>
    </>
  );
}

export default Projects;
