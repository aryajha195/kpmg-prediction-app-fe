import Link from "next/link";
import {
  Calculator,
  BarChart3,
  BrainCircuit,
  Activity,
} from "lucide-react";

export default function HomePage() {
  return (
    <div>

      {/* Hero */}

      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.3),_transparent_40%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">

          <div className="max-w-3xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
              <BrainCircuit size={16} />

              Machine Learning Powered
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Smarter property decisions
              <span className="block text-blue-400">
                powered by data.
              </span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              Predict property prices, analyse your
              estimates, and compare properties using
              machine learning.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <Link
                href="/estimator"
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
              >
                Estimate Property Value
              </Link>

              <Link
                href="/analytics"
                className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                View Analytics
              </Link>

            </div>

          </div>

        </div>
      </section>

      {/* Stats */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            icon={<BrainCircuit />}
            title="ML Model"
            value="Regression"
            description="Scikit-learn"
          />

          <StatCard
            icon={<Calculator />}
            title="Prediction"
            value="Real-time"
            description="FastAPI powered"
          />

          <StatCard
            icon={<Activity />}
            title="API Status"
            value="Online"
            description="System operational"
          />

          <StatCard
            icon={<BarChart3 />}
            title="Analytics"
            value="Available"
            description="Model insights"
          />

        </div>

      </section>

      {/* Applications */}

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">

        <h2 className="text-2xl font-bold text-slate-900">
          Applications
        </h2>

        <p className="mt-2 text-slate-500">
          Choose an application to get started.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">

          <ApplicationCard
            icon={<Calculator size={28} />}
            title="Property Value Estimator"
            description="Enter property details and receive an instant machine learning based price prediction."
            href="/estimator"
            button="Start Estimating"
          />

          <ApplicationCard
            icon={<BarChart3 size={28} />}
            title="Property Analytics"
            description="View model metrics, coefficients, prediction history and API health."
            href="/analytics"
            button="Open Analytics"
          />

        </div>

      </section>

    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <p className="mt-5 text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-400">
        {description}
      </p>

    </div>
  );
}

function ApplicationCard({
  icon,
  title,
  description,
  href,
  button,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  button: string;
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <h3 className="mt-6 text-xl font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-slate-500">
        {description}
      </p>

      <Link
        href={href}
        className="mt-6 inline-flex items-center font-semibold text-blue-600"
      >
        {button}

        <span className="ml-2 transition group-hover:translate-x-1">
          →
        </span>
      </Link>

    </div>
  );
}