export default function NotificationCard() {
  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold">
        Notifications
      </h2>

      <p className="mt-2 text-slate-500">
        Manage your alerts and reminders.
      </p>

      <div className="mt-8 space-y-4">
        <label className="flex items-center justify-between">
          <span>Payment Alerts</span>

          <input
            type="checkbox"
            defaultChecked
          />
        </label>

        <label className="flex items-center justify-between">
          <span>Contribution Reminders</span>

          <input
            type="checkbox"
            defaultChecked
          />
        </label>

        <label className="flex items-center justify-between">
          <span>Weekly Summary</span>

          <input type="checkbox" />
        </label>
      </div>
    </section>
  );
}