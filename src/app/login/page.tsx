"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      toast.error("Email and password are required.");
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
      toast.success("Welcome back 👋");
      router.push("/"); // Changed from /dashboard to / (home page)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] px-4 relative">
      {/* Back to Home Button */}
      <Link href="/" className="absolute top-4 left-4 z-10">
        <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-white/10">
          <ArrowLeft size={18} />
          Back to Home
        </Button>
      </Link>
      
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md space-y-6 rounded-xl border border-white/10 p-6 shadow-lg bg-gradient-to-br from-[#111827] to-[#1a1f2e] text-white"
      >
        <h1 className="text-2xl font-bold text-center text-white">Login to PocketVue</h1>
  
        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-sm text-gray-300">Email</label>
          <Input
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="bg-[#1f2547] text-white border-white/10"
          />
        </div>
  
        {/* Password Field with toggle */}
        <div className="space-y-2">
          <label className="text-sm text-gray-300">Password</label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="bg-[#1f2547] text-white border-white/10"
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          </div>
        </div>
  
        {/* Login Button */}
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
  
        {/* Footer */}
        <p className="text-sm text-center text-gray-400">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-primary hover:text-primary/80 transition">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
