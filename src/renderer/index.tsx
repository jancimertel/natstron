import { createRoot } from 'react-dom/client';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import {
  MantineProvider,
  AppShell,
  Aside,
  Text,
  Navbar,
  Button,
  Header,
  ActionIcon,
} from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import ipc, { ChannelTypes } from './ipc';
import Main from './pages/Main/Main';
import AppNavbar from './containers/Navbar/Navbar';
import store, { useAppDispatch } from './store';

export default function App() {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    ipc(store.dispatch);
  }, []);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: 'dark',
        colors: {
          info: ['#00208F', '#D9EDF7'],
          error: ['#D8000C', '#FFBABA'],
        },
      }}
    >
      <Provider store={store}>
        <Notifications />
        <AppShell
          padding="md"
          styles={(theme) => ({
            main: {
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[8]
                  : theme.colors.gray[0],
            },
          })}
          header={
            <Header height={30}>
              <ActionIcon variant="transparent" onClick={() => setOpen(!open)}>
                {open ? (
                  <IconChevronLeft size="12" />
                ) : (
                  <IconChevronRight size="12" />
                )}
              </ActionIcon>
            </Header>
          }
          navbar={<AppNavbar open={open} />}
        >
          <Router>
            <Routes>
              <Route path="/" element={<Main />} />
            </Routes>
          </Router>
        </AppShell>
      </Provider>
    </MantineProvider>
  );
}
const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once(ChannelTypes.IPCExample, (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron.ipcRenderer.sendMessage(ChannelTypes.IPCExample, ['ping']);
