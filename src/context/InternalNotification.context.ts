import { createContext } from 'react';
import { INotificationInternal } from '../types/Notification.types';

export interface InternalNotificationContextProps {
  notifications: INotificationInternal[];
}

const InternalNotificationContext = createContext<InternalNotificationContextProps>({
  notifications: [],
});

export default InternalNotificationContext;
