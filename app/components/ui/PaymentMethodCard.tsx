interface PaymentMethodCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  selected?: boolean;
  onClick?: () => void;
}

export default function PaymentMethodCard({
  title,
  icon,
  description,
  selected,
  onClick,
}: PaymentMethodCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-3xl border p-6 text-left transition ${
        selected
          ? "border-blue-600 bg-blue-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="text-blue-600">
        {icon}
      </div>

      <h3 className="mt-4 text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-slate-500">
        {description}
      </p>
    </button>
  );
}