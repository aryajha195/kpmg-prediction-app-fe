import PropertyForm from "@/components/PropertyForm";


export default function EstimatorPage() {
  return (
    <div className="min-h-screen bg-slate-50">

      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
            Property Intelligence
          </span>

          <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            Property Value Estimator
          </h1>

          <p className="mt-3 max-w-2xl text-lg text-slate-500">
            Enter your property details and get an
            estimated market value using our regression model.
          </p>

        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        <div className="grid gap-8 lg:grid-cols-3">

          <div className="lg:col-span-2">
            <PropertyForm />
          </div>

          <div className="h-fit rounded-2xl border bg-white p-6 shadow-sm">

            <h2 className="font-bold text-slate-900">
              How it works
            </h2>

            <div className="mt-6 space-y-6">

              <Step
                number="01"
                title="Enter Details"
                text="Provide the characteristics of the property."
              />

              <Step
                number="02"
                title="Run Prediction"
                text="The ML model analyses the property."
              />

              <Step
                number="03"
                title="Review Result"
                text="View the estimated property value."
              />

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
        {number}
      </div>

      <div>
        <h3 className="font-semibold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {text}
        </p>
      </div>

    </div>
  );
}