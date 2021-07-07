// eslint-disable-next-line @typescript-eslint/no-use-before-define
import React, { useContext } from 'react';
import styled from 'styled-components';
import { animated, useTransition } from 'react-spring';
import { Spacer } from '@dtdot/lego';

import InternalNotificationContext from '../context/InternalNotification.context';
import Notification from './Notification.component';
import responsive from '../../responsive/responsive';

const NotificationContainer = styled.div`
  position: fixed;
  bottom: 80px;
  left: 10%;
  width: 80%;

  ${responsive.useStylesFor('tablet').andLarger(`
    left: 40px;
    bottom: 40px;
  `)}
`;

const Notifications = () => {
  const { notifications } = useContext(InternalNotificationContext);

  const transitions = useTransition(notifications, (item) => item.id, {
    from: { transform: 'translateX(-300px)', opacity: 0 },
    enter: { transform: 'translateX(0px)', opacity: 1 },
    leave: { transform: 'translateX(300px)', opacity: 0 },
    config: {
      tension: 280,
      mass: 0.2,
      friction: 10,
    },
  });

  return (
    <NotificationContainer>
      {transitions.map(({ item, props, key }) => (
        <animated.div key={key} style={props}>
          <Spacer size='1x' />
          <Notification
            variant={item.variant}
            message={item.message}
            action={item.action}
            onAction={item.onAction}
            count={item.count}
          ></Notification>
        </animated.div>
      ))}
    </NotificationContainer>
  );
};

export default Notifications;
