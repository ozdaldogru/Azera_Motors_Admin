"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid username or password");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="auth-card flex flex-col gap-6 rounded-2xl px-6 py-8 sm:px-8">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6"
      >
        <div className="mb-2">
        <p className="mb-2 text-center text-xs font-bold uppercase tracking-[0.2em] text-blue-400">Azera Motors</p>
        <h1 className="text-center text-3xl font-bold text-white">
          Sign In
        </h1>
        <p className="mt-2 text-center text-sm text-slate-400">Welcome back. Sign in to manage your inventory.</p>
        </div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
          required
          disabled={loading}
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 pr-10 text-white outline-none placeholder:text-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
            required
            autoComplete="current-password"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        <button
          type="submit"
          className="flex items-center justify-center rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-lg shadow-blue-900/30 hover:bg-blue-500"
          disabled={loading}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          ) : null}
          {loading ? "Signing In..." : "Sign In"}
        </button>
        <a
          href="/sign-up"
          className="text-center text-sm text-blue-400 hover:text-blue-300 hover:underline"
        >
          Don&apos;t have an account? Sign Up
        </a>
        <a
          href="/forgot-password"
          className="mt-2 text-center text-sm text-slate-400 hover:text-white hover:underline"
        >
          Forgot Password?
        </a>
        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>
    </div>
  );
}