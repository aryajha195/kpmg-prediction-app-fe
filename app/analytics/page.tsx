"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  BrainCircuit,
  TrendingUp,
} from "lucide-react";

interface ModelInfo {
  model: string;
  coefficients: Record<string, number>;
  intercept: number;
  metrics: {
    mae: number;
    rmse: number;
    r2: number;
  };
}

export default function AnalyticsPage() {
  const [model, setModel] =
    useState<ModelInfo | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadModel() {
      try {
        const response =
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/model-info`
          );

        const data =
          await response.json();

        setModel(data);
      } finally {
        setLoading(false);
      }
    }

    loadModel();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <h1 className="text-3xl font-bold text-slate-900">
            Model Analytics
          </h1>

          <p className="mt-2 text-slate-500">
            Monitor your machine learning model performance.
          </p>

        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        <div className="grid gap-6 md:grid-cols-3">

          <Metric
            icon={<BrainCircuit />}
            title="Model"
            value={model?.model || "Unknown"}
          />

          <Metric
            icon={<TrendingUp />}
            title="R² Score"
            value={
              model?.metrics.r2.toFixed(4) ||
              "N/A"
            }
          />

          <Metric
            icon={<Activity />}
            title="MAE"
            value={
              model?.metrics.mae.toLocaleString() ||
              "N/A"
            }
          />

        </div>

        <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold">
            Model Coefficients
          </h2>

          <div className="mt-6 overflow-x-auto">

            <table className="w-full text-left">

              <thead>
                <tr className="border-b text-sm text-slate-500">
                  <th className="px-4 py-3">
                    Feature
                  </th>

                  <th className="px-4 py-3">
                    Coefficient
                  </th>
                </tr>
              </thead>

              <tbody>

                {model &&
                  Object.entries(
                    model.coefficients
                  ).map(
                    ([feature, value]) => (
                      <tr
                        key={feature}
                        className="border-b last:border-0"
                      >
                        <td className="px-4 py-4 font-medium">
                          {feature}
                        </td>

                        <td className="px-4 py-4">
                          {value.toLocaleString()}
                        </td>
                      </tr>
                    )
                  )}

              </tbody>

            </table>

          </div>

        </div>

      </section>

    </div>
  );
}

function Metric({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <p className="mt-5 text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}