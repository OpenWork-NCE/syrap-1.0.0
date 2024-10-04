'use client';

import {
  Center,
  Flex,
  Grid,
  Paper,
  Stack,
  useMantineColorScheme,
} from '@mantine/core';
import Image from 'next/image';
import React, { ReactNode } from 'react';

type AuthProps = {
  children: ReactNode;
};

function SignInLayout({ children }: AuthProps) {
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  return (
    <Center
      style={{
        height: '100vh',
        width: '100vw',
      }}
    >
      <Flex flex={1} align={'center'} justify={'center'} wrap={'wrap'}>
        <Stack flex={1} align={'center'} justify={'center'}>
          <Center>
            <Image
              src="/logo-no-background-colorfull.png"
              alt="Syrap logo"
              width={192}
              height={96}
              style={{ objectFit: 'contain' }}
            />
          </Center>
          {children}
        </Stack>
        <Stack
          flex={1}
          align={'center'}
          justify={'center'}
          style={{
            width: '100%', // Ensure the stack takes full width
            height: '100vh', // Takes full viewport height
            // backgroundColor: colorScheme === 'dark' ? '#fff' : '#000', // Set background color to black
            backgroundColor: '#ffeccc',
          }}
        >
          <Image
            src={
              // colorScheme === 'dark'
              //   ? '/thumbnail-cmr-l.jpg'
              //   : '/thumbnail-cmr.jpg'
              '/thumbnail.png'
            } // Replace with your image path or URL
            alt="Your description"
            width={650} // Set image width
            height={650} // Set image height
            style={{ objectFit: 'contain' }} // Optional: Ensure image fits within the bounds
          />
        </Stack>
      </Flex>
    </Center>
  );
}

export default SignInLayout;
