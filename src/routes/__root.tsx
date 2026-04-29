import {
  Outlet,
  createRootRoute,
  Link,
  HeadContent,
  Scripts,
  ErrorComponent,
  type ErrorComponentProps,
  createRouter,
} from "@tanstack/react-router"
import appCss from "../styles.css?url"

function RootErrorComponent({ error, reset }: ErrorComponentProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center px-4">
      <div className="rounded-full bg-destructive/10 p-4">
        <ErrorComponent error={error}/>
      </div>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Try again
        </button>
        <Link to="/" className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent">
          Go home
        </Link>
      </div>
    </div>
  );
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="text-2xl font-semibold">Page Not Found</h2>
      <p className="text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="mt-2 underline hover:text-primary">
        Go back home
      </Link>
    </div>
  );
}


const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Pareto Base",
  "url": "https://paretobase.com",
  "description": "Scrap tracking and analytics platform for discrete manufacturers. Replaces Excel scrap logs with live Pareto analysis, defect tracking by reason code, and ISO 9001 audit-ready records.",
  "foundingDate": "2024",
  "applicationCategory": "Manufacturing Quality Software",
  "sameAs": [
    "https://www.linkedin.com/company/paretobase"
  ],
}

export const Route = createRootRoute({
  component: RootLayout,
  errorComponent: RootErrorComponent,
  notFoundComponent: NotFoundComponent,
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { title: "Pareto Base" },
      {
        name: "description",
        content: "Gain actionable insights into your manufacturing processes to minimize costs, improve quality, and boost overall productivity.",
      },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(organizationSchema),
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: "anonymous",
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap',
      }
    ],
  })
})

// Runs synchronously before first paint to apply the stored theme class.
// Prevents the light→dark flash on load. Must stay as a plain string — no
// imports or runtime deps — because it executes before React hydrates.
const themeInitScript = `(function(){try{var s=localStorage.getItem('theme');var d=s==='dark'||(s!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark')}catch(e){}})()`;

function RootLayout() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`antialiased`}>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
