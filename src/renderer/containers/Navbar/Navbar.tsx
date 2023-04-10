import React, { useEffect, useRef, useState } from 'react';
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
  Accordion,
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
import {
  connectionSelector,
  load,
  LocalStorageTypes,
  setHistory,
} from 'renderer/store/connection';
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
  const { subscriptions, history } = useSelector(connectionSelector);
  const eventTypes = useSelector(eventTypesSelector);
  const dispatch = useAppDispatch();
  const [customNatsHost, setCustomNatsHost] = useState('');
  const newEventRef = useRef(null);

  useEffect(() => {
    dispatch(setHistory(load(LocalStorageTypes.NatsEvents) as string[]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <Accordion defaultValue="newevent">
          <Accordion.Item value="newevent">
            <Accordion.Control>New event</Accordion.Control>
            <Accordion.Panel>
              <TextInput
                ref={newEventRef}
                rightSection={
                  <ActionIcon onClick={() => addNewEvent()}>
                    <IconPlugConnected />
                  </ActionIcon>
                }
              />
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="subscribed">
            <Accordion.Control>Subscribed</Accordion.Control>
            <Accordion.Panel>
              {!subscriptions.length ? <Text>No subscription yet</Text> : null}
              {subscriptions.map((s) => (
                <Box key={s} style={{ display: 'flex', alignItems: 'center' }}>
                  <Text size="sm">{s}</Text>
                  <Group style={{ marginLeft: 'auto', gap: 0 }}>
                    <ActionIcon onClick={() => unsubscribeNats(s)}>
                      <IconPlugOff size={16} />
                    </ActionIcon>
                  </Group>
                </Box>
              ))}
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="events">
            <Accordion.Control>Events</Accordion.Control>
            <Accordion.Panel>
              {!eventTypes.length ? <Text>No event yet</Text> : null}
              {(eventTypes || []).map((s) => (
                <Box
                  key={s.type}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <Text size="sm">
                    {s.type} ({s.count})
                  </Text>
                  <Group style={{ marginLeft: 'auto', gap: 0 }}>
                    <ActionIcon
                      onClick={() => dispatch(setEventDetail(s.type))}
                    >
                      <IconZoomCode size={16} />
                    </ActionIcon>
                  </Group>
                </Box>
              ))}
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="history">
            <Accordion.Control>History</Accordion.Control>
            <Accordion.Panel>
              {!history.length ? <Text>No history yet</Text> : null}
              {(history || []).map((s) => (
                <Box key={s} style={{ display: 'flex', alignItems: 'center' }}>
                  <Text size="sm">{s}</Text>
                  <Group style={{ marginLeft: 'auto', gap: 0 }}>
                    <ActionIcon onClick={() => subscribeNats(s)}>
                      <IconPlugConnected />
                    </ActionIcon>
                  </Group>
                </Box>
              ))}
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="utils">
            <Accordion.Control>Utils</Accordion.Control>
            <Accordion.Panel>
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
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Navbar.Section>

      <Navbar.Section className={classes.section}>
        {/* Footer with user */}
      </Navbar.Section>
    </Navbar>
  );
}
