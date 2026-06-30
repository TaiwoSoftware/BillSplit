"use client";
import { supabase } from "@/app/lib/supabase";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
      remember: false,
    });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

      if (error) {
        setError(error.message);
        return;
      }

      console.log("Logged in:", data.user);

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="
        flex
        min-h-screen
        items-center
        justify-center
        bg-slate-50
        p-6
      "
    >
      <div
        className="
          grid
          w-full
          max-w-6xl
          overflow-hidden
          rounded-[32px]
          bg-white
          shadow-2xl
          lg:grid-cols-2
        "
      >
        {/* Left Side */}
        <div
          className="
            hidden
            flex-col
            justify-center
            bg-gradient-to-br
            from-blue-600
            via-blue-700
            to-indigo-700
            p-14
            text-white
            lg:flex
          "
        >
          <div>
            <h1 className="text-5xl font-bold leading-tight">
              Welcome Back 👋
            </h1>

            <p className="mt-6 text-lg text-blue-100">
              Manage bills, track
              contributions, and collect
              payments effortlessly.
            </p>

            <div className="mt-14 space-y-6">
              <div>
                <h3 className="font-semibold">
                  ✓ Secure Payments
                </h3>

                <p className="mt-1 text-blue-100">
                  Card payments and bank
                  transfers.
                </p>
              </div>

              <div>
                <h3 className="font-semibold">
                  ✓ Real-time Tracking
                </h3>

                <p className="mt-1 text-blue-100">
                  Monitor contributions as
                  they happen.
                </p>
              </div>

              <div>
                <h3 className="font-semibold">
                  ✓ Share Bills Easily
                </h3>

                <p className="mt-1 text-blue-100">
                  Invite participants and
                  collect money quickly.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="p-8 md:p-14">
          <div className="mx-auto max-w-md">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-bold text-slate-900">
                Sign In
              </h2>

              <p className="mt-3 text-slate-500">
                Welcome back. Please enter
                your details.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-10 space-y-6"
            >
              {/* Email */}
              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Email Address
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
                    value={formData.email}
                    onChange={
                      handleChange
                    }
                    placeholder="you@example.com"
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-slate-300
                      py-4
                      pl-12
                      pr-4
                      outline-none
                      transition
                      focus:border-blue-600
                    "
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block font-medium text-slate-700">
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
                    placeholder="Enter password"
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-slate-300
                      py-4
                      pl-12
                      pr-14
                      outline-none
                      transition
                      focus:border-blue-600
                    "
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-slate-500
                    "
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={
                      formData.remember
                    }
                    onChange={
                      handleChange
                    }
                    className="h-4 w-4"
                  />

                  Remember me
                </label>

                <Link
                  href="/forgot-password"
                  className="
                    text-sm
                    font-medium
                    text-blue-600
                    hover:text-blue-700
                  "
                >
                  Forgot Password?
                </Link>
              </div>
              {
                error && (
                  <div
                    className="
      rounded-xl
      border
      border-red-200
      bg-red-50
      p-4
      text-sm
      text-red-600
    "
                  >
                    {error}
                  </div>
                )
              }

              {/* Submit */}
              <button
                type="submit"
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  bg-blue-600
                  py-4
                  font-semibold
                  text-white
                  transition
                  hover:bg-blue-700
                "
              >
                {loading ? "Signing In..." : "Sign In"}
                <ArrowRight size={18} />
              </button>

              {/* Register */}
              <p className="text-center text-slate-500">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="
                    font-semibold
                    text-blue-600
                    hover:text-blue-700
                  "
                >
                  Create Account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}