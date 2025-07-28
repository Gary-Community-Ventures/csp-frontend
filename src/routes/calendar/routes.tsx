import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../router';
import CalendarPage from './pages/home';

export const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calendar',
  component: CalendarPage,
});
