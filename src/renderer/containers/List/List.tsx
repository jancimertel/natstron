import { createStyles, Box, Text } from '@mantine/core';

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
                {e.time} | {e.data}
              </div>
            ))
          : null}
      </Box>
    </>
  );
}
