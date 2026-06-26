import Button from "../ui/Button";
import Input from "../ui/Input";

export default function BankAccountCard() {
  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold">
        Bank Account
      </h2>

      <p className="mt-2 text-slate-500">
        Verify your bank details for payouts.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Input placeholder="Bank Name" />

        <Input placeholder="Account Number" />

        <Input
          placeholder="Account Name"
          disabled
        />
      </div>

      <div className="mt-8">
        <Button>
          Verify Account
        </Button>
      </div>
    </section>
  );
}