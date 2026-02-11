"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { Lock, Mail, User } from "lucide-react";
import { useState } from "react";

interface Props {
  onSuccess: () => void;
}

export default function SignUpForm({ onSuccess }: Props) {
  const { signup } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    terms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};

    if (form.name.trim().length < 2) e.name = "Enter your full name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email";
    if (form.password.length < 6)
      e.password = "Minimum 6 characters required";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    if (!/^\d{10}$/.test(form.phone))
      e.phone = "Enter 10-digit mobile number";
    if (!form.terms) e.terms = "Accept the terms";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await signup({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
      });
      onSuccess();
    } catch (err: any) {
      setErrors({ form: err.message || "Signup failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* NAME */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Full Name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-10 h-11"
            placeholder="Your full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
      </div>

      {/* EMAIL */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="email"
            className="pl-10 h-11"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
      </div>

      {/* PASSWORD */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="password"
            className="pl-10 h-11"
            placeholder="Create a password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
      </div>

      {/* CONFIRM */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Confirm Password</label>
        <Input
          type="password"
          className="h-11"
          placeholder="Confirm password"
          value={form.confirmPassword}
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
        />
        {errors.confirmPassword && (
          <p className="text-xs text-destructive">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* PHONE */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Mobile Number</label>
        <Input
          placeholder="10-digit mobile number"
          maxLength={10}
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })
          }
        />
        {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
      </div>

      {/* TERMS */}
      <div className="flex items-start gap-2">
        <Checkbox
          checked={form.terms}
          onCheckedChange={(v) =>
            setForm({ ...form, terms: Boolean(v) })
          }
        />
        <p className="text-sm text-muted-foreground">
          I agree to the{" "}
          <span className="text-primary hover:underline cursor-pointer">
            Terms & Conditions
          </span>
        </p>
      </div>
      {errors.terms && (
        <p className="text-xs text-destructive">{errors.terms}</p>
      )}

      <Button size="lg" className="w-full" disabled={loading}>
        {loading ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}
