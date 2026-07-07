"use client";

import { useState, useEffect } from "react";

interface VerificationResult {
  verified: boolean;
  loading: boolean;
  error: string | null;
  data?: any;
}

export function usePaymentVerification(orderReference: string | null): VerificationResult {
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function verifyPayment() {
      if (!orderReference) {
        setLoading(false);
        setError("No order reference provided");
        return;
      }

      try {
        const response = await fetch("/api/nomba/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderReference }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Verification failed");
        }

        if (result.success) {
          setVerified(true);
          setData(result.data);
        } else {
          setError(result.message || "Verification failed");
        }
      } catch (err: any) {
        console.error("Verification error:", err);
        setError(err.message || "An error occurred during verification");
      } finally {
        setLoading(false);
      }
    }

    verifyPayment();
  }, [orderReference]);

  return { loading, verified, error, data };
}