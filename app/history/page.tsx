"use client";

import {
  Trash2,
  History,
  Home,
  Calendar,
} from "lucide-react";

import { usePredictionHistory } from "@/hooks/usePredictionHistory";

export default function HistoryPage() {
  const {
    history,
    loaded,
    removePrediction,
    clearHistory,
  } = usePredictionHistory();

  if (!loaded) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-6xl">
          <div className="animate-pulse rounded-2xl bg-white p-8">
            Loading prediction history...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">

      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <History size={22} />
              </div>

              <div>

                <h1 className="text-2xl font-bold text-slate-900">
                  Prediction History
                </h1>

                <p className="text-sm text-slate-500">
                  View your previous property
                  price estimates.
                </p>

              </div>

            </div>

          </div>

          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              <Trash2 size={16} />

              Clear History
            </button>
          )}

        </div>

        {/* EMPTY STATE */}

        {history.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <History size={26} />
            </div>

            <h2 className="text-lg font-bold text-slate-900">
              No predictions yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Your previous property estimates
              will appear here.
            </p>

          </div>
        )}

        {/* HISTORY TABLE */}

        {history.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px]">

                <thead className="border-b border-slate-200 bg-slate-50">

                  <tr>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Property
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Bedrooms
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Bathrooms
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      School Rating
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Estimated Price
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Date
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {history.map(
                    (item) => (
                      <tr
                        key={item.id}
                        className="transition hover:bg-slate-50"
                      >

                        {/* PROPERTY */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                              <Home size={18} />
                            </div>

                            <div>

                              <p className="font-semibold text-slate-900">
                                {item.property.square_footage.toLocaleString()} sq ft
                              </p>

                              <p className="text-xs text-slate-500">
                                Built{" "}
                                {item.property.year_built}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* BEDROOMS */}

                        <td className="px-6 py-5 text-sm text-slate-600">
                          {item.property.bedrooms}
                        </td>

                        {/* BATHROOMS */}

                        <td className="px-6 py-5 text-sm text-slate-600">
                          {item.property.bathrooms}
                        </td>

                        {/* SCHOOL */}

                        <td className="px-6 py-5 text-sm text-slate-600">
                          {item.property.school_rating}/10
                        </td>

                        {/* PRICE */}

                        <td className="px-6 py-5">

                          <span className="font-bold text-blue-600">
                            {item.predicted_price.toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </span>

                        </td>

                        {/* DATE */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-2 text-sm text-slate-500">

                            <Calendar
                              size={15}
                            />

                            {new Date(
                              item.created_at
                            ).toLocaleDateString()}

                          </div>

                        </td>

                        {/* DELETE */}

                        <td className="px-6 py-5 text-right">

                          <button
                            onClick={() =>
                              removePrediction(
                                item.id
                              )
                            }
                            aria-label="Delete prediction"
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2
                              size={17}
                            />
                          </button>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>
        )}

      </div>

    </main>
  );
}