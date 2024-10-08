import { useEffect, useState } from 'react';
import { Box, Collapse, Group, Text, UnstyledButton } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { usePathname, useRouter } from 'next/navigation';
import * as _ from 'lodash';
import classes from './Links.module.css';

interface LinksGroupProps {
  icon?: any;
  label: string;
  initiallyOpened?: boolean;
  link?: string;
  links?: {
    label: string;
    icon?: any;
    link: string;
  }[];
  closeSidebar: () => void;
}

export function LinksGroup(props: LinksGroupProps) {
  const {
    icon: Icon,
    label,
    initiallyOpened,
    link,
    links,
    closeSidebar,
  } = props;
  const router = useRouter();
  const pathname = usePathname();
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const [currentPath, setCurrentPath] = useState<string | undefined>();
  const ChevronIcon = IconChevronRight;

  const items = (hasLinks ? links : []).map((linkItem) => {
    const { label, icon: Icon, link } = linkItem;
    return (
      <UnstyledButton
        component="button"
        className={classes.link}
        onClick={() => {
          router.push(link);
          closeSidebar();
        }}
        key={label}
        data-active={link.toLowerCase() === pathname || undefined}
        mb={2}
      >
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '4px 32px',
          }}
        >
          {/*<Icon size={18} />*/}
          <Box ml="md">{label}</Box>
        </Box>
      </UnstyledButton>
    );
  });

  useEffect(() => {
    const paths = pathname.split('/');
    setOpened(paths.includes(label.toLowerCase()));
    setCurrentPath(_.last(paths)?.toLowerCase() || undefined);
  }, [pathname, label]);

  return (
    <>
      <UnstyledButton
        onClick={() => {
          setOpened((o) => !o);
          link && router.push(link || '#');
          closeSidebar();
        }}
        className={classes.control}
        data-active={opened || undefined}
      >
        <Group justify="space-between" gap={0}>
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '4px 32px',
            }}
          >
            <Icon size={18} />
            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks && (
            <ChevronIcon
              className={classes.chevron}
              size="1rem"
              stroke={1.5}
              style={{
                transform: opened ? `rotate(90deg)` : 'none',
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}
