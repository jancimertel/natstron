import { Button } from '@mantine/core';
import { useSelector } from 'react-redux';
import List from 'renderer/containers/List/List';
import { eventsSelector } from 'renderer/store/events';

import icon from '../../../../assets/icon.svg';
import './Main.css';

export default function App() {
  const { eventDetail, events } = useSelector(eventsSelector);

  return (
    <div>
      {eventDetail && (
        <List
          eventName={eventDetail}
          events={eventDetail ? events[eventDetail] : []}
        />
      )}
    </div>
  );
}
