'use client';

import {
  Button,
  Center,
  Checkbox,
  Group,
  Paper,
  PasswordInput,
  Select,
  Text,
  TextInput,
  TextProps,
  Title,
} from '@mantine/core';
import Link from 'next/link';
import { PATH_AUTH, PATH_BOARD } from '@/routes';
import { Surface } from '@/components';
import classes from './page.module.css';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';

const LINK_PROPS: TextProps = {
  className: classes.link,
};

function Page() {
  const { push } = useRouter();
  const form = useForm({
    initialValues: {
      email: 'user@email.com',
      password: 'Demo@123',
      role: 'Cenadi',
    },

    // functions will be used to validate values at corresponding key
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email invalide'),
      password: (value) =>
        value && value?.length < 6
          ? 'Le mot de passe doit contenir au moins 06 caractères'
          : null,
    },
  });

  return (
    <>
      <>
        <title>Se connecter | SYRAP</title>
        <meta name="description" content="" />
      </>
      <Title ta="center" order={2}>
        Déja de retour ?
      </Title>
      <Text ta="center">Connectez-vous à votre compte pour continuer</Text>

      <Surface component={Paper} className={classes.card}>
        <form
          onSubmit={form.onSubmit(() => {
            push(
              form.values.role === 'Cenadi'
                ? PATH_BOARD.cenadi
                : form.values.role === 'Minesup'
                  ? PATH_BOARD.minesup
                  : PATH_BOARD.ipes,
            );
          })}
        >
          <TextInput
            label="Votre mail"
            placeholder="moi@syrap.admin"
            required
            classNames={{ label: classes.label }}
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Votre mot de passe"
            placeholder="Votre mot de passe"
            required
            mt="md"
            classNames={{ label: classes.label }}
            {...form.getInputProps('password')}
          />
          <Select
            label="Role utilisateur"
            placeholder="Choisir le rôle utilisateur"
            required
            mt="md"
            data={['Cenadi', 'Minesup', 'Ipes']}
            classNames={{ label: classes.label }}
            {...form.getInputProps('role')}
          />
          <Group justify="space-between" mt="lg">
            <Checkbox
              label="Se souvenir de moi"
              classNames={{ label: classes.label }}
            />
            <Text
              component={Link}
              href={PATH_AUTH.passwordReset}
              size="sm"
              {...LINK_PROPS}
            >
              Mot de passe oublié ?
            </Text>
          </Group>
          <Button
            fullWidth
            mt="xl"
            type="submit"
            color={
              form.values.role === 'Cenadi'
                ? 'indigo'
                : form.values.role === 'Minesup'
                  ? 'red'
                  : 'green'
            }
          >
            Se connecter
          </Button>
        </form>
        <Center mt="md">
          <Text
            fz="sm"
            ta="center"
            component={Link}
            href={PATH_AUTH.signup}
            {...LINK_PROPS}
          >
            Pas encore de compte ? Contacter l'administrateur
          </Text>
        </Center>
      </Surface>
    </>
  );
}

export default Page;
