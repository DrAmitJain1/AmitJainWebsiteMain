import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CalendarCheck, FileText, Home, LayoutDashboard, LogOut, Lock, 
  Menu, X, ShieldCheck, Users
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/receptionist")({
  head: () => ({ meta: [{ title: "Receptionist Portal · Dr Jain's Skin Care Clinic" }] }),
  component: ReceptionistGatekeeper,
});

const nav = [
  { to: "/receptionist", label: "Clinic CRM", icon: LayoutDashboard, exact: true },
];

function ReceptionistGatekeeper() {
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
      const uCredential = await signInWithEmailAndPassword(auth, email, password);
      const emailLower = (uCredential.user?.email || "").toLowerCase();
      
      // Role checking
      if (!emailLower.includes("recep") && !emailLower.includes("admin")) {
        await signOut(auth);
        toast.error("Access Denied: Only receptionist or admin accounts are allowed here.");
        return;
      }
      
      toast.success("Receptionist authenticated successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to log in.");
    } finally {
      setSigningIn(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Logged out successfully.");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-3 text-sm text-muted-foreground font-bold">Verifying clinic credentials...</p>
        </div>
      </div>
    );
  }

  // Gatekeeping: If no user is logged in, show the styled receptionist login sheet
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-soft-band/30 px-4">
        <div className="w-full max-w-md rounded-[2rem] border bg-white/90 p-8 shadow-xl backdrop-blur-md animate-fade-up">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
              <Users className="h-6 w-6" />
            </div>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-foreground">Receptionist CRM Login</h1>
            <p className="mt-1.5 text-xs text-muted-foreground font-semibold">Calibrated access for Dr Jain's reception desk</p>
          </div>
          
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Email address</label>
              <input
                type="email"
                placeholder="receptionist@jainskinclinic.in"
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
              {signingIn ? "Verifying desk access..." : "Sign In to Desk Workspace"}
            </Button>
          </form>
          
          <div className="mt-6 border-t pt-4 text-center flex flex-col gap-2">
            <Link to="/admin" className="text-xs text-primary hover:underline transition-colors font-bold">
              Access Admin Workspace instead
            </Link>
            <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors font-bold">
              Return to clinic homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Double check role gatekeeping
  const emailLower = (user?.email || "").toLowerCase();
  if (!emailLower.includes("recep") && !emailLower.includes("admin")) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-soft-band/30 px-4">
        <div className="w-full max-w-md rounded-[2rem] border bg-white/90 p-8 shadow-xl backdrop-blur-md text-center">
          <Lock className="h-10 w-10 text-destructive mx-auto mb-4" />
          <h1 className="text-xl font-extrabold">Unauthorized</h1>
          <p className="text-xs text-muted-foreground font-semibold mt-2">Your account does not have permission to view the Receptionist Desk.</p>
          <Button onClick={handleLogout} className="mt-4 rounded-xl font-bold bg-primary w-full py-4">Sign Out</Button>
        </div>
      </div>
    );
  }

  // Receptionist View
  return <ReceptionistLayout handleLogout={handleLogout} />;
}

function ReceptionistLayout({ handleLogout }: { handleLogout: () => void }) {
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
      {/* 1. MOBILE HEADER BAR */}
      <header className="lg:hidden sticky top-0 z-30 w-full glass border-b border-primary/10 px-4 py-3 flex items-center justify-between shadow-sm">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary text-xs font-bold text-primary">DJ</div>
          <span className="text-sm font-extrabold tracking-tight text-foreground">Clinic Desk</span>
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
                  <span className="text-sm font-extrabold text-foreground">Clinic Desk</span>
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
                <Home className="h-4 w-4" /> Back to website
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
          
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* 3. DESKTOP SIDEBAR + PAGE CONTENT STRUCTURE */}
      <div className="mx-auto flex w-full max-w-[1400px] gap-6 px-4 py-6 flex-col lg:flex-row flex-1">
        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-64 shrink-0 rounded-3xl border bg-white/85 p-4 lg:flex lg:flex-col lg:justify-between shadow-sm">
          <div>
            <Link to="/" className="flex items-center gap-2 px-2 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-xs font-bold text-primary">DJ</div>
              <div className="text-sm font-extrabold tracking-tight">Clinic Desk CRM</div>
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
              <Home className="h-4 w-4" /> Back to website
            </Link>
            <button onClick={handleLogout} className="w-full flex items-center gap-2 rounded-xl bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all">
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </div>
        </aside>
        
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
