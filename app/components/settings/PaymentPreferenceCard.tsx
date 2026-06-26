export default function PaymentPreferenceCard() {
  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold">
        Payment Preferences
      </h2>

      <p className="mt-2 text-slate-500">
        Choose your preferred payment method.
      </p>

      <div className="mt-8 space-y-4">
        <label className="flex items-center gap-3">
          <input
            type="radio"
            name="payment"
            defaultChecked
          />

          Card Payments
        </label>

        <label className="flex items-center gap-3">
          <input
            type="radio"
            name="payment"
          />

          Bank Transfer
        </label>
      </div>
    </section>
  );
}