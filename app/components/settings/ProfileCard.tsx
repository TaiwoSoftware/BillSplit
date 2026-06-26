import Button from "../ui/Button";
import Input from "../ui/Input";

export default function ProfileCard() {
  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold">
        Profile
      </h2>

      <p className="mt-2 text-slate-500">
        Update your account information.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Input placeholder="Full Name" />

        <Input placeholder="Email Address" />

        <Input placeholder="Phone Number" />
      </div>

      <div className="mt-8">
        <Button>
          Save Changes
        </Button>
      </div>
    </section>
  );
}