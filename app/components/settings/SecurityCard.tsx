import Button from "../ui/Button";
import Input from "../ui/Input";

export default function SecurityCard() {
  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold">
        Security
      </h2>

      <p className="mt-2 text-slate-500">
        Keep your account secure.
      </p>

      <div className="mt-8 grid gap-6">
        <Input
          type="password"
          placeholder="Current Password"
        />

        <Input
          type="password"
          placeholder="New Password"
        />

        <Input
          type="password"
          placeholder="Confirm Password"
        />
      </div>

      <div className="mt-8">
        <Button>
          Update Password
        </Button>
      </div>
    </section>
  );
}