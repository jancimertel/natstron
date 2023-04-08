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

import { useState } from 'react';
import ipc, { ChannelTypes } from './ipc';
import Main from './pages/Main/Main';
import AppNavbar from './containers/Navbar/Navbar';

export default function App() {
  const [open, setOpen] = useState(true);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: 'dark',
        colors: {
          info: ['#31708F'],
        },
      }}
    >
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
                <IconChevronLeft size="sx" />
              ) : (
                <IconChevronRight size="sx" />
              )}
            </ActionIcon>
          </Header>
        }
        navbar={<AppNavbar open={open} />}
      >
        ;
        <div>
          <Router>
            <Routes>
              <Route path="/" element={<Main />} />
            </Routes>
          </Router>
        </div>
      </AppShell>
    </MantineProvider>
  );
}
const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);

ipc();
// calling IPC exposed from preload script
window.electron.ipcRenderer.once(ChannelTypes.IPCExample, (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron.ipcRenderer.sendMessage(ChannelTypes.IPCExample, ['ping']);
