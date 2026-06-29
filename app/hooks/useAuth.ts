"use client";

import { useState, useRef, useCallback } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
}

interface UseAuthReturn {
  formData: FormData;
  errors: Record<string, string>;
  loading: boolean;
  authError: string;
  retryCount: number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleRetry: () => void;
  setAuthError: (error: string) => void;
  setLoading: (loading: boolean) => void;
  setRetryCount: (count: number) => void;
  setFormData: (data: FormData) => void;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!formData.agree) {
      newErrors.agree = "Please accept the terms.";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for the field being edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validate()) return;

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setAuthError("");
      setRetryCount(0);

      // Set timeout for the request
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error("Request timeout. Please try again."));
        }, 15000);
      });

      const signUpPromise = supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      const { data: authData, error: authError } = await Promise.race([
        signUpPromise,
        timeoutPromise.then(() => {
          throw new Error("Request timeout. Please check your connection and try again.");
        }),
      ]) as any;

      if (authError) {
        if (authError.message.includes("User already registered")) {
          setAuthError("This email is already registered. Please login instead.");
        } else if (authError.message.includes("network")) {
          setAuthError("Network error. Please check your internet connection.");
        } else {
          setAuthError(authError.message);
        }
        return;
      }

      if (authData?.user) {
        // Create profile with retry logic
        let profileCreated = false;
        let attempts = 0;
        const maxAttempts = 3;

        while (!profileCreated && attempts < maxAttempts) {
          try {
            const { error: profileError } = await supabase
              .from("profiles")
              .insert([
                {
                  id: authData.user.id,
                  full_name: formData.fullName,
                  email: formData.email,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                },
              ]);

            if (profileError) {
              if (profileError.code === "23505") {
                profileCreated = true;
                break;
              }
              attempts++;
              if (attempts === maxAttempts) {
                throw new Error("Failed to create profile after multiple attempts.");
              }
              await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
            } else {
              profileCreated = true;
            }
          } catch (profileErr) {
            attempts++;
            if (attempts === maxAttempts) {
              throw profileErr;
            }
            await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
          }
        }

        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err: any) {
      console.error("Registration error:", err);

      if (err.name === "AbortError") {
        setAuthError("Request was cancelled. Please try again.");
      } else if (err.message.includes("timeout")) {
        setAuthError("Request timed out. Please check your connection.");
      } else if (err.message.includes("network")) {
        setAuthError("Network error. Please check your internet connection.");
      } else {
        setAuthError("Something went wrong. Please try again.");
      }

      if (err.name !== "AbortError") {
        setRetryCount((prev) => prev + 1);
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleRetry = () => {
    setRetryCount(0);
    setAuthError("");
    const form = document.querySelector("form");
    if (form) {
      form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    }
  };

  return {
    formData,
    errors,
    loading,
    authError,
    retryCount,
    handleChange,
    handleSubmit,
    handleRetry,
    setAuthError,
    setLoading,
    setRetryCount,
    setFormData,
  };
}