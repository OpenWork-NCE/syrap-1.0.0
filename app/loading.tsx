import { Center, Loader, Text, Stack } from '@mantine/core';

export default function Loading() {
  return (
    <Center pt={80}>
      <Stack align="center">
        <Loader />
        <Text>Accroche-toi ...</Text>
      </Stack>
    </Center>
  );
}
