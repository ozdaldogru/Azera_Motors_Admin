"use client";
import { Suspense, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function PasswordInput({ value, onChange, ...props }: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        className="w-full border rounded-lg px-4 py-2 pr-10"
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
        tabIndex={-1}
      >
        {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  );
}

export default function ResetPasswordPage() {
  const [form, setForm] = useState({ password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
      <PasswordInput
        value={form.password}
        onChange={handleChange}
        name="password"
        placeholder="New Password"
        required
      />
    </Suspense>
  );
}