"use client";

import { FormEvent, ReactNode, useState } from "react";

import {
  Home,
  BedDouble,
  Bath,
  CalendarDays,
  Ruler,
  MapPin,
  GraduationCap,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import {
  usePredictionHistory,
} from "@/hooks/usePredictionHistory";

/* =========================================================
   PROPERTY INPUT
========================================================= */

interface PropertyInput {
  square_footage: number;
  bedrooms: number;
  bathrooms: number;
  year_built: number;
  lot_size: number;
  distance_to_city_center: number;
  school_rating: number;
}

/* =========================================================
   FIELD ERRORS
========================================================= */

interface FieldErrors {
  [key: string]: string;
}

/* =========================================================
   PROPERTY FORM
========================================================= */

export default function PropertyForm() {
  /* =======================================================
     FORM STATE
  ======================================================= */

  const [formData, setFormData] =
    useState<PropertyInput>({
      square_footage: 980,
      bedrooms: 2,
      bathrooms: 1,
      year_built: 1978,
      lot_size: 4400,
      distance_to_city_center: 2.1,
      school_rating: 6.5,
    });

  /* =======================================================
     PREDICTION STATE
  ======================================================= */

  const [prediction, setPrediction] =
    useState<number | null>(null);

  /* =======================================================
     LOADING STATE
  ======================================================= */

  const [loading, setLoading] =
    useState(false);

  /* =======================================================
     GENERAL ERROR
  ======================================================= */

  const [error, setError] =
    useState<string | null>(null);

  /* =======================================================
     FIELD-SPECIFIC ERRORS
  ======================================================= */

  const [fieldErrors, setFieldErrors] =
    useState<FieldErrors>({});

  /* =======================================================
     HISTORY HOOK
  ======================================================= */

  const {
    addPrediction,
  } = usePredictionHistory();

  /* =======================================================
     HANDLE INPUT CHANGE
  ======================================================= */

  function handleChange(
    field: keyof PropertyInput,
    value: string
  ) {
    const numericValue =
      Number(value);

    setFormData(
      (previous) => ({
        ...previous,
        [field]: numericValue,
      })
    );

    /*
     * Clear the error for the field
     * when the user changes its value.
     */

    setFieldErrors(
      (previous) => {
        const updated = {
          ...previous,
        };

        delete updated[field];

        return updated;
      }
    );

    /*
     * Remove general error.
     */

    setError(null);

    /*
     * Remove previous prediction
     * when user modifies the form.
     */

    setPrediction(null);
  }

  /* =======================================================
     CLIENT-SIDE VALIDATION
  ======================================================= */

  function validateForm() {
    const errors: FieldErrors =
      {};

    /*
     * Square footage
     */

    if (
      formData.square_footage <= 0
    ) {
      errors.square_footage =
        "Square footage must be greater than 0.";
    } else if (
      formData.square_footage > 2400
    ) {
      errors.square_footage =
        "Square footage cannot exceed 2,400 sq ft.";
    }

    /*
     * Bedrooms
     */

    if (
      formData.bedrooms < 0
    ) {
      errors.bedrooms =
        "Bedrooms cannot be negative.";
    }

    /*
     * Bathrooms
     */

    if (
      formData.bathrooms < 0
    ) {
      errors.bathrooms =
        "Bathrooms cannot be negative.";
    }

    /*
     * Year built
     */

    const currentYear =
      new Date().getFullYear();

    if (
      formData.year_built < 1800 ||
      formData.year_built >
        currentYear
    ) {
      errors.year_built =
        `Year built must be between 1800 and ${currentYear}.`;
    }

    /*
     * Lot size
     */

    if (
      formData.lot_size <= 0
    ) {
      errors.lot_size =
        "Lot size must be greater than 0.";
    }

    /*
     * Distance to city center
     */

    if (
      formData.distance_to_city_center <
      0
    ) {
      errors.distance_to_city_center =
        "Distance to city center cannot be negative.";
    }

    /*
     * School rating
     */

    if (
      formData.school_rating < 0 ||
      formData.school_rating > 10
    ) {
      errors.school_rating =
        "School rating must be between 0 and 10.";
    }

    return errors;
  }

  /* =======================================================
     HANDLE FASTAPI ERRORS
  ======================================================= */

  function handleApiErrors(
    data: any
  ) {
    const errors: FieldErrors =
      {};

    let generalError =
      "Please check the highlighted fields and try again.";

    /*
     * FastAPI validation response:
     *
     * {
     *   "detail": [
     *     {
     *       "type": "less_than_equal",
     *       "loc": [
     *         "body",
     *         "HousingFeatures",
     *         "square_footage"
     *       ],
     *       "msg":
     *       "Input should be less than or equal to 2400",
     *       "input": 98000,
     *       "ctx": {
     *         "le": 2400
     *       }
     *     }
     *   ]
     * }
     */

    if (
      Array.isArray(
        data?.detail
      )
    ) {
      data.detail.forEach(
        (item: any) => {
          const location =
            item?.loc || [];

          /*
           * Last item in loc is
           * usually the field name.
           *
           * Example:
           *
           * [
           *   "body",
           *   "HousingFeatures",
           *   "square_footage"
           * ]
           *
           * Result:
           *
           * square_footage
           */

          const field =
            location[
              location.length - 1
            ];

          const message =
            item?.msg ||
            "Invalid value.";

          /*
           * If field exists in our
           * form, display field error.
           */

          if (
            field &&
            field in formData
          ) {
            errors[field] =
              formatApiError(
                field,
                message,
                item?.ctx
              );
          } else {
            /*
             * Ignore internal union/list
             * validation errors.
             *
             * Example:
             *
             * list[HousingFeatures]
             *
             * This is not useful to
             * display to the user.
             */

            generalError =
              "The property information could not be processed. Please check your input.";
          }
        }
      );
    }

    /*
     * Handle string errors.
     */

    if (
      typeof data?.detail ===
      "string"
    ) {
      generalError =
        data.detail;
    }

    setFieldErrors(errors);

    setError(
      generalError
    );
  }

  /* =======================================================
     SUBMIT FORM
  ======================================================= */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    /*
     * Reset previous state.
     */

    setLoading(true);

    setError(null);

    setFieldErrors({});

    setPrediction(null);

    try {
      /* ===================================================
         CLIENT-SIDE VALIDATION
      =================================================== */

      const validationErrors =
        validateForm();

      if (
        Object.keys(
          validationErrors
        ).length > 0
      ) {
        setFieldErrors(
          validationErrors
        );

        setError(
          "Please correct the highlighted fields before submitting."
        );

        return;
      }

      /* ===================================================
         API URL
      =================================================== */

      const apiUrl =
        process.env
          .NEXT_PUBLIC_API_URL ||
        "http://localhost:8000";

      /* ===================================================
         SEND REQUEST
      =================================================== */

      const response =
        await fetch(
          `${apiUrl}/predict`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              formData
            ),
          }
        );

      /* ===================================================
         PARSE RESPONSE
      =================================================== */

      const data =
        await response.json();

      console.log(
        "Prediction API Response:",
        data
      );

      /* ===================================================
         HANDLE API ERROR
      =================================================== */

      if (!response.ok) {
        handleApiErrors(
          data
        );

        return;
      }

      /* ===================================================
         GET PREDICTED PRICE
      =================================================== */

      /*
       * Expected API response:
       *
       * {
       *   "predictions": [
       *     {
       *       "predicted_price":
       *       154734.3239939958
       *     }
       *   ]
       * }
       */

      const predictedValue =
        data
          ?.predictions?.[0]
          ?.predicted_price;

      /* ===================================================
         CHECK RESPONSE
      =================================================== */

      if (
        predictedValue ===
          undefined ||
        predictedValue ===
          null
      ) {
        setError(
          "The prediction service returned an unexpected response. Please try again."
        );

        return;
      }

      /* ===================================================
         CONVERT TO NUMBER
      =================================================== */

      const numericPrediction =
        Number(
          predictedValue
        );

      /* ===================================================
         CHECK NUMBER
      =================================================== */

      if (
        Number.isNaN(
          numericPrediction
        )
      ) {
        setError(
          "The predicted price returned by the server is invalid."
        );

        return;
      }

      /* ===================================================
         SET PREDICTION
      =================================================== */

      setPrediction(
        numericPrediction
      );

      /* ===================================================
         SAVE TO HISTORY
      =================================================== */

      addPrediction(
        formData,
        numericPrediction
      );

    } catch (error) {
      console.error(
        "Prediction error:",
        error
      );

      /*
       * Network error
       */

      if (
        error instanceof
        TypeError
      ) {
        setError(
          "Unable to connect to the ML API. Please make sure the backend is running."
        );

        return;
      }

      /*
       * General error
       */

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while predicting the property price."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-8">

        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Home size={24} />
        </div>

        <h2 className="text-2xl font-bold text-slate-900">
          Property Details
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Enter the property information
          below to generate a machine
          learning based price prediction.
        </p>

      </div>

      {/* =================================================
          GENERAL ERROR
      ================================================= */}

      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="mb-6 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
        >

          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0 text-red-600"
          />

          <div>

            <p className="font-semibold text-red-800">
              Unable to predict property value
            </p>

            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>

          </div>

        </div>
      )}

      {/* =================================================
          FORM
      ================================================= */}

      <form
        onSubmit={
          handleSubmit
        }
        noValidate
      >

        <div className="grid gap-6 sm:grid-cols-2">

          {/* =============================================
              SQUARE FOOTAGE
          ============================================== */}

          <Input
            label="Square Footage"
            icon={
              <Home size={18} />
            }
            value={
              formData.square_footage
            }
            placeholder="980"
            suffix="sq ft"
            min={1}
            max={2400}
            error={
              fieldErrors.square_footage
            }
            onChange={(value) =>
              handleChange(
                "square_footage",
                value
              )
            }
          />

          {/* =============================================
              BEDROOMS
          ============================================== */}

          <Input
            label="Bedrooms"
            icon={
              <BedDouble
                size={18}
              />
            }
            value={
              formData.bedrooms
            }
            placeholder="2"
            min={0}
            error={
              fieldErrors.bedrooms
            }
            onChange={(value) =>
              handleChange(
                "bedrooms",
                value
              )
            }
          />

          {/* =============================================
              BATHROOMS
          ============================================== */}

          <Input
            label="Bathrooms"
            icon={
              <Bath size={18} />
            }
            value={
              formData.bathrooms
            }
            placeholder="1"
            min={0}
            step="0.5"
            error={
              fieldErrors.bathrooms
            }
            onChange={(value) =>
              handleChange(
                "bathrooms",
                value
              )
            }
          />

          {/* =============================================
              YEAR BUILT
          ============================================== */}

          <Input
            label="Year Built"
            icon={
              <CalendarDays
                size={18}
              />
            }
            value={
              formData.year_built
            }
            placeholder="1978"
            min={1800}
            max={
              new Date().getFullYear()
            }
            error={
              fieldErrors.year_built
            }
            onChange={(value) =>
              handleChange(
                "year_built",
                value
              )
            }
          />

          {/* =============================================
              LOT SIZE
          ============================================== */}

          <Input
            label="Lot Size"
            icon={
              <Ruler size={18} />
            }
            value={
              formData.lot_size
            }
            placeholder="4400"
            suffix="sq ft"
            min={1}
            error={
              fieldErrors.lot_size
            }
            onChange={(value) =>
              handleChange(
                "lot_size",
                value
              )
            }
          />

          {/* =============================================
              DISTANCE TO CITY CENTER
          ============================================== */}

          <Input
            label="Distance to City Center"
            icon={
              <MapPin size={18} />
            }
            value={
              formData.distance_to_city_center
            }
            placeholder="2.1"
            suffix="miles"
            min={0}
            step="0.1"
            error={
              fieldErrors.distance_to_city_center
            }
            onChange={(value) =>
              handleChange(
                "distance_to_city_center",
                value
              )
            }
          />

          {/* =============================================
              SCHOOL RATING
          ============================================== */}

          <Input
            label="School Rating"
            icon={
              <GraduationCap
                size={18}
              />
            }
            value={
              formData.school_rating
            }
            placeholder="6.5"
            suffix="/ 10"
            min={0}
            max={10}
            step="0.1"
            error={
              fieldErrors.school_rating
            }
            onChange={(value) =>
              handleChange(
                "school_rating",
                value
              )
            }
          />

        </div>

        {/* =================================================
            SUBMIT BUTTON
        ================================================= */}

        <button
          type="submit"
          disabled={loading}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >

          {loading ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />

              Predicting Property Value...
            </>
          ) : (
            <>
              <Home size={18} />

              Predict Property Price
            </>
          )}

        </button>

      </form>

      {/* =================================================
          PREDICTION RESULT
      ================================================= */}

      {prediction !== null && (
        <div className="mt-8 overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm">

          {/* RESULT HEADER */}

          <div className="bg-emerald-600 p-6 text-white">

            <div className="flex items-center gap-2">

              <CheckCircle2
                size={20}
              />

              <p className="text-sm font-semibold text-emerald-50">
                Prediction Successful
              </p>

            </div>

            <p className="mt-4 text-sm font-medium text-emerald-100">
              Estimated Property Value
            </p>

            <p className="mt-2 text-4xl font-bold tracking-tight">
              {prediction.toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </p>

          </div>

          {/* RESULT DETAILS */}

          <div className="bg-emerald-50 p-5">

            <div className="grid gap-4 sm:grid-cols-3">

              <ResultItem
                label="Square Footage"
                value={`${formData.square_footage.toLocaleString()} sq ft`}
              />

              <ResultItem
                label="Bedrooms"
                value={String(
                  formData.bedrooms
                )}
              />

              <ResultItem
                label="Bathrooms"
                value={String(
                  formData.bathrooms
                )}
              />

            </div>

            <p className="mt-5 text-sm text-emerald-800">
              This prediction has also been
              saved to your prediction history.
            </p>

          </div>

        </div>
      )}

    </div>
  );
}

