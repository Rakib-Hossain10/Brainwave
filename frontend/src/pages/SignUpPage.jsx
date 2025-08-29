import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { ChevronLeft, Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
   const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) signup(formData);
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
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Create Account</h1>
              <p className="text-sm text-white/70">Get started with your free account</p>
            </div>
          </div>

          {/* Glass card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl supports-[backdrop-filter]:bg-white/5">
            <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-6">
              {/* Full Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-white font-medium">Full Name</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="size-5 text-white/50" />
                  </div>
                  <input
                    type="text"
                    className="input input-bordered w-full pl-10 bg-white/5 border-white/15 text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/40"
                    placeholder="Rakib Hossain"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
              </div>

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
                disabled={isSigningUp}
              >
                {isSigningUp ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="border-t border-white/10 p-5 text-center sm:p-6">
              <p className="text-sm text-white/70">
                Already have an account?{" "}
                <Link to="/login" className="link font-medium text-violet-300 hover:text-violet-200">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Tiny foot note */}
          <p className="mt-4 text-center text-xs text-white/50">
            By creating an account, you agree to our Terms & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
