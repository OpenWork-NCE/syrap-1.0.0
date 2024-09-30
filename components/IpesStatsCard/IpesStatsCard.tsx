import {
  Flex,
  MantineColor,
  Paper,
  PaperProps,
  Progress,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { Surface } from '@/components';
import CountUp from 'react-countup';
import { createElement } from 'react';

type IpesStatsCardProps = {
  amount: number;
  title: string;
  icon: any;
  color: MantineColor;
} & PaperProps;

const IpesStatsCard = (props: IpesStatsCardProps) => {
  const { amount, color, title, icon, ...others } = props;

  return (
    <Surface component={Paper} {...others}>
      <Flex align="center" justify="space-between" mb="md">
        <Stack gap={2}>
          <Text size="lg" fw={700} tt="capitalize">
            <CountUp end={amount} />
          </Text>
          <Text size="sm" c="dimmed" tt="capitalize">
            {title}
          </Text>
        </Stack>
        <ThemeIcon color={color} size="lg" radius="xl">
          {createElement(icon, { style: { fontSize: 16 } })}
        </ThemeIcon>
      </Flex>
    </Surface>
  );
};

export default IpesStatsCard;
