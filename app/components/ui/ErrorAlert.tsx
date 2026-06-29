"use client";

interface ErrorAlertProps {
  error: string;
  retryCount: number;
  onRetry?: () => void;
}

export default function ErrorAlert({ error, retryCount, onRetry }: ErrorAlertProps) {
  if (!error) return null;

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
      {error}
      {retryCount > 0 && retryCount < 3 && onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="ml-2 text-blue-600 hover:text-blue-800 underline font-medium"
        >
          Retry
        </button>
      )}
    </div>
  );
}