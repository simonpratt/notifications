// eslint-disable-next-line @typescript-eslint/no-use-before-define
import React, { useReducer, useCallback } from 'react';
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

      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            ...notification,
            id,
            timeout,
            count: 1,
          },
        ],
      };
    }
    case 'extend': {
      const { id, timeout } = action;

      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                timeout: timeout,
                count: notification.count + 1,
              }
            : notification,
        ),
      };
    }
    case 'remove': {
      const { id } = action;

      return {
        ...state,
        notifications: state.notifications.filter((notification) => notification.id !== id),
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
  const [state, dispatch] = useReducer(reducer, { notifications: [], dismissJobs: [] });

  const clearNotification = useCallback(
    (id: string) => {
      dispatch({ type: 'remove', id });
    },
    [dispatch],
  );

  const addNotification = useCallback(
    (notification: INotification, durationMs = 3000) => {
      const existing = state.notifications.find((_existing) => isMatchingNotification(_existing, notification));

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
    [dispatch, clearNotification, state],
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
