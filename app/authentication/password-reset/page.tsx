'use client';

import {
  Button,
  Group,
  Paper,
  rem,
  Text,
  TextInput,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';
import React from 'react';
import Link from 'next/link';
import { PATH_AUTH, PATH_DASHBOARD } from '@/routes';
import { useMediaQuery } from '@mantine/hooks';
import classes from './page.module.css';
import { Surface } from '@/components';
import { Metadata } from 'next';

const metadata: Metadata = {
  title: 'Mot de passe oublié | SYRAP',
  description:
    '',
};

function Page() {
  const mobile_match = useMediaQuery('(max-width: 425px)');

  return (
    <>
      <>
        <title>Mot de passe oublié | SYRAP</title>
        <meta
          name="description"
          content=""
        />
      </>
      <Title ta="center" order={2}>Mot de passe oublié?</Title>
      <Text ta="center">Entrez votre email afin de retrouver votre compte</Text>

      <Surface component={Paper} className={classes.card}>
        <TextInput label="Votre mail" placeholder="me@syrap.admin" required />
        <Group justify="space-between" mt="lg" className={classes.controls}>
          <UnstyledButton
            component={Link}
            href={PATH_AUTH.signin}
            color="dimmed"
            className={classes.control}
          >
            <Group gap={2} align="center">
              <IconChevronLeft
                stroke={1.5}
                style={{ width: rem(14), height: rem(14) }}
              />
              <Text size="sm" ml={5}>
                Revenir au login
              </Text>
            </Group>
          </UnstyledButton>
          <Button
            component={Link}
            href={PATH_DASHBOARD.default}
            fullWidth={mobile_match}
          >
            Reinitialiser mon MDP
          </Button>
        </Group>
      </Surface>
    </>
  );
}

export default Page;
