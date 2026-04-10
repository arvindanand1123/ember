import { type CSSProperties, useEffect, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';

import { GlobalStyles, SpecContainer, theme } from '../components';
import { getProfilingSnapshot, type ProfilingEvent, type ProfilingSnapshot } from '../profiling';

const Root = styled(SpecContainer.build({
  minHeight: '100vh',
  padding: 6,
}))`
  background:
    radial-gradient(circle at top right, rgba(255, 159, 28, 0.14), transparent 32%),
    ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
`;

const Shell = SpecContainer.build({
  stackType: 'col',
  gap: 4,
  maxWidth: 760,
});

const Header = SpecContainer.build({
  stackType: 'col',
  gap: 6,
});

const SessionCard = styled(SpecContainer.build({
  stackType: 'col',
  gap: 4,
  padding: 4,
  surface: 'surfaceElevated',
  radius: 'lg',
  shadow: 'md',
}))`
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
`;

const EventList = SpecContainer.build({
  stackType: 'col',
  gap: 3,
});

const EventCard = SpecContainer.build({
  stackType: 'col',
  paddingX: 4,
  paddingY: 14,
  gap: 4,
  border: 'default',
  radius: 'lg',
  surface: 'surface',
  shadow: 'sm',
});

const shellStyle: CSSProperties = {
  margin: '0 auto',
};

const eyebrowStyle: CSSProperties = {
  fontSize: theme.fontSizes.xs,
  fontWeight: theme.fontWeights.semibold,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: theme.colors.textSubtle,
};

const titleStyle: CSSProperties = {
  margin: 0,
  textAlign: 'left',
};

const subtitleStyle: CSSProperties = {
  margin: 0,
  color: theme.colors.textMuted,
};

const sessionLabelStyle: CSSProperties = {
  fontSize: theme.fontSizes.xs,
  color: theme.colors.textSubtle,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
};

const sessionValueStyle: CSSProperties = {
  marginTop: 6,
  fontFamily: theme.fonts.mono,
  fontSize: theme.fontSizes['2xl'],
  fontWeight: theme.fontWeights.semibold,
};

const eventNameStyle: CSSProperties = {
  fontFamily: theme.fonts.mono,
  fontSize: theme.fontSizes.sm,
  fontWeight: theme.fontWeights.semibold,
};

const eventTimestampStyle: CSSProperties = {
  marginTop: 4,
  fontSize: theme.fontSizes.xs,
  color: theme.colors.textSubtle,
};

const eventDetailsStyle: CSSProperties = {
  margin: '10px 0 0',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  fontFamily: theme.fonts.mono,
  fontSize: theme.fontSizes.xs,
  lineHeight: String(theme.lineHeights.relaxed),
  color: theme.colors.textMuted,
};

function formatTimestamp(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString();
}

function formatEventDetails(event: ProfilingEvent) {
  return JSON.stringify(event.details, null, 2);
}

export default function ProfilerApp() {
  const [snapshot, setSnapshot] = useState<ProfilingSnapshot>({
    sessionId: 0,
    events: [],
  });

  useEffect(() => {
    let active = true;

    const poll = async () => {
      try {
        const nextSnapshot = await getProfilingSnapshot();
        if (active) {
          setSnapshot(nextSnapshot);
        }
      } catch (error) {
        if (active) {
          console.warn('[profile] failed to fetch snapshot', error);
        }
      }
    };

    void poll();
    const intervalId = window.setInterval(() => {
      void poll();
    }, 500);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles/>
      <Root>
        <Shell style={shellStyle}>
          <Header>
            <div style={eyebrowStyle}>Profiler</div>
            <h1 style={titleStyle}>Render Loop Events</h1>
            <p style={subtitleStyle}>Polling the shared profiler store for the active document load session.</p>
          </Header>

          <SessionCard>
            <div style={sessionLabelStyle}>Session</div>
            <div style={sessionValueStyle}>{snapshot.sessionId}</div>
          </SessionCard>

          <EventList>
            {snapshot.events.length === 0 ? (
              <EventCard>
                <div style={eventNameStyle}>No events yet</div>
                <div style={eventTimestampStyle}>Load a document to populate the profiler session.</div>
              </EventCard>
            ) : snapshot.events.map((event) => (
              <EventCard key={event.id}>
                <div style={eventNameStyle}>{event.name}</div>
                <div style={eventTimestampStyle}>{formatTimestamp(event.timestamp)}</div>
                <pre style={eventDetailsStyle}>{formatEventDetails(event)}</pre>
              </EventCard>
            ))}
          </EventList>
        </Shell>
      </Root>
    </ThemeProvider>
  );
}
