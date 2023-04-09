import React, { useRef, useState } from 'react';
import {
  Navbar,
  ScrollArea,
  createStyles,
  Box,
  Button,
  clsx,
  Input,
  Text,
  TextInput,
  ActionIcon,
  Group,
} from '@mantine/core';
import {
  connectNats,
  subscribeNats,
  unsubscribeNats,
  unsubscribeNatsAll,
} from 'renderer/ipc';
import Connect from 'renderer/components/Connect/Connect';
import {
  IconDetails,
  IconGlass,
  IconHttpConnect,
  IconPlugConnected,
  IconPlugOff,
  IconZoomCode,
} from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import { connectionSelector } from 'renderer/store/connection';
import {
  eventsSelector,
  eventTypesSelector,
  setEventDetail,
} from 'renderer/store/events';
import { useAppDispatch } from 'renderer/store';
import events from '../../../../assets/events.json';

const useStyles = createStyles((theme) => ({
  navbar: {},
  section: {
    borderBottom: `1px solid ${theme.colors.gray[8]}`,
  },
  subsection: {
    paddingBottom: '1rem',
    paddingTop: '.25rem',
    borderBottom: `1px solid ${theme.colors.gray[8]}`,
  },
}));

interface AppNavbarProps {
  open: boolean;
}
export default function AppNavbar({ open }: AppNavbarProps) {
  const { classes } = useStyles();
  const { subscriptions } = useSelector(connectionSelector);
  const eventTypes = useSelector(eventTypesSelector);
  const dispatch = useAppDispatch();
  const [customNatsHost, setCustomNatsHost] = useState('');
  const newEventRef = useRef(null);

  if (!open) {
    return null;
  }

  function addNewEvent() {
    subscribeNats((newEventRef.current as any).value);
  }

  return (
    <Navbar className={clsx(classes.navbar)} p="xs" width={{ base: '25rem' }}>
      <Navbar.Section className={classes.section} p="sm">
        <Connect />
      </Navbar.Section>

      <Navbar.Section
        className={classes.section}
        grow
        component={ScrollArea}
        p="sm"
      >
        <Box className={classes.subsection}>
          <Text size="xs">New event</Text>
          <TextInput
            ref={newEventRef}
            rightSection={
              <ActionIcon onClick={() => addNewEvent()}>
                <IconPlugConnected />
              </ActionIcon>
            }
          />
        </Box>

        <Box className={classes.subsection}>
          <Text size="xs">Subscribed</Text>
          {subscriptions.map((s) => (
            <Box key={s} style={{ display: 'flex', alignItems: 'center' }}>
              <Text size="sm">{s}</Text>
              <Group style={{ marginLeft: 'auto', gap: 0 }}>
                <ActionIcon onClick={() => dispatch(setEventDetail(s))}>
                  <IconZoomCode size={16} />
                </ActionIcon>
                <ActionIcon onClick={() => unsubscribeNats(s)}>
                  <IconPlugOff size={16} />
                </ActionIcon>
              </Group>
            </Box>
          ))}
        </Box>

        <Box className={classes.subsection}>
          <Text size="xs">Events</Text>
          {(eventTypes || []).map((s) => (
            <Box key={s} style={{ display: 'flex', alignItems: 'center' }}>
              <Text size="sm">{s}</Text>
              <Group style={{ marginLeft: 'auto', gap: 0 }}>
                <ActionIcon onClick={() => dispatch(setEventDetail(s))}>
                  <IconZoomCode size={16} />
                </ActionIcon>
              </Group>
            </Box>
          ))}
        </Box>

        <Box className={classes.subsection}>
          <Text size="xs">Utils</Text>
          <Button
            fullWidth
            size="xs"
            variant="subtle"
            onClick={() => unsubscribeNatsAll()}
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
        </Box>
      </Navbar.Section>

      <Navbar.Section className={classes.section}>
        {/* Footer with user */}
      </Navbar.Section>
    </Navbar>
  );
}
