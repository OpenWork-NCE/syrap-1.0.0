import {
  ActionIcon,
  ActionIconProps,
  Button,
  Container,
  Divider,
  Flex,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { Logo } from '@/components';
import {
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconWorld,
} from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { PATH_DOCS, PATH_GITHUB } from '@/routes';
import classes from './FooterNav.module.css';

const ICON_SIZE = 18;

const ACTION_ICON_PROPS: ActionIconProps = {
  size: 'lg',
  color: 'primary.3',
  variant: 'transparent',
};

const FooterNav = () => {
  const mobile_match = useMediaQuery('(max-width: 425px)');

  return (
    <footer className={classes.footer}>
      <Container fluid>
        <Divider mt="xl" mb="md" />
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          gap={{ base: 'sm', sm: 'lg' }}
          justify={{ base: 'center', sm: 'space-between' }}
          align={{ base: 'center' }}
        >
          <Logo c="white" />
          <Flex gap="xs" justify="flex-end" wrap="nowrap">
            <Text
              fz="sm"
              component="a"
              // href={PATH_GITHUB.org}
              target="_blank"
            >
              &copy;&nbsp;{new Date().getFullYear()}&nbsp;CENADI
            </Text>
          </Flex>
        </Flex>
      </Container>
    </footer>
  );
};

export default FooterNav;
