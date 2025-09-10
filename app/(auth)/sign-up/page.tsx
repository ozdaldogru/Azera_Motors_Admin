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