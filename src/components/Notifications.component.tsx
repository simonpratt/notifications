// eslint-disable-next-line @typescript-eslint/no-use-before-define
import React, { useContext } from 'react';
import { Notifications as NotificationsUI } from '@dtdot/lego';

import InternalNotificationContext from '../context/InternalNotification.context';

const Notifications = () => {
  const { notifications } = useContext(InternalNotificationContext);

  return <NotificationsUI notifications={notifications} />;
};

export default Notifications;
