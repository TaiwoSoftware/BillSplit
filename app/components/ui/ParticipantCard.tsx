import Badge from "../ui/Badge";

interface ParticipantCardProps {
  name: string;
  status: "paid" | "pending";
}

export default function ParticipantCard({
  name,
  status,
}: ParticipantCardProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm">
      <div>
        <h3 className="font-medium">
          {name}
        </h3>
      </div>

      {status === "paid" ? (
        <Badge>Paid</Badge>
      ) : (
        <Badge variant="warning">
          Pending
        </Badge>
      )}
    </div>
  );
}