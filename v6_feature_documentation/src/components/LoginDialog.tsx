import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { useTheme } from "../lib/theme/theme-provider";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({
  open,
  onOpenChange,
}: LoginDialogProps) {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(
      "https://login-v61b.virima.com/www_em/pages/usersDashboard/?entity=my-dashboard-items&tab=MyciTab",
      "_blank",
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[480px] p-0 overflow-hidden border-0 gap-0"
        style={{ backgroundColor: isDark ? '#0a0a0a' : '#ffffff' }}
      >
        {/* Header with Gradient */}
        <div className="relative bg-gradient-to-br from-green-600 via-green-500 to-emerald-500 px-8 pt-12 pb-8">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-3xl text-white mb-2">
                Welcome Back
              </DialogTitle>
              <DialogDescription className="text-white/90 text-base">
                Sign in to access your Virima Documentation
                space
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        {/* Form Section */}
        <div className="px-8 py-8" style={{ backgroundColor: isDark ? '#0a0a0a' : '#ffffff' }}>
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-sm"
                style={{ color: isDark ? '#e2e8f0' : '#334155' }}
              >
                Username or Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="pl-11 h-12 focus:border-green-500 focus:ring-green-500"
                  style={{
                    backgroundColor: isDark ? '#111111' : '#ffffff',
                    borderColor: isDark ? '#1a1a1a' : '#e2e8f0',
                    color: isDark ? '#f1f5f9' : '#0f172a',
                  }}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm"
                style={{ color: isDark ? '#e2e8f0' : '#334155' }}
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-11 pr-11 h-12 focus:border-green-500 focus:ring-green-500"
                  style={{
                    backgroundColor: isDark ? '#111111' : '#ffffff',
                    borderColor: isDark ? '#1a1a1a' : '#e2e8f0',
                    color: isDark ? '#f1f5f9' : '#0f172a',
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: isDark ? '#64748b' : '#94a3b8' }}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded text-green-600 focus:ring-green-500"
                  style={{ borderColor: isDark ? '#333' : '#cbd5e1' }}
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm"
                  style={{ color: isDark ? '#94a3b8' : '#475569' }}
                >
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="text-sm transition-colors"
                style={{ color: isDark ? '#34d399' : '#16a34a' }}
                onClick={() => {
                  window.open(
                    "https://virima.com/contact-us",
                    "_blank",
                  );
                }}
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Sign In
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full" style={{ borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: isDark ? '#1a1a1a' : '#e2e8f0' }}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4" style={{ backgroundColor: isDark ? '#0a0a0a' : '#ffffff', color: isDark ? '#64748b' : '#64748b' }}>
                New to Virima?
              </span>
            </div>
          </div>

        </div>

        {/* Footer Note */}
        <div
          className="px-8 py-4"
          style={{
            backgroundColor: isDark ? '#111111' : '#f8fafc',
            borderTop: `1px solid ${isDark ? '#1a1a1a' : '#f1f5f9'}`,
          }}
        >
          <p className="text-xs text-center" style={{ color: isDark ? '#64748b' : '#64748b' }}>
            By signing in, you agree to Virima's Terms of
            Service and Privacy Policy
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
