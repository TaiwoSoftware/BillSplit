"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";

import Button from "@/app/components/ui/Button";
import NotificationToast from "@/app/components/ui/NotificationToast";
import FormInput from "@/app/components/ui/FormInput";
import PasswordStrength from "@/app/components/ui/PasswordStrength";
import OfflineBanner from "@/app/components/ui/OfflineBanner";
import ErrorAlert from "@/app/components/ui/ErrorAlert";

import { useAuth } from "@/app/hooks/useAuth";
import { useOnlineStatus } from "@/app/hooks/useOnlineStatus";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "warning";
  } | null>(null);

  const isOnline = useOnlineStatus();
  const {
    formData,
    errors,
    loading,
    authError,
    retryCount,
    handleChange,
    handleSubmit,
    handleRetry,
  } = useAuth();

  const showNotification = (message: string, type: "success" | "error" | "warning") => {
    setNotification({ message, type });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    if (!isOnline) {
      showNotification("You're offline. Please check your internet connection.", "error");
      return;
    }

    const result = (await handleSubmit(e)) as { success?: boolean } | null | undefined;

    if (result?.success) {
      showNotification(
        "Account created successfully! Please check your email to verify your account.",
        "success"
      );
    } else if (result?.success === false && authError) {
      // Error is already handled in the hook
      // Don't show duplicate notification
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-12">
      {notification && (
        <NotificationToast
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-4xl font-bold">🚀 BillSplit</h1>
          <p className="mt-3 text-slate-500">
            Create your account and start managing shared expenses easily.
          </p>
          <OfflineBanner isOnline={isOnline} />
        </div>

        <form onSubmit={handleFormSubmit} className="mt-10 space-y-5">
          <FormInput
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Taiwo David"
            icon={<User size={20} />}
            error={errors.fullName}
            disabled={loading || !isOnline}
          />

          <FormInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="taiwo@gmail.com"
            icon={<Mail size={20} />}
            error={errors.email}
            disabled={loading || !isOnline}
          />

          <FormInput
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            icon={<Lock size={20} />}
            error={errors.password}
            disabled={loading || !isOnline}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 transition"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            }
          />

          <PasswordStrength password={formData.password} />

          <FormInput
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            icon={<Lock size={20} />}
            error={errors.confirmPassword}
            disabled={loading || !isOnline}
            rightElement={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-slate-400 hover:text-slate-600 transition"
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            }
          />

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                disabled={loading}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-sm text-slate-600">
                I agree to the Terms and Conditions
              </span>
            </label>
            {errors.agree && (
              <p className="mt-2 text-sm text-red-500">{errors.agree}</p>
            )}
          </div>

          <ErrorAlert error={authError} retryCount={retryCount} onRetry={handleRetry} />

          <Button
            type="submit"
            loading={loading}
            disabled={loading || !isOnline}
            className="w-full"
          >
            {!isOnline ? "No Connection" : "Create Account"}
          </Button>

          {retryCount >= 3 && (
            <p className="text-sm text-amber-600 text-center">
              Having trouble? Please check your internet connection and try again later.
            </p>
          )}
        </form>

        <p className="mt-8 text-center text-slate-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}