/* =========================================================
   INPUT COMPONENT
========================================================= */

function Input({
  label,
  icon,
  value,
  placeholder,
  suffix,
  min,
  max,
  step = "1",
  error,
  onChange,
}: {
  label: string;
  icon: ReactNode;
  value: number;
  placeholder: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: string;
  error?: string;
  onChange: (
    value: string
  ) => void;
}) {
  const hasError =
    Boolean(error);

  const inputId =
    label
      .toLowerCase()
      .replace(
        /\s+/g,
        "-"
      );

  return (
    <div>

      {/* LABEL */}

      <label
        htmlFor={inputId}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      {/* INPUT WRAPPER */}

      <div className="relative">

        {/* ICON */}

        <div
          className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${
            hasError
              ? "text-red-400"
              : "text-slate-400"
          }`}
        >
          {icon}
        </div>

        {/* INPUT */}

        <input
          id={inputId}
          type="number"
          value={value}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          required
          aria-invalid={
            hasError
          }
          aria-describedby={
            hasError
              ? `${inputId}-error`
              : undefined
          }
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          className={`w-full rounded-xl border bg-slate-50 py-3 pl-12 pr-20 text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
            hasError
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
              : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
          }`}
        />

        {/* SUFFIX */}

        {suffix && (
          <span
            className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium ${
              hasError
                ? "text-red-400"
                : "text-slate-400"
            }`}
          >
            {suffix}
          </span>
        )}

      </div>

      {/* FIELD ERROR */}

      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-2 flex items-start gap-1.5 text-sm font-medium text-red-600"
        >
          <AlertCircle
            size={15}
            className="mt-0.5 shrink-0"
          />

          <span>
            {error}
          </span>

        </p>
      )}

    </div>
  );
}

