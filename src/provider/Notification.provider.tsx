// eslint-disable-next-line @typescript-eslint/no-use-before-define
import React, { useReducer, useCallback, useRef } from 'react';
import { v4 } from 'uuid';

import NotificationContext from '../context/Notification.context';
import { INotification, INotificationInternal } from '../types/Notification.types';
import InternalNotificationContext from '../context/InternalNotification.context';

interface NotificationReducerState {
  notifications: INotificationInternal[];
  dismissJobs: {
    id: string;
    durationMs: number;
  }[];
  notificationsRef: React.MutableRefObject<INotificationInternal[]>;
}

const isMatchingNotification = (existingNotification: INotification, newNotification: INotification) => {
  return (
    existingNotification.message === newNotification.message &&
    existingNotification.variant === newNotification.variant &&
    !newNotification.onAction
  );
};

const reducer = (state: NotificationReducerState, action: any) => {
  switch (action.type) {
    case 'add': {
      const { id, notification, timeout } = action;

      const newNotifications = [
        ...state.notifications,
        {
          ...notification,
          id,
          timeout,
          count: 1,
        },
      ];

      state.notificationsRef.current = newNotifications;

      return {
        ...state,
        notifications: newNotifications,
      };
    }
    case 'extend': {
      const { id, timeout } = action;

      const newNotifications = state.notifications.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              timeout: timeout,
              count: notification.count + 1,
            }
          : notification,
      );

      state.notificationsRef.current = newNotifications;

      return {
        ...state,
        notifications: newNotifications,
      };
    }
    case 'remove': {
      const { id } = action;

      const newNotifications = state.notifications.filter((notification) => notification.id !== id);
      state.notificationsRef.current = newNotifications;

      return {
        ...state,
        notifications: newNotifications,
      };
    }
    default:
      throw new Error();
  }
};

export interface NotificationProviderProps {
  children: React.ReactNode;
}

const NotificationProvider = ({ children }: NotificationProviderProps) => {
  // Using a ref to track current notifications to avoid infinite re-rendering of the addNotification method
  const notificationsRef = useRef<INotificationInternal[]>([]);
  const [state, dispatch] = useReducer(reducer, { notifications: [], dismissJobs: [], notificationsRef });

  const clearNotification = useCallback(
    (id: string) => {
      dispatch({ type: 'remove', id });
    },
    [dispatch],
  );

  const addNotification = useCallback(
    (notification: INotification, durationMs = 3000) => {
      const existing = notificationsRef.current.find((_existing) => isMatchingNotification(_existing, notification));

      if (existing) {
        const { timeout: existingTimeout, id } = existing;
        clearTimeout(existingTimeout);

        const timeout = setTimeout(() => {
          clearNotification(id);
        }, durationMs);

        dispatch({
          type: 'extend',
          id,
          timeout,
        });
      } else {
        const id = v4();

        const timeout = setTimeout(() => {
          clearNotification(id);
        }, durationMs);

        dispatch({
          type: 'add',
          id,
          timeout,
          notification: {
            ...notification,
            onAction: notification.onAction
              ? () => {
                  clearNotification(id);
                  notification.onAction && notification.onAction();
                }
              : undefined,
          },
        });
      }
    },
    [dispatch, clearNotification, notificationsRef],
  );

  const internalValue = {
    notifications: state.notifications,
  };

  const externalValue = {
    addNotification,
  };

  return (
    <InternalNotificationContext.Provider value={internalValue}>
      <NotificationContext.Provider value={externalValue}>{children}</NotificationContext.Provider>
    </InternalNotificationContext.Provider>
  );
};

export default NotificationProvider;
