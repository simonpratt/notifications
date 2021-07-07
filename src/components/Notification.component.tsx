// eslint-disable-next-line @typescript-eslint/no-use-before-define
import React from 'react';
import styled from 'styled-components';
import colours from '../../colours/colours';
import responsive from '../../responsive/responsive';
import { INotificationInternal, NotificationVariant } from '../types/Notification.types';

type NotificationProps = Pick<INotificationInternal, 'message' | 'variant' | 'action' | 'onAction' | 'count'>;

const getNotificationColor = (variant: NotificationVariant) => {
  switch (variant) {
    case 'info':
      return colours.blue;
    case 'success':
      return colours.green;
    case 'warn':
      return colours.yellow;
    case 'danger':
      return colours.red;
    default:
      return colours.blue;
  }
};

interface NotificationContainerProps {
  colour: string;
}

const NotificationContainer = styled.div<NotificationContainerProps>`
  position: relative;
  padding: 12px;
  background-color: white;

  border-left: solid 3px ${(props) => props.colour};
  box-shadow: 1px 1px 2px #0000000f;

  color: ${(props) => props.theme.colours.defaultFont};
  font-family: ${(props) => props.theme.fonts.default.family};

  ${responsive.useStylesFor('tablet').andLarger(`
      max-width: 320px;
  `)}
`;

const MessageContainer = styled.div`
  color: ${colours.grey90};
`;

const ActionContainer = styled.div`
  text-align: right;
  font-style: italic;
  color: ${colours.grey70};
  font-family: ${(props) => props.theme.fonts.default.family};

  padding-top: 8px;
`;

interface CountContainerProps {
  colour: string;
}

const CountContainer = styled.div<CountContainerProps>`
  display: flex;
  align-items: center;
  justify-content: center;

  position: absolute;
  top: 0px;
  right: -8px;

  font-size: 12px;
  color: ${(props) => props.theme.colours.defaultFont};
  font-family: ${(props) => props.theme.fonts.default.family};

  height: 24px;
  width: 24px;
  border: 2px solid ${(props) => props.colour};
  border-radius: 50%;
  background-color: white;
`;

const Notification = ({ message, variant, action, onAction, count }: NotificationProps) => {
  const colour = getNotificationColor(variant);

  return (
    <NotificationContainer colour={colour}>
      <MessageContainer>{message}</MessageContainer>
      {action && <ActionContainer onClick={onAction}>{action}</ActionContainer>}
      {count > 1 && <CountContainer colour={colour}>{count}</CountContainer>}
    </NotificationContainer>
  );
};

export default Notification;
