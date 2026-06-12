import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useLocation
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Dr Jain's Skin Care Clinic | Dermatologist in Katraj, Pune" },
      { name: "description", content: "Premium dermatology, hair & cosmetology care in Katraj, Pune by Dr. Amit Jain (MBBS, MD). Acne, pigmentation, PRP, hair fall, peels, anti-aging & more." },
      { name: "author", content: "Dr Jain's Skin Care Clinic" },
      { property: "og:title", content: "Dr Jain's Skin Care Clinic | Dermatologist in Katraj, Pune" },
      { property: "og:description", content: "Advanced Skin & Hair Care Solutions in Pune. 4.8★ Google rated. Book your appointment today." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "canonical", href: "/" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { useEffect } from "react";
import { seedClinicDatabase } from "@/lib/firebaseSeeding";

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();

  useEffect(() => {
    // seedClinicDatabase(); // Commented out to prevent automatic seeding/overwriting of clinic settings and mock data on refresh.
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const cleanupScrollLock = () => {
      // Check if there are active overlays (Radix dialogues, dropdowns, menus, mobile draw sidebars)
      const activeOverlays = document.querySelectorAll(
        '[role="dialog"], [data-state="open"], [role="menu"], [data-radix-portal], .radix-overlay'
      );
      if (activeOverlays.length === 0) {
        let restored = false;
        if (
          document.body.style.overflow === "hidden" ||
          document.body.style.overflow === "clip" ||
          document.body.style.pointerEvents === "none" ||
          document.body.hasAttribute("data-scroll-locked")
        ) {
          document.body.style.overflow = "";
          document.body.style.pointerEvents = "";
          document.body.removeAttribute("data-scroll-locked");
          restored = true;
        }
        if (
          document.documentElement.style.overflow === "hidden" ||
          document.documentElement.style.overflow === "clip" ||
          document.documentElement.style.pointerEvents === "none"
        ) {
          document.documentElement.style.overflow = "";
          document.documentElement.style.pointerEvents = "";
          restored = true;
        }
        if (restored) {
          console.log("[Scroll Lock Cleanup] Restored scroll settings since no active overlays remain.");
        }
      }
    };

    // Run initial cleanup
    cleanupScrollLock();

    // Create a MutationObserver to watch attribute/style changes on html and body
    const observer = new MutationObserver(() => {
      cleanupScrollLock();
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style", "data-scroll-locked"]
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"]
    });

    // Clean up on route transition
    cleanupScrollLock();

    // Setup window focus and click/touch listeners to catch animations or focus transitions
    const handleEvent = () => setTimeout(cleanupScrollLock, 100);
    window.addEventListener("click", handleEvent);
    window.addEventListener("touchend", handleEvent);

    return () => {
      observer.disconnect();
      window.removeEventListener("click", handleEvent);
      window.removeEventListener("touchend", handleEvent);
    };
  }, [location.pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}

