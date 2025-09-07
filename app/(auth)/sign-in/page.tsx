"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });
    if (res?.error) {
      setError("Invalid username or password");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#23272f]">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#23272f] shadow-xl rounded-xl px-8 py-10 flex flex-col gap-6 w-full max-w-md border border-gray-700"
      >
        <h1 className="text-3xl font-bold text-center text-blue-700 dark:text-yellow-300 mb-2">
          Sign In
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
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-[#23272f] dark:text-gray-100"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Sign In
        </button>
        <a
          href="/sign-up"
          className="text-center text-blue-600 dark:text-yellow-300 hover:underline"
        >
          Don't have an account? Sign Up
        </a>
        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>
    </div>
  );
}