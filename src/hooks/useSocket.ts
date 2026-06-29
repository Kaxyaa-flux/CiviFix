import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { CivicIssue } from '../types';
import { triggerToast } from '../lib/toast';

interface UseSocketOptions {
  /** Called when a new_issue event arrives. Deduplicate before adding to state. */
  onNewIssue: (issue: CivicIssue) => void;
  /** Called alongside onNewIssue so the stats counter can be incremented. */
  onStatsIncrement: () => void;
}

export function useSocket({ onNewIssue, onStatsIncrement }: UseSocketOptions) {
  useEffect(() => {
    // Connects to window.location.origin (same-origin)
    const socket = io();

    socket.on('new_issue', (issue: CivicIssue) => {
      onNewIssue(issue);
      onStatsIncrement();
      triggerToast(`Live Alert: ${issue.title}`, 'info');
    });

    socket.on('disconnect', () => {
      triggerToast('Lost connection to real-time municipal data stream.', 'warning');
    });

    socket.io.on('reconnect', () => {
      triggerToast('Reconnected to real-time municipal data stream.', 'success');
    });

    return () => {
      socket.disconnect();
    };
  // Empty deps: socket lifecycle is tied to App mount — intentional.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
