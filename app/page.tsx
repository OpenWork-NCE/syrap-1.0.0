'use client';

import {
  Box,
  Button,
  Grid,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import Link from 'next/link';
import { PATH_AUTH } from '@/routes';
import { IconLogin } from '@tabler/icons-react';

import GuestLayout from '@/layout/Guest';
import classes from './page.module.css';

export default function Home() {
  return (
    <>
      <>
        <title>SYRAP | Harmonisation des programmes</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </>
      <GuestLayout>
        <Box className={classes.hero}>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 2, md: 1 }}>
              <Stack>
                <Text>CAMEROUN</Text>
                <Title className={classes.title}>
                  Par un commun accord entre le{' '}
                  <Text component="span" inherit className={classes.redCmr}>
                    CENADI{', '}
                  </Text>
                  le{' '}
                  <Text component="span" inherit className={classes.greenCmr}>
                    MINESUP{' '}
                  </Text>
                  et les{' '}
                  <Text component="span" inherit className={classes.yellowCmr}>
                    Universités et écoles de formation{' '}
                  </Text>
                  du Cameroun{', '}
                  <Text component="span" inherit className={classes.highlight}>
                    SYRAP{' '}
                  </Text>
                  est née.
                </Title>
                <Text>
                  Dans un soucis d'harmonisation des programmes d'IPES et
                  Universités de Tutelle cette plateforme se veut
                  l'encyclopédique de reference harmonisé des programmes des
                  IPES et des Universités de tutelle incluant les traitement des
                  unités d'enseignement et leurs concordance.
                </Text>
                <Group my="lg">
                  <Button
                    component={Link}
                    href={PATH_AUTH.signin}
                    size="md"
                    leftSection={<IconLogin size={18} />}
                  >
                    Portail de connexion
                  </Button>
                </Group>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 1, md: 2 }}>
              <Image src={'/thumbnail-cmr.jpg'} alt="/" radius="md" />
            </Grid.Col>
          </Grid>
        </Box>
      </GuestLayout>
    </>
  );
}
