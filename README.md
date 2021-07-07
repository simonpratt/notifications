## About

This package is an opinionated implementation of notifications/toasts in react.

## Usage

### Step 1: Add the provider and notification rendering component at a high level in your application

`app.tsx`
```
import { NotificationProvider, Notifications } from '@dtdot/notification

const App = () => (
  <NotificationProvider>
    <Notifications />
    {'App goes here'}
  </NotificationProvider>
)
```

### Step 2: Create a notification using the provided context

`myComponent.tsx`
```
import { NotificationContext } from '@dtdot/notification

const Component = () => {
  const { addNotification } = useContext(NotificationContext);

  const toast = () => {
    addNotification({ variant: 'success', message: 'Here\'s some toast' });
  }

  return (
    <Button onClick={toast}>Toast</Button>
  );
}
```