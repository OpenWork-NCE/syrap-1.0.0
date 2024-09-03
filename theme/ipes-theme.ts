import { ActionIcon, createTheme, Loader } from '@mantine/core';

export const myTheme = createTheme({
  primaryColor: 'green',
  defaultRadius: 'md',
  focusRing: 'always',
  fontFamily: 'Raleway, sans-serif',
  headings: { fontFamily: 'Raleway, sans-serif' },
  components: {
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        variant: 'subtle',
      },
    }),
    Loader: Loader.extend({
      defaultProps: {
        type: 'bars',
      },
    }),
  },
});
