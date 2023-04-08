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

const useStyles = createStyles((theme) => ({
  navbar: {
    marginLeft: '0',
  },
  closed: {
    marginLeft: '-2rem',
  },
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
    <Navbar
      className={clsx(classes.navbar, open ? null : classes.closed)}
      p="xs"
      width={{ base: '10rem' }}
    >
      <Navbar.Section className={classes.section} p="sm">
        <Box>
          <Input
            defaultValue={customNatsHost}
            onChange={(e) => {
              console.log(e.target.value);
              setCustomNatsHost(e.target.value);
            }}
          />
          <Button onClick={() => connectNats(customNatsHost)}>Connect</Button>
        </Box>
      </Navbar.Section>

      <Navbar.Section
        className={classes.section}
        grow
        component={ScrollArea}
        p="sm"
      >
        <Button onClick={() => unsubscribeNats()}>unsubscribe all</Button>;
        <Button onClick={() => subscribeNats('indicator.binance.ETHUSDT_spot')}>
          indicator.binance.ETHUSDT_spot
        </Button>
      </Navbar.Section>

      <Navbar.Section className={classes.section}>
        {/* Footer with user */}
      </Navbar.Section>
    </Navbar>
  );
}
