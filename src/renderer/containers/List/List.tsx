import React, { useState } from 'react';
import {
  Navbar,
  ScrollArea,
  createStyles,
  Box,
  Button,
  clsx,
  Input,
  Text,
} from '@mantine/core';
import { connectNats, subscribeNats, unsubscribeNats } from 'renderer/ipc';

const useStyles = createStyles((theme) => ({
  header: {
    borderBottom: `1px solid ${theme.colors.gray[8]}`,
  },
}));

interface ListProps {
  eventName: string;
  events: any[];
}
export default function List({ eventName, events }: ListProps) {
  const { classes } = useStyles();

  return (
    <>
      <Box className={classes.header}>
        <Text size="lg">{eventName}</Text>
      </Box>
      <Box>
        {events
          ? events.map((e) => (
              <div>
                {e.time.toISOString()} | {e.data}
              </div>
            ))
          : null}
      </Box>
    </>
  );
}
