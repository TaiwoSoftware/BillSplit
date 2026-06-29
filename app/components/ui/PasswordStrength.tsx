"use client";

interface PasswordStrengthProps {
  password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const getStrength = () => {
    if (password.length === 0) return { text: "None", color: "text-slate-500" };
    if (password.length < 6) return { text: "Weak", color: "text-red-500" };
    if (password.length < 10) return { text: "Medium", color: "text-yellow-500" };
    return { text: "Strong", color: "text-green-500" };
  };

  const strength = getStrength();

  if (password.length === 0) return null;

  return (
    <p className="mt-2 text-sm">
      Password Strength: <span className={strength.color}>{strength.text}</span>
    </p>
  );
}