/* =========================================================
   RESULT ITEM
========================================================= */

function ResultItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-emerald-100 bg-white p-4">

      <p className="text-xs font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   FORMAT API ERROR
========================================================= */

function formatApiError(
  field: string,
  message: string,
  context?: {
    le?: number;
    ge?: number;
    lt?: number;
    gt?: number;
  }
) {
  const lowerMessage =
    message.toLowerCase();

  /*
   * less_than_equal
   */

  if (
    lowerMessage.includes(
      "less than or equal"
    )
  ) {
    if (
      context?.le !== undefined
    ) {
      return `${formatFieldName(
        field
      )} must be less than or equal to ${context.le}.`;
    }
  }

  /*
   * greater_than_equal
   */

  if (
    lowerMessage.includes(
      "greater than or equal"
    )
  ) {
    if (
      context?.ge !== undefined
    ) {
      return `${formatFieldName(
        field
      )} must be greater than or equal to ${context.ge}.`;
    }
  }

  /*
   * less_than
   */

  if (
    lowerMessage.includes(
      "less than"
    )
  ) {
    if (
      context?.lt !== undefined
    ) {
      return `${formatFieldName(
        field
      )} must be less than ${context.lt}.`;
    }
  }

  /*
   * greater_than
   */

  if (
    lowerMessage.includes(
      "greater than"
    )
  ) {
    if (
      context?.gt !== undefined
    ) {
      return `${formatFieldName(
        field
      )} must be greater than ${context.gt}.`;
    }
  }

  /*
   * Default API message
   */

  return message;
}

/* =========================================================
   FORMAT FIELD NAME
========================================================= */

function formatFieldName(
  field: string
) {
  return field
    .split("_")
    .map(
      (word) =>
        word
          .charAt(0)
          .toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}