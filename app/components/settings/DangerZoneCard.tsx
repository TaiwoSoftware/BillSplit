import Button from "../ui/Button";

export default function DangerZoneCard() {
  return (
    <section className="rounded-3xl border border-red-200 bg-red-50 p-8">
      <h2 className="text-2xl font-bold text-red-600">
        Danger Zone
      </h2>

      <p className="mt-2 text-red-500">
        These actions cannot be undone.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <Button>
          Export Data
        </Button>

        <Button>
          Delete Account
        </Button>
      </div>
    </section>
  );
}