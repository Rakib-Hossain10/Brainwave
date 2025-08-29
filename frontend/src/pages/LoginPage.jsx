import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { ChevronLeft, Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();   //i use this for not refreshing the page
    login(formData);
  };

      const handleBack = () => {
        navigate("/");
      };

  return (
    <div className="relative min-h-screen overflow-hidden">

       <button
              onClick={handleBack}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15 hover:bg-white/20 transition fixed top-7 left-4 z-20"
            >
              <ChevronLeft className="h-5 w-5 text-white/90" />
            </button>
      {/* Vivid dark background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* deep gradient wash */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-slate-900 to-black" />
        {/* glowing orbs */}
        <div className="absolute -top-28 -left-24 h-80 w-80 rounded-full bg-violet-600/25 blur-3xl" />
        <div className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-fuchsia-600/25 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-2xl" />
        {/* faint grid for depth */}
        <div className="absolute inset-0 opacity-[0.07] [background:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)_0_0/24px_24px]" />
      </div>

      {/* Centered content */}
      <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          {/* Brand / Heading */}
          <div className="mb-6 text-center text-white">
            <div className="group mx-auto flex w-fit flex-col items-center gap-2">
              <div className="flex size-12 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10 transition-all duration-300 group-hover:scale-105">
                <MessageSquare className="size-6 text-white" />
              </div>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Welcome Back</h1>
              <p className="text-sm text-white/70">Sign in to your account</p>
            </div>
          </div>

          {/* Glass card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl supports-[backdrop-filter]:bg-white/5">
            <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-6">
              {/* Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-white font-medium">Email</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="size-5 text-white/50" />
                  </div>
                  <input
                    type="email"
                    className="input input-bordered w-full pl-10 bg-white/5 border-white/15 text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/40"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-white font-medium">Password</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="size-5 text-white/50" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input input-bordered w-full pl-10 pr-10 bg-white/5 border-white/15 text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/40"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 transition-opacity hover:opacity-80 focus-visible:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="size-5 text-white/60" />
                    ) : (
                      <Eye className="size-5 text-white/60" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-primary w-full gap-2 rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-[.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/40"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="border-t border-white/10 p-5 text-center sm:p-6">
              <p className="text-sm text-white/70">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="link font-medium text-violet-300 hover:text-violet-200">
                  Create account
                </Link>
              </p>
            </div>
          </div>

          {/* Tiny foot note */}
          <p className="mt-4 text-center text-xs text-white/50">
            By signing in, you agree to our Terms & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
