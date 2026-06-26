interface ProgressProps {
  value: number;
}

export default function Progress({
  value,
}: ProgressProps) {
  return (
    <div className="h-3 overflow-hidden rounded-full bg-slate-200">
      <div
        className="h-full rounded-full bg-blue-600 transition-all"
        style={{
          width: `${value}%`,
        }}
      />
    </div>
  );
}