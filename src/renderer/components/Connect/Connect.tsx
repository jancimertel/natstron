import { useEffect, useRef, useState } from 'react';
import {
  createStyles,
  Box,
  Button,
  Modal,
  Group,
  Select,
  Text,
  Input,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { connectNats, disconnectNats } from 'renderer/ipc';
import { useSelector } from 'react-redux';
import {
  connectionSelector,
  ConnectionStates,
} from 'renderer/store/connection';
import connections from '../../../../assets/connections.json';

const useStyles = createStyles((theme) => ({
  select: {
    'div.mantine-Select-dropdown': {
      maxHeight: '100px',
      overflowY: 'auto',
    },
  },
  connect: {
    background: theme.colors.info[0],
    '&:hover': {
      background: theme.colors.info[1],
    },
  },
  disconnect: {
    background: theme.colors.error[0],
    '&:hover': {
      background: theme.colors.error[1],
    },
  },
}));

interface ConnectProps {}
export default function Connect() {
  const { classes } = useStyles();
  const [opened, { open, close }] = useDisclosure(false);
  const customHostRef = useRef(null);
  const selectRef = useRef(null);
  const { state } = useSelector(connectionSelector);

  function connect() {
    let host;
    if (customHostRef.current && (customHostRef.current as any).value) {
      host = (customHostRef.current as any).value;
    } else {
      host = (selectRef.current as any).value;
    }

    connectNats(host);
  }

  useEffect(() => {
    if (state === ConnectionStates.Connected && opened) {
      close();
    }
  }, [state, opened, close]);

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
          {state === ConnectionStates.Disconnected && (
            <Button onClick={() => connect()}>Connect</Button>
          )}
        </Box>
      </Modal>

      <Group position="center">
        {state === ConnectionStates.Disconnected && (
          <Button className={classes.connect} onClick={open}>
            Connect
          </Button>
        )}
        {state === ConnectionStates.Connected && (
          <Button
            className={classes.disconnect}
            onClick={() => disconnectNats()}
          >
            Disconnect
          </Button>
        )}
      </Group>
    </>
  );
}
