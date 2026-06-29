import Link from "next/link";

import Badge from "@/app/components/ui/Badge";
import Button from "@/app/components/ui/Button";
import Card from "@/app/components/ui/Card";
import Progress from "@/app/components/ui/Progress";
import TestConnection from "./components/TestConnection";

export default function Home() {
  const features = [
    {
      icon: "💳",
      title: "Card Payments",
      description:
        "Accept secure card payments through Nomba Checkout.",
    },
    {
      icon: "🏦",
      title: "Bank Transfers",
      description:
        "Generate dedicated virtual accounts for contributors who prefer transfers.",
    },
    {
      icon: "📊",
      title: "Real-Time Tracking",
      description:
        "Monitor contributions as payments happen.",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Create a Bill",
      description:
        "Set the title, amount, and number of participants.",
    },
    {
      number: "2",
      title: "Share the Link",
      description:
        "Send your payment link to friends and contributors.",
    },
    {
      number: "3",
      title: "Track Contributions",
      description:
        "Watch contributions update in real time.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/">
            <h1 className="text-2xl font-bold text-blue-600">
              BillSplit 💸
            </h1>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              Login
            </Link>

            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>
      <TestConnection />

      {/* Hero Section */}
      <section className="mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-2 lg:items-center">
        {/* Left */}
        <div>
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            Built for Nigerians 🇳🇬
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-tight md:text-6xl">
            Collect Group Contributions
            <span className="text-blue-600">
              {" "}
              Without the Stress
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-slate-600">
            Create shared bills, generate payment links,
            accept card and bank-transfer payments,
            and track contributions in real time.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/register">
              <Button size="lg">
                Create a Bill
              </Button>
            </Link>

            <Link href="#how-it-works">
              <Button
                variant="outline"
                size="lg"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Right */}
        <Card className="rounded-3xl p-8 shadow-xl">
          <div className="space-y-6">
            <div>
              <p className="text-sm text-slate-500">
                Birthday Dinner 🎂
              </p>

              <h3 className="mt-2 text-3xl font-bold">
                ₦25,000
                <span className="text-lg font-normal text-slate-500">
                  {" "}
                  / ₦30,000
                </span>
              </h3>
            </div>

            <Progress value={83} />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>David</span>
                <Badge>Paid</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span>Sarah</span>
                <Badge>Paid</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span>James</span>
                <Badge variant="warning">
                  Pending
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Trust Metrics */}
      <section className="border-y bg-white py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-blue-600">
              2+
            </h3>
            <p className="mt-2 text-slate-500">
              Payment Methods
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-3xl font-bold text-blue-600">
              Real-Time
            </h3>
            <p className="mt-2 text-slate-500">
              Tracking
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-3xl font-bold text-blue-600">
              Secure
            </h3>
            <p className="mt-2 text-slate-500">
              Payments
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-3xl font-bold text-blue-600">
              24/7
            </h3>
            <p className="mt-2 text-slate-500">
              Collections
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold">
            Everything You Need to Collect Payments
          </h2>

          <p className="mt-3 text-slate-600">
            Designed to simplify contributions and group payments.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <div className="text-4xl">
                {feature.icon}
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                {feature.title}
              </h3>

              <p className="mt-3 text-slate-600">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="bg-white px-6 py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold">
              How BillSplit Works
            </h2>

            <p className="mt-3 text-slate-600">
              Collect contributions in three simple steps.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <Card
                key={step.number}
                className="text-center"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                  {step.number}
                </div>

                <h3 className="mt-6 text-xl font-semibold">
                  {step.title}
                </h3>

                <p className="mt-3 text-slate-600">
                  {step.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl rounded-3xl bg-blue-600 px-8 py-16 text-center text-white">
          <h2 className="text-4xl font-bold">
            Ready to Simplify Group Payments?
          </h2>

          <p className="mt-4 text-lg text-blue-100">
            Create your first bill and start collecting contributions
            in minutes.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-block"
          >
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-slate-100"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
          <h3 className="font-bold text-blue-600">
            BillSplit 💸
          </h3>

          <p className="text-sm text-slate-500">
            Simplifying shared payments in Nigeria.
          </p>
        </div>
      </footer>
    </main>
  );
}