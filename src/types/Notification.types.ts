export type NotificationVariant = 'info' | 'success' | 'warn' | 'danger';

export interface INotification {
  message: string;
  variant: NotificationVariant;
  action?: string;
  onAction?: () => void;
}

export interface INotificationInternal extends INotification {
  id: string;
  count: number;
  timeout?: any;
}
