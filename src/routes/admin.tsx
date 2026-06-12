import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CalendarCheck, FileText, Home, Image as ImageIcon, LayoutDashboard,
  MessageSquare, Settings, Sparkles, LogOut, Lock, HelpCircle, Menu, X, Search
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Portal · Dr Jain's Skin Care Clinic" }] }),
  component: AdminGatekeeper,
});

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/homepage", label: "Homepage", icon: Home },
  { to: "/admin/services", label: "Services", icon: Sparkles },
  { to: "/admin/blogs", label: "Blogs", icon: FileText },
  { to: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { to: "/admin/appointments", label: "Appointments", icon: CalendarCheck },
  { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { to: "/admin/seo", label: "SEO", icon: Search },
  { to: "/admin/faqs", label: "FAQs", icon: HelpCircle },
];

function AdminGatekeeper() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password.");
      return;
    }
    setSigningIn(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Successfully authenticated!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to log in.");
    } finally {
      setSigningIn(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Successfully logged out.");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-3 text-sm text-muted-foreground font-bold">Verifying access rights...</p>
        </div>
      </div>
    );
  }

  // Gatekeeping: If no user is logged in, show the styled login sheet
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-soft-band/30 px-4">
        <div className="w-full max-w-md rounded-[2rem] border bg-white/90 p-8 shadow-xl backdrop-blur-md animate-fade-up">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-foreground">Clinic CRM Login</h1>
            <p className="mt-1.5 text-xs text-muted-foreground font-semibold">Authorized access portal for Dr Jain's Skin Care Clinic</p>
          </div>
          
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Email address</label>
              <input
                type="email"
                placeholder="admin@jainskinclinic.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <Button type="submit" disabled={signingIn} className="mt-2 w-full rounded-xl py-6 font-bold shadow-md">
              {signingIn ? "Authenticating credentials..." : "Sign In to Admin Workspace"}
            </Button>
          </form>
          
          <div className="mt-6 border-t pt-4 text-center">
            <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors font-bold">
              Return to clinic homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If user is a receptionist, restrict access
  const isReceptionist = user?.email && user.email.toLowerCase().includes("recep");
  if (isReceptionist) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-soft-band/30 px-4">
        <div className="w-full max-w-md rounded-[2rem] border bg-white/90 p-8 shadow-xl backdrop-blur-md text-center animate-fade-up">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-xl font-extrabold tracking-tight text-foreground">Access Denied</h1>
          <p className="mt-2 text-xs text-muted-foreground font-semibold leading-relaxed">
            Receptionist accounts are restricted from accessing the main Admin Workspace.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button asChild className="rounded-xl py-5 font-bold shadow-md bg-primary">
              <Link to="/receptionist">Go to Receptionist Portal</Link>
            </Button>
            <Button onClick={handleLogout} variant="outline" className="rounded-xl py-5 font-bold">
              Sign out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Admin View
  return <AdminLayout handleLogout={handleLogout} />;
}

function AdminLayout({ handleLogout }: { handleLogout: () => void }) {
  const loc = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-soft-band/40 flex flex-col">
      {/* 1. MOBILE HEADER BAR (Visible only under lg responsive breakpoint) */}
      <header className="lg:hidden sticky top-0 z-30 w-full glass border-b border-primary/10 px-4 py-3 flex items-center justify-between shadow-sm">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary text-xs font-bold text-primary">DJ</div>
          <span className="text-sm font-extrabold tracking-tight text-foreground">Clinic Admin</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-xl p-2 bg-secondary text-primary hover:bg-secondary/80 focus:outline-none transition-all active:scale-95 shadow-sm"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* 2. MOBILE DRAWER SLIDE-OVER OVERLAY */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/45 backdrop-blur-sm animate-fade-in flex">
          <div className="w-64 bg-white p-5 flex flex-col justify-between shadow-2xl h-full animate-slide-right overflow-y-auto">
            <div>
              <div className="flex items-center justify-between border-b pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary text-xs font-bold text-primary">DJ</div>
                  <span className="text-sm font-extrabold text-foreground">Clinic Admin</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 hover:bg-secondary rounded-full text-muted-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <nav className="space-y-1">
                {nav.map((n) => {
                  const active = n.exact ? loc.pathname === n.to : loc.pathname.startsWith(n.to);
                  return (
                    <Link
                      key={n.to}
                      to={n.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200",
                        active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                      )}
                    >
                      <n.icon className="h-4 w-4" /> {n.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-2 border-t pt-4 mt-6">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all"
              >
                <Settings className="h-4 w-4" /> Back to website
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-2 rounded-xl bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all"
              >
                <LogOut className="h-4 w-4" /> Log out
              </button>
            </div>
          </div>
          
          {/* Click outside sidebar to close */}
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* 3. DESKTOP SIDEBAR + PAGE CONTENT STRUCTURE */}
      <div className="mx-auto flex w-full max-w-[1400px] gap-6 px-4 py-6 flex-col lg:flex-row flex-1">
        {/* Sticky sidebar only rendered on desktop width */}
        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-64 shrink-0 rounded-3xl border bg-white/85 p-4 lg:flex lg:flex-col lg:justify-between shadow-sm">
          <div>
            <Link to="/" className="flex items-center gap-2 px-2 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-xs font-bold text-primary">DJ</div>
              <div className="text-sm font-extrabold tracking-tight">Clinic Admin</div>
            </Link>
            <nav className="mt-4 space-y-0.5">
              {nav.map((n) => {
                const active = n.exact ? loc.pathname === n.to : loc.pathname.startsWith(n.to);
                return (
                  <Link key={n.to} to={n.to} className={cn("flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200", active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground")}>
                    <n.icon className="h-4 w-4" /> {n.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="space-y-2">
            <Link to="/" className="flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all">
              <Settings className="h-4 w-4" /> Back to website
            </Link>
            <button onClick={handleLogout} className="w-full flex items-center gap-2 rounded-xl bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all">
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </div>
        </aside>
        
        {/* Dynamic children CMS route displays */}
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}