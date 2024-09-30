import { Badge, Group, Paper, PaperProps, Text } from '@mantine/core';
import classes from './Stats.module.css';
import { IconArrowDownRight, IconArrowUpRight } from '@tabler/icons-react';
import { Surface } from '@/components';

type StatsCardProps = {
  data: { title: string; value: string; diff: number; period?: string };
} & PaperProps;

const StatsCard = ({ data, ...others }: StatsCardProps) => {
  const { title, value, period, diff } = data;
  const DiffIcon = diff > 0 ? IconArrowUpRight : IconArrowDownRight;

  return (
    <Surface component={Paper} {...others}>
      <Group justify="space-between">
        <Text size="xs" c="dimmed" className={classes.title}>
          {title}
        </Text>
        {/*{period && (*/}
        {/*  <Badge variant="filled" radius="sm">*/}
        {/*    {period}*/}
        {/*  </Badge>*/}
        {/*)}*/}
      </Group>

      <Group align="flex-end" gap="xs" mt={25}>
        <Text className={classes.value}>{value}</Text>
      </Group>
    </Surface>
  );
};

export default StatsCard;
