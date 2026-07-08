import Link from "next/link";
import Progress from "../components/ui/Progress";
import { Trash2 } from "lucide-react";

interface BillCardProps {
  id: string;
  title: string;
  collected: number;
  target: number;
  onDelete?: (id: string) => void;
}

export default function BillCard({
  id,
  title,
  collected,
  target,
  onDelete,
}: BillCardProps) {
  const percentage =
    target > 0 ? (collected / target) * 100 : 0;

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-3 text-slate-500">
        ₦{collected.toLocaleString()} / ₦{target.toLocaleString()}
      </p>

      <div className="mt-4">
        <Progress value={percentage} />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Link
          href={`/pay/${id}`}
          className="inline-block font-semibold text-blue-600"
        >
          View Bill →
        </Link>

        {onDelete && (
          <button
            onClick={() => onDelete(id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    </div>
  );
}