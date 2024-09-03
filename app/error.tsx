'use client';

import { useEffect } from 'react';
import {
  Button,
  Center,
  Group,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useRouter } from 'next/navigation';
import { IconHome2, IconRefresh } from '@tabler/icons-react';
import classes from './error.module.css';

function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const theme = useMantineTheme();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <>
      <>
        <title>Server Error | SYRAP</title>
        <meta
          name="description"
          content=""
        />
      </>
      <Center
        style={{
          height: '100vh',
          width: '100vw',
          backgroundColor: theme.colors.gray[0],
          color: theme.colors.dark[8],
        }}
      >
        <Stack>
          <div className={classes.label}>400</div>
          <Title className={classes.title}>Sorry, unexpected error..</Title>
          <Text fz="md" ta="center" className={classes.description}>
            {error.toString()}
          </Text>
          <Group justify="center" mt="md">
            <Button
              size="md"
              leftSection={<IconRefresh size={18} />}
              variant="subtle"
              onClick={() => window.location.reload}
            >
              Refresh Page
            </Button>
            <Button
              size="md"
              variant="subtle"
              leftSection={<IconHome2 size={18} />}
              onClick={() => router.push('/')}
            >
              Take me to home page
            </Button>
          </Group>
        </Stack>
      </Center>
    </>
  );
}

export default Error;
