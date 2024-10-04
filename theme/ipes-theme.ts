import { ActionIcon, createTheme, Loader } from '@mantine/core';

export const myTheme = createTheme({
  primaryColor: 'teal',
  defaultRadius: 'md',
  focusRing: 'always',
  fontFamily: 'EB_Garamond, sans-serif',
  headings: { fontFamily: 'EB_Garamond, sans-serif' },
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
