import { createContext } from 'react';
import { INotification } from '../types/Notification.types';

export interface NotificationContextProps {
  addNotification: (notification: INotification, durationMs?: number) => void;
}

const NotificationContext = createContext<NotificationContextProps>({
  // eslint-disable-next-line
  addNotification: () => {},
});

export default NotificationContext;
