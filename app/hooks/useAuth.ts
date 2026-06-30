"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
}

interface SubmitResult {
  success: boolean;
  user?: any;
}

interface UseAuthReturn {
  formData: FormData;
  errors: Record<string, string>;
  loading: boolean;
  authError: string;
  retryCount: number;

  handleChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;

  handleSubmit: (

    e: React.FormEvent
  ) => Promise<SubmitResult>;

  handleRetry: () => void;

  setAuthError: (value: string) => void;
  setLoading: (value: boolean) => void;
  setRetryCount: (
    value: number | ((prev: number) => number)
  ) => void;
  setFormData: React.Dispatch<
    React.SetStateAction<FormData>
  >;
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

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Password must be at least 8 characters.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password.";
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match.";
    }

    if (!formData.agree) {
      newErrors.agree =
        "You must accept the terms and conditions.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setAuthError("");
  };

  const handleSubmit = async (
    e: React.FormEvent
  ): Promise<SubmitResult> => {
    e.preventDefault();

    if (!validate()) {
      return { success: false };
    }

    try {
      setLoading(true);
      setAuthError("");
      setRetryCount(0);
      console.log(formData);
      console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

      console.log(
        "Supabase Key:",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 25)
      );

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
        },
      });

      console.log("Signup Response:", data);
      console.log("User Metadata:", data.user?.user_metadata);
      console.log("Error:", error);
      if (error) {
        setAuthError(error.message);

        return {
          success: false,
        };
      }

      if (!data.user) {
        setAuthError(
          "Unable to create account."
        );

        return {
          success: false,
        };
      }

      setTimeout(() => {
        router.push("/login");
      }, 1500);

      return {
        success: true,
        user: data.user,
      };
    } catch (err: any) {
      console.error(err);

      setRetryCount((prev) => prev + 1);

      setAuthError(
        err.message ||
        "Something went wrong."
      );

      return {
        success: false,
      };
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setAuthError("");
    setRetryCount(0);
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