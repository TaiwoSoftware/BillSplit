import Link from "next/link";
import Progress from "../components/ui/Progress";

interface BillCardProps {
  id: string;
  title: string;
  collected: number;
  target: number;
}

export default function BillCard({
  id,
  title,
  collected,
  target,
}: BillCardProps) {
  const percentage =
    (collected / target) * 100;

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-3 text-slate-500">
        ₦{collected.toLocaleString()} /
        ₦{target.toLocaleString()}
      </p>

      <div className="mt-4">
        <Progress value={percentage} />
      </div>

      <Link
        href={`/bills/${id}`}
        className="mt-6 inline-block font-semibold text-blue-600"
      >
        View Bill →
      </Link>
    </div>
  );
}