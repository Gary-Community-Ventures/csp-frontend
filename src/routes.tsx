import {
  Outlet,
  Router,
  createRootRoute,
  createRoute,
} from '@tanstack/react-router'
import { AboutPage } from './pages/about'
import { NavBar } from './components/nav-bar'
import { HomePage } from './pages/home'
import { Wrapper } from './context'

const rootRoute = createRootRoute({
  component: () => (
    <Wrapper>
      <NavBar />
      <main className="pt-10 px-4 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </Wrapper>
  ),
})

export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

export const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
})

export const routeTree = rootRoute.addChildren([homeRoute, aboutRoute])

export const router = new Router({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
