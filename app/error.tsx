"use client";

export default function Error({
  reset,
}: {
  error: Error & {
    digest?: string;
  };

  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h2 className="text-2xl font-bold">
          Something went wrong
        </h2>

        <p className="mt-3 text-gray-600">
          We were unable to load this page.
          Please try again.
        </p>

        <button
          onClick={() => reset()}
          className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}