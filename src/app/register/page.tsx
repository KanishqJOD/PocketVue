"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      toast.error("All fields are required.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);

      await updateProfile(userCredential.user, {
        displayName: trimmedName,
      });

      toast.success("Registration successful!");
      router.push("/"); // Changed from /dashboard to / (home page)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Registration failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Update the return statement (similar to login page)
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] px-4">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md space-y-6 rounded-xl border border-white/10 p-6 shadow-lg bg-gradient-to-br from-[#111827] to-[#1a1f2e] text-white"
      >
        <h1 className="text-2xl font-bold text-center text-white">Create an Account</h1>
  
        {/* Name Field */}
        {/* Name Field */}
<div className="space-y-2">
  <label className="text-sm text-gray-300">Display Name</label>
  <Input
    type="text"
    placeholder="Display Name"
    value={name}  // Changed from displayName to name
    onChange={(e) => setName(e.target.value)} 
    disabled={loading}
    className="bg-[#1f2547] text-white border-white/10"
  />
</div>
  
        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-sm text-gray-300">Email</label>
          <Input
            type="email"
            placeholder="Email"
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
              placeholder="Password (min. 6 characters)"
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
  
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
          {loading ? "Creating Account..." : "Register"}
        </Button>
  
        <p className="text-sm text-center text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-primary hover:text-primary/80 transition">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
