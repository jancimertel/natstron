import React, { useState } from 'react';
import {
  Navbar,
  ScrollArea,
  createStyles,
  Box,
  Button,
  clsx,
  Input,
} from '@mantine/core';
import { connectNats, subscribeNats, unsubscribeNats } from 'renderer/ipc';
import Connect from 'renderer/components/Connect/Connect';
import events from '../../../../assets/events.json';

const useStyles = createStyles((theme) => ({
  navbar: {},
  section: {
    borderBottom: `1px solid ${theme.colors.gray[8]}`,
  },
}));

interface AppNavbarProps {
  open: boolean;
}
export default function AppNavbar({ open }: AppNavbarProps) {
  const { classes } = useStyles();
  const [customNatsHost, setCustomNatsHost] = useState('');

  if (!open) {
    return null;
  }

  return (
    <Navbar className={clsx(classes.navbar)} p="xs" width={{ base: '20rem' }}>
      <Navbar.Section className={classes.section} p="sm">
        <Connect />
      </Navbar.Section>

      <Navbar.Section
        className={classes.section}
        grow
        component={ScrollArea}
        p="sm"
      >
        <Button
          fullWidth
          size="xs"
          variant="subtle"
          onClick={() => unsubscribeNats()}
        >
          unsubscribe all
        </Button>
        {events.map((e) => (
          <Button
            key={e}
            fullWidth
            size="xs"
            variant="subtle"
            onClick={() => subscribeNats(e)}
          >
            {e}
          </Button>
        ))}
      </Navbar.Section>

      <Navbar.Section className={classes.section}>
        {/* Footer with user */}
      </Navbar.Section>
    </Navbar>
  );
}
