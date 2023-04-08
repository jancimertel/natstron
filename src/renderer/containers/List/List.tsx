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

const useStyles = createStyles((theme) => ({}));

interface ListProps {}
export default function List({}: ListProps) {
  const { classes } = useStyles();

  return (
    <>
      <Box>header</Box>
      <Box>body</Box>
    </>
  );
}
