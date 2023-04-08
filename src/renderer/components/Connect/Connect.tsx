import React, { useRef, useState } from 'react';
import {
  Navbar,
  ScrollArea,
  createStyles,
  Box,
  Button,
  clsx,
  Modal,
  Group,
  Select,
  Text,
  Input,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { connectNats, subscribeNats, unsubscribeNats } from 'renderer/ipc';
import connections from '../../../../assets/connections.json';

const useStyles = createStyles((theme) => ({
  select: {
    'div.mantine-Select-dropdown': {
      maxHeight: '100px',
      overflowY: 'auto',
    },
  },
}));

interface ConnectProps {}
export default function Connect() {
  const { classes } = useStyles();
  const [opened, { open, close }] = useDisclosure(false);
  const customHostRef = useRef(null);
  const selectRef = useRef(null);

  function connect() {
    let host;
    if (customHostRef.current && (customHostRef.current as any).value) {
      host = (customHostRef.current as any).value;
    } else {
      host = (selectRef.current as any).value;
    }

    connectNats(host);
  }

  return (
    <>
      <Modal opened={opened} size="auto" onClose={close} title="Connection">
        <Box mb="md">
          <Select
            className={classes.select}
            data={connections}
            withAsterisk
            label="Connection url"
            placeholder="Pick one"
            ref={selectRef}
          />
          <hr />
          <Text size="xs">Or custom</Text>
          <Input ref={customHostRef} />
        </Box>
        <Box>
          <Button onClick={() => connect()}>Connect</Button>
        </Box>
      </Modal>

      <Group position="center">
        <Button onClick={open}>Connect</Button>
      </Group>
    </>
  );
}
