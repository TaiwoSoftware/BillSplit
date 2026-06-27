"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
} from "lucide-react";

import Button from "@/app/components/ui/Button";

export default function RegisterPage() {
  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [formData, setFormData] =
    useState({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agree: false,
    });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: "",
  });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement
    >
  ) => {
    const { name, value, type, checked } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const validate = () => {
    const newErrors = {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agree: "",
    };

    if (!formData.fullName.trim()) {
      newErrors.fullName =
        "Full name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email =
        "Email is required.";
    }

    if (!formData.password.trim()) {
      newErrors.password =
        "Password is required.";
    }

    if (
      formData.password.length > 0 &&
      formData.password.length < 8
    ) {
      newErrors.password =
        "Password must be at least 8 characters.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password.";
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match.";
    }

    if (!formData.agree) {
      newErrors.agree =
        "Please accept the terms.";
    }

    setErrors(newErrors);

    return !Object.values(
      newErrors
    ).some(Boolean);
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

      // Supabase signup here
      console.log(formData);

      setTimeout(() => {
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const password =
      formData.password;

    if (password.length < 6) {
      return "Weak";
    }

    if (password.length < 10) {
      return "Medium";
    }

    return "Strong";
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-12">
      <div
        className="
          w-full
          max-w-md
          rounded-3xl
          bg-white
          p-8
          shadow-sm
        "
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold">
            🚀 BillSplit
          </h1>

          <p className="mt-3 text-slate-500">
            Create your account and
            start managing shared
            expenses easily.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-5"
        >
          {/* Full Name */}
          <div>
            <label className="mb-2 block font-medium">
              Full Name
            </label>

            <div className="relative">
              <User
                size={20}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="text"
                name="fullName"
                value={
                  formData.fullName
                }
                onChange={
                  handleChange
                }
                placeholder="Taiwo David"
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  py-3
                  pl-12
                  pr-4
                  outline-none
                  focus:border-blue-600
                "
              />
            </div>

            {errors.fullName && (
              <p className="mt-2 text-sm text-red-500">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block font-medium">
              Email
            </label>

            <div className="relative">
              <Mail
                size={20}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="email"
                name="email"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
                placeholder="taiwo@gmail.com"
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  py-3
                  pl-12
                  pr-4
                  outline-none
                  focus:border-blue-600
                "
              />
            </div>

            {errors.email && (
              <p className="mt-2 text-sm text-red-500">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block font-medium">
              Password
            </label>

            <div className="relative">
              <Lock
                size={20}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={
                  formData.password
                }
                onChange={
                  handleChange
                }
                placeholder="••••••••"
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  py-3
                  pl-12
                  pr-12
                  outline-none
                  focus:border-blue-600
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                "
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>

            {formData.password && (
              <p className="mt-2 text-sm text-slate-500">
                Password Strength:
                {" "}
                {passwordStrength()}
              </p>
            )}

            {errors.password && (
              <p className="mt-2 text-sm text-red-500">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-2 block font-medium">
              Confirm Password
            </label>

            <div className="relative">
              <Lock
                size={20}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                value={
                  formData.confirmPassword
                }
                onChange={
                  handleChange
                }
                placeholder="••••••••"
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  py-3
                  pl-12
                  pr-12
                  outline-none
                  focus:border-blue-600
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                "
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-500">
                {
                  errors.confirmPassword
                }
              </p>
            )}
          </div>

          {/* Terms */}
          <div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="agree"
                checked={
                  formData.agree
                }
                onChange={
                  handleChange
                }
              />

              <span className="text-sm text-slate-600">
                I agree to the Terms
                and Conditions
              </span>
            </label>

            {errors.agree && (
              <p className="mt-2 text-sm text-red-500">
                {errors.agree}
              </p>
            )}
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full"
          >
            Create Account
          </Button>
        </form>

        <p className="mt-8 text-center text-slate-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="
              font-semibold
              text-blue-600
              hover:text-blue-700
            "
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}