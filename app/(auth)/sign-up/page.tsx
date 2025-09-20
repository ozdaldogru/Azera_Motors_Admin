
"use client";
export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#23272f]">
      <div className="bg-white dark:bg-[#23272f] shadow-xl rounded-xl px-8 py-10 w-full max-w-md border border-gray-700 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-center text-blue-700 dark:text-yellow-300 mb-2">
          Sign Up Disabled
        </h1>
        <p className="text-center text-gray-700 dark:text-gray-300">
          New user registration is currently closed. Please contact the administrator if you need access.
        </p>
        <button type="submit" disabled className="bg-gray-400 text-white py-3 rounded-lg">
          Sign Up (Disabled)
        </button>
        <p className="text-center text-red-500 mt-2">
          Registration is currently closed.
        </p>
      </div>
    </div>
  );
}



/*
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      if (res.ok) {
        setSuccess("Account created! Redirecting to sign in...");
        setTimeout(() => router.push("/sign-in"), 1500);
      } else {
        const data = await res.json();
        setError(data.message || "Sign up failed");
      }
    } catch {
      setError("Sign up failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#23272f] ">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#23272f] shadow-xl rounded-xl px-8 py-10 flex flex-col gap-6 w-full max-w-md border border-gray-700"
      >
        <h1 className="text-3xl font-bold text-center text-blue-700 dark:text-yellow-300 mb-2">
          Sign Up
        </h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-[#23272f] dark:text-gray-100"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-[#23272f] dark:text-gray-100"
          required
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-[#23272f] dark:text-gray-100 w-full pr-10"
            required
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
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Sign Up
        </button>
        <a
          href="/sign-in"
          className="text-center text-blue-600 dark:text-yellow-300 hover:underline"
        >
          Already have an account? Sign In
        </a>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}
      </form>
    </div>
  );
}

*/