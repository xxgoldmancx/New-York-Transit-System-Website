import { useState } from "react";
import { SiDiscord, SiGoogle, SiGithub } from "react-icons/si";
import { Mail, UserCircle, ArrowRight, Loader2, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export function Login() {
  const [mode, setMode] = useState<"options" | "email">("options");
  const [emailMode, setEmailMode] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", username: "" });
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleGuestLogin = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/guest", { method: "POST" });
      if (res.ok) {
        window.location.href = "/";
      } else {
        throw new Error("Guest login failed");
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const endpoint = emailMode === "login" ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        window.location.href = "/";
      } else {
        throw new Error(data.message || "Authentication failed");
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-background dark relative overflow-hidden">
      {/* Arcade / Synthwave Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary/15 blur-[150px] animate-pulse" style={{ animationDelay: "2s" }}></div>
      
      <div className="relative z-10 w-full max-w-md p-6 sm:p-8">
        <div className="bg-card/60 backdrop-blur-2xl border border-primary/20 rounded-3xl p-8 shadow-[0_0_50px_-12px_rgba(255,0,255,0.3)] relative overflow-hidden group">
          {/* Top glow edge */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-70 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,0,255,0.4)] border-2 border-white/20 logo-wobble">
              <Gamepad2 className="text-white w-10 h-10" />
            </div>
            <h1 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Nexus Control</h1>
            <p className="text-muted-foreground text-sm font-mono tracking-widest uppercase mt-1">Player 1, Insert Coin</p>
          </div>

          {mode === "options" ? (
            <div className="space-y-4">
              <Button 
                asChild 
                size="lg" 
                className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-display font-bold text-base py-6 shadow-[0_0_20px_rgba(88,101,242,0.4)] hover:shadow-[0_0_30px_rgba(88,101,242,0.6)] border-none hover-juicy"
              >
                <a href="/api/auth/discord" className="flex items-center justify-center gap-3">
                  <SiDiscord className="text-xl" />
                  <span>Connect Discord</span>
                </a>
              </Button>

              <div className="grid grid-cols-2 gap-4">
                <Button 
                  asChild 
                  variant="outline"
                  className="w-full bg-white text-black hover:bg-gray-100 font-display font-bold py-6 border-none hover-juicy"
                >
                  <a href="/api/auth/google" className="flex items-center justify-center gap-2">
                    <SiGoogle className="text-lg" />
                    <span>Google</span>
                  </a>
                </Button>

                <Button 
                  asChild 
                  variant="outline"
                  className="w-full bg-[#24292e] text-white hover:bg-[#1b1f23] font-display font-bold py-6 border-none hover-juicy"
                >
                  <a href="/api/auth/github" className="flex items-center justify-center gap-2">
                    <SiGithub className="text-lg" />
                    <span>GitHub</span>
                  </a>
                </Button>
              </div>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase font-mono">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <Button 
                variant="secondary"
                size="lg"
                onClick={() => setMode("email")}
                className="w-full font-display font-bold py-6 hover-juicy border border-white/5 bg-white/5 hover:bg-white/10 text-white"
              >
                <Mail className="w-5 h-5 mr-2" />
                Email / Password
              </Button>

              <Button 
                variant="ghost"
                size="lg"
                onClick={handleGuestLogin}
                disabled={isLoading}
                className="w-full font-display font-bold py-6 hover-juicy text-muted-foreground hover:text-secondary hover:bg-secondary/10"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserCircle className="w-5 h-5 mr-2" />}
                Enter as Guest
              </Button>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setMode("options")}
                className="mb-2 -ml-2 text-muted-foreground hover:text-white"
              >
                ← Back to options
              </Button>

              <div className="flex bg-background/50 p-1 rounded-xl border border-border/50">
                <button 
                  className={`flex-1 py-2 text-sm font-display font-bold rounded-lg transition-all ${emailMode === 'login' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:text-white'}`}
                  onClick={() => setEmailMode("login")}
                >
                  Login
                </button>
                <button 
                  className={`flex-1 py-2 text-sm font-display font-bold rounded-lg transition-all ${emailMode === 'register' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:text-white'}`}
                  onClick={() => setEmailMode("register")}
                >
                  Register
                </button>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                {emailMode === "register" && (
                  <div className="space-y-2">
                    <Label className="text-xs uppercase font-mono text-muted-foreground">Username</Label>
                    <Input 
                      required
                      value={formData.username}
                      onChange={e => setFormData(p => ({...p, username: e.target.value}))}
                      className="bg-background/50 border-primary/30 focus-visible:ring-primary focus-visible:border-primary font-mono" 
                      placeholder="PlayerOne" 
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-mono text-muted-foreground">Email</Label>
                  <Input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData(p => ({...p, email: e.target.value}))}
                    className="bg-background/50 border-primary/30 focus-visible:ring-primary focus-visible:border-primary font-mono" 
                    placeholder="user@domain.com" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-mono text-muted-foreground">Password</Label>
                  <Input 
                    required
                    type="password"
                    value={formData.password}
                    onChange={e => setFormData(p => ({...p, password: e.target.value}))}
                    className="bg-background/50 border-primary/30 focus-visible:ring-primary focus-visible:border-primary font-mono" 
                    placeholder="••••••••" 
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-display font-bold py-6 shadow-[0_0_15px_rgba(255,0,255,0.4)] border-none hover-juicy mt-2"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      {emailMode === "login" ? "Initialize Session" : "Create Profile"} <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          )}

          <div className="mt-8 text-center border-t border-border/50 pt-6">
            <p className="text-[10px] text-primary/50 font-mono flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              SECURE CONNECTION ESTABLISHED
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
