"use client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Recovery email sent! Check your inbox.");
      } else {
        setMessage(data.error || "Email not found or error occurred.");
      }
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#23272f]">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#23272f] shadow-xl rounded-xl px-8 py-10 flex flex-col gap-6 w-full max-w-md border border-gray-700"
      >
        <h1 className="text-3xl font-bold text-center text-blue-700 dark:text-yellow-300 mb-2">
          Forgot Password
        </h1>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-[#23272f] dark:text-gray-100"
          required
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Recovery Email"}
        </button>
        {message && <p className="text-center text-yellow-300">{message}</p>}
      </form>
    </div>
  );
}