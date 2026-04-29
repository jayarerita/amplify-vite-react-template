import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'


export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    context: {
      auth: {
        user: null,
        isAuthenticated: false,
      },
    },
  })

  return router
}
