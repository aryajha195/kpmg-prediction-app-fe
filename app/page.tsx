"use client";

import { FormEvent, useState } from "react";

type FormData = {
  square_footage: string;
  bedrooms: string;
  bathrooms: string;
  year_built: string;
  lot_size: string;
  distance_to_city_center: string;
  school_rating: string;
};

type PredictionResponse = {
  predictions: {
    predicted_price: number;
  }[];
};

export default function EstimatorPage() {
  const [formData, setFormData] =
    useState<FormData>({
      square_footage: "",
      bedrooms: "",
      bathrooms: "",
      year_built: "",
      lot_size: "",
      distance_to_city_center: "",
      school_rating: "",
    });

  const [prediction, setPrediction] =
    useState<number | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // --------------------------------------------------
  // Handle input changes
  // --------------------------------------------------

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

    // Clear old prediction
    // when user changes input
    setPrediction(null);

    // Clear old error
    // when user changes input
    setError("");
  };


  // --------------------------------------------------
  // Handle form submission
  // --------------------------------------------------

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    // Clear previous state
    setError("");
    setPrediction(null);


    // --------------------------------------------------
    // Required field validation
    // --------------------------------------------------

    if (
      !formData.square_footage ||
      !formData.bedrooms ||
      !formData.bathrooms ||
      !formData.year_built ||
      !formData.lot_size ||
      !formData.distance_to_city_center ||
      !formData.school_rating
    ) {
      setError(
        "Please fill in all property details."
      );

      return;
    }


    // --------------------------------------------------
    // Convert form values to numbers
    // --------------------------------------------------

    const squareFootage =
      Number(
        formData.square_footage
      );

    const bedrooms =
      Number(
        formData.bedrooms
      );

    const bathrooms =
      Number(
        formData.bathrooms
      );

    const yearBuilt =
      Number(
        formData.year_built
      );

    const lotSize =
      Number(
        formData.lot_size
      );

    const distanceToCityCenter =
      Number(
        formData.distance_to_city_center
      );

    const schoolRating =
      Number(
        formData.school_rating
      );


    // --------------------------------------------------
    // Client-side validation
    //
    // These ranges match the training dataset.
    // --------------------------------------------------

    if (
      squareFootage < 980 ||
      squareFootage > 2400
    ) {
      setError(
        "Square footage must be between 980 and 2,400 sq ft."
      );

      return;
    }


    if (
      bedrooms < 2 ||
      bedrooms > 4
    ) {
      setError(
        "Bedrooms must be between 2 and 4."
      );

      return;
    }


    if (
      bathrooms < 1 ||
      bathrooms > 3
    ) {
      setError(
        "Bathrooms must be between 1 and 3."
      );

      return;
    }


    if (
      yearBuilt < 1978 ||
      yearBuilt > 2012
    ) {
      setError(
        "Year built must be between 1978 and 2012."
      );

      return;
    }


    if (
      lotSize < 4400 ||
      lotSize > 10500
    ) {
      setError(
        "Lot size must be between 4,400 and 10,500 sq ft."
      );

      return;
    }


    if (
      distanceToCityCenter < 2.1 ||
      distanceToCityCenter > 8.2
    ) {
      setError(
        "Distance to city center must be between 2.1 and 8.2 miles."
      );

      return;
    }


    if (
      schoolRating < 6.5 ||
      schoolRating > 9.1
    ) {
      setError(
        "School rating must be between 6.5 and 9.1."
      );

      return;
    }


    // --------------------------------------------------
    // Start loading
    // --------------------------------------------------

    setLoading(true);


    try {

      // --------------------------------------------------
      // Call FastAPI prediction API
      // --------------------------------------------------

      const response =
        await fetch(
          "http://127.0.0.1:8000/predict",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                square_footage:
                  squareFootage,

                bedrooms:
                  bedrooms,

                bathrooms:
                  bathrooms,

                year_built:
                  yearBuilt,

                lot_size:
                  lotSize,

                distance_to_city_center:
                  distanceToCityCenter,

                school_rating:
                  schoolRating,
              }),
          }
        );


      // --------------------------------------------------
      // Always read response JSON
      //
      // This is important because FastAPI returns
      // validation errors inside "detail".
      // --------------------------------------------------

      const data =
        await response.json();


      console.log(
        "Prediction API Response:",
        data
      );


      // --------------------------------------------------
      // Handle API errors
      // --------------------------------------------------

      if (!response.ok) {

        // ----------------------------------------------
        // FastAPI validation errors
        // ----------------------------------------------

        if (
          Array.isArray(
            data.detail
          )
        ) {

          const validationMessages =
            data.detail.map(
              (
                validationError: {
                  msg?: string;
                  loc?: string[];
                }
              ) => {

                // Get field name
                const field =
                  validationError
                    .loc?.[
                      validationError.loc.length -
                        1
                    ] ??
                  "Field";


                // Convert technical field names
                // into user-friendly names
                const fieldNames: Record<
                  string,
                  string
                > = {

                  square_footage:
                    "Square footage",

                  bedrooms:
                    "Bedrooms",

                  bathrooms:
                    "Bathrooms",

                  year_built:
                    "Year built",

                  lot_size:
                    "Lot size",

                  distance_to_city_center:
                    "Distance to city center",

                  school_rating:
                    "School rating",
                };


                const friendlyFieldName =
                  fieldNames[field] ??
                  field;


                return (
                  `${friendlyFieldName}: ` +
                  `${validationError.msg ?? "Invalid value."}`
                );
              }
            );


          throw new Error(
            validationMessages.join(
              "\n"
            )
          );
        }


        // ----------------------------------------------
        // Normal FastAPI error
        // ----------------------------------------------

        if (
          typeof data.detail ===
          "string"
        ) {

          throw new Error(
            data.detail
          );
        }


        // ----------------------------------------------
        // Unknown API error
        // ----------------------------------------------

        throw new Error(
          `API request failed with status ${response.status}.`
        );
      }


      // --------------------------------------------------
      // Get prediction from successful response
      // --------------------------------------------------

      const predictedPrice =
        data
          .predictions?.[0]
          ?.predicted_price;


      // --------------------------------------------------
      // Make sure prediction exists
      // --------------------------------------------------

      if (
        predictedPrice ===
          undefined ||
        predictedPrice ===
          null
      ) {

        throw new Error(
          "Prediction value was not returned by the API."
        );
      }


      // --------------------------------------------------
      // Save prediction
      // --------------------------------------------------

      setPrediction(
        predictedPrice
      );

    } catch (
      error
    ) {

      console.error(
        "Prediction API Error:",
        error
      );


      // --------------------------------------------------
      // Show actual error message
      // --------------------------------------------------

      if (
        error instanceof Error
      ) {

        setError(
          error.message
        );

      } else {

        setError(
          "Something went wrong while getting the prediction."
        );
      }

    } finally {

      // --------------------------------------------------
      // Stop loading
      // --------------------------------------------------

      setLoading(false);
    }
  };


  // --------------------------------------------------
  // Format currency
  // --------------------------------------------------

  const formatCurrency = (
    value: number
  ) => {

    return new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }
    ).format(value);
  };


  // --------------------------------------------------
  // Render UI
  // --------------------------------------------------

  return (
    <div className="container py-4 py-md-5">

      {/* ========================= */}
      {/* Page Header */}
      {/* ========================= */}

      <div className="mb-4">

        <h1 className="fw-semibold mb-2">
          Property Value Estimator
        </h1>

        <p className="text-muted mb-0">
          Enter the property details below to
          estimate its market value using the
          machine learning model.
        </p>

      </div>


      {/* ========================= */}
      {/* Error Alert */}
      {/* ========================= */}

      {error && (

        <div
          className="alert alert-danger"
          role="alert"
        >

          <strong>
            Prediction Error
          </strong>

          <div
            className="mt-2"
            style={{
              whiteSpace:
                "pre-line",
            }}
          >
            {error}
          </div>

        </div>

      )}


      {/* ========================= */}
      {/* Main Layout */}
      {/* ========================= */}

      <div className="row g-4">


        {/* ========================= */}
        {/* Form Section */}
        {/* ========================= */}

        <div className="col-12 col-lg-7">

          <div className="card shadow-sm border-0">

            <div className="card-body p-4">

              <div className="mb-4">

                <h2 className="h5 fw-semibold mb-1">
                  Property Details
                </h2>

                <p className="text-muted small mb-0">
                  Enter the information about the
                  property you want to evaluate.
                </p>

              </div>


              <form
                onSubmit={
                  handleSubmit
                }
              >

                <div className="row g-3">


                  {/* ========================= */}
                  {/* Square Footage */}
                  {/* ========================= */}

                  <div className="col-12">

                    <label
                      htmlFor="square_footage"
                      className="form-label fw-medium"
                    >
                      Square Footage
                    </label>

                    <div className="input-group">

                      <input
                        id="square_footage"
                        name="square_footage"
                        type="number"
                        min="980"
                        max="2400"
                        step="1"
                        value={
                          formData.square_footage
                        }
                        onChange={
                          handleChange
                        }
                        className="form-control"
                        placeholder="Example: 1550"
                      />

                      <span className="input-group-text">
                        sq ft
                      </span>

                    </div>

                    <div className="form-text">
                      Allowed range:
                      {" "}
                      980 - 2,400 sq ft.
                    </div>

                  </div>


                  {/* ========================= */}
                  {/* Bedrooms */}
                  {/* ========================= */}

                  <div className="col-12 col-md-6">

                    <label
                      htmlFor="bedrooms"
                      className="form-label fw-medium"
                    >
                      Bedrooms
                    </label>

                    <input
                      id="bedrooms"
                      name="bedrooms"
                      type="number"
                      min="2"
                      max="4"
                      step="1"
                      value={
                        formData.bedrooms
                      }
                      onChange={
                        handleChange
                      }
                      className="form-control"
                      placeholder="Example: 3"
                    />

                    <div className="form-text">
                      Allowed range:
                      {" "}
                      2 - 4 bedrooms.
                    </div>

                  </div>


                  {/* ========================= */}
                  {/* Bathrooms */}
                  {/* ========================= */}

                  <div className="col-12 col-md-6">

                    <label
                      htmlFor="bathrooms"
                      className="form-label fw-medium"
                    >
                      Bathrooms
                    </label>

                    <input
                      id="bathrooms"
                      name="bathrooms"
                      type="number"
                      min="1"
                      max="3"
                      step="0.5"
                      value={
                        formData.bathrooms
                      }
                      onChange={
                        handleChange
                      }
                      className="form-control"
                      placeholder="Example: 2"
                    />

                    <div className="form-text">
                      Allowed range:
                      {" "}
                      1 - 3 bathrooms.
                    </div>

                  </div>


                  {/* ========================= */}
                  {/* Year Built */}
                  {/* ========================= */}

                  <div className="col-12 col-md-6">

                    <label
                      htmlFor="year_built"
                      className="form-label fw-medium"
                    >
                      Year Built
                    </label>

                    <input
                      id="year_built"
                      name="year_built"
                      type="number"
                      min="1978"
                      max="2012"
                      step="1"
                      value={
                        formData.year_built
                      }
                      onChange={
                        handleChange
                      }
                      className="form-control"
                      placeholder="Example: 1997"
                    />

                    <div className="form-text">
                      Allowed range:
                      {" "}
                      1978 - 2012.
                    </div>

                  </div>


                  {/* ========================= */}
                  {/* Lot Size */}
                  {/* ========================= */}

                  <div className="col-12 col-md-6">

                    <label
                      htmlFor="lot_size"
                      className="form-label fw-medium"
                    >
                      Lot Size
                    </label>

                    <div className="input-group">

                      <input
                        id="lot_size"
                        name="lot_size"
                        type="number"
                        min="4400"
                        max="10500"
                        step="1"
                        value={
                          formData.lot_size
                        }
                        onChange={
                          handleChange
                        }
                        className="form-control"
                        placeholder="Example: 6800"
                      />

                      <span className="input-group-text">
                        sq ft
                      </span>

                    </div>

                    <div className="form-text">
                      Allowed range:
                      {" "}
                      4,400 - 10,500 sq ft.
                    </div>

                  </div>


                  {/* ========================= */}
                  {/* Distance to City Center */}
                  {/* ========================= */}

                  <div className="col-12 col-md-6">

                    <label
                      htmlFor="distance_to_city_center"
                      className="form-label fw-medium"
                    >
                      Distance to City Center
                    </label>

                    <div className="input-group">

                      <input
                        id="distance_to_city_center"
                        name="distance_to_city_center"
                        type="number"
                        min="2.1"
                        max="8.2"
                        step="0.1"
                        value={
                          formData.distance_to_city_center
                        }
                        onChange={
                          handleChange
                        }
                        className="form-control"
                        placeholder="Example: 4.1"
                      />

                      <span className="input-group-text">
                        miles
                      </span>

                    </div>

                    <div className="form-text">
                      Allowed range:
                      {" "}
                      2.1 - 8.2 miles.
                    </div>

                  </div>


                  {/* ========================= */}
                  {/* School Rating */}
                  {/* ========================= */}

                  <div className="col-12 col-md-6">

                    <label
                      htmlFor="school_rating"
                      className="form-label fw-medium"
                    >
                      School Rating
                    </label>

                    <div className="input-group">

                      <input
                        id="school_rating"
                        name="school_rating"
                        type="number"
                        min="6.5"
                        max="9.1"
                        step="0.1"
                        value={
                          formData.school_rating
                        }
                        onChange={
                          handleChange
                        }
                        className="form-control"
                        placeholder="Example: 7.6"
                      />

                      <span className="input-group-text">
                        / 10
                      </span>

                    </div>

                    <div className="form-text">
                      Allowed range:
                      {" "}
                      6.5 - 9.1.
                    </div>

                  </div>

                </div>


                {/* ========================= */}
                {/* Submit Button */}
                {/* ========================= */}

                <div className="d-grid mt-4">

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >

                    {loading ? (

                      <>

                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        />

                        Getting Prediction...

                      </>

                    ) : (

                      "Estimate Property Value"

                    )}

                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>


        {/* ========================= */}
        {/* Result Section */}
        {/* ========================= */}

        <div className="col-12 col-lg-5">

          <div className="card shadow-sm border-0 h-100">

            <div className="card-body p-4">

              <h2 className="h5 fw-semibold mb-1">
                Prediction Result
              </h2>

              <p className="text-muted small mb-4">
                The predicted property value will
                appear here after submitting the form.
              </p>


              {/* ========================= */}
              {/* Empty State */}
              {/* ========================= */}

              {!prediction &&
                !loading && (

                  <div className="text-center py-5">

                    <div
                      className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                      style={{
                        width:
                          "70px",
                        height:
                          "70px",
                      }}
                    >

                      <span
                        style={{
                          fontSize:
                            "30px",
                        }}
                      >
                        🏠
                      </span>

                    </div>

                    <h3 className="h6 fw-semibold">
                      No Prediction Yet
                    </h3>

                    <p className="text-muted small mb-0">
                      Fill in the property details
                      and click the estimate button.
                    </p>

                  </div>

                )}


              {/* ========================= */}
              {/* Loading State */}
              {/* ========================= */}

              {loading && (

                <div className="text-center py-5">

                  <div
                    className="spinner-border text-primary mb-3"
                    role="status"
                  >

                    <span className="visually-hidden">
                      Loading...
                    </span>

                  </div>

                  <p className="text-muted mb-0">
                    Running the machine learning
                    model...
                  </p>

                </div>

              )}


              {/* ========================= */}
              {/* Prediction Result */}
              {/* ========================= */}

              {prediction !== null &&
                !loading && (

                  <div>


                    {/* ========================= */}
                    {/* Price */}
                    {/* ========================= */}

                    <div className="bg-primary bg-opacity-10 rounded p-4 text-center mb-4">

                      <div className="text-muted small mb-2">
                        Estimated Property Value
                      </div>

                      <div className="display-6 fw-bold text-primary">
                        {formatCurrency(
                          prediction
                        )}
                      </div>

                    </div>


                    {/* ========================= */}
                    {/* Summary */}
                    {/* ========================= */}

                    <h3 className="h6 fw-semibold mb-3">
                      Property Summary
                    </h3>

                    <div className="table-responsive">

                      <table className="table table-sm align-middle">

                        <tbody>

                          <tr>

                            <td className="text-muted">
                              Square Footage
                            </td>

                            <td className="text-end fw-medium">
                              {
                                formData.square_footage
                              }{" "}
                              sq ft
                            </td>

                          </tr>


                          <tr>

                            <td className="text-muted">
                              Bedrooms
                            </td>

                            <td className="text-end fw-medium">
                              {
                                formData.bedrooms
                              }
                            </td>

                          </tr>


                          <tr>

                            <td className="text-muted">
                              Bathrooms
                            </td>

                            <td className="text-end fw-medium">
                              {
                                formData.bathrooms
                              }
                            </td>

                          </tr>


                          <tr>

                            <td className="text-muted">
                              Year Built
                            </td>

                            <td className="text-end fw-medium">
                              {
                                formData.year_built
                              }
                            </td>

                          </tr>


                          <tr>

                            <td className="text-muted">
                              Lot Size
                            </td>

                            <td className="text-end fw-medium">
                              {
                                formData.lot_size
                              }{" "}
                              sq ft
                            </td>

                          </tr>


                          <tr>

                            <td className="text-muted">
                              Distance to City
                            </td>

                            <td className="text-end fw-medium">
                              {
                                formData.distance_to_city_center
                              }{" "}
                              miles
                            </td>

                          </tr>


                          <tr>

                            <td className="text-muted">
                              School Rating
                            </td>

                            <td className="text-end fw-medium">
                              {
                                formData.school_rating
                              }{" "}
                              / 10
                            </td>

                          </tr>

                        </tbody>

                      </table>

                    </div>

                  </div>

                )}

            </div>

          </div>

        </div>

      </div>


      {/* ========================= */}
      {/* Information Card */}
      {/* ========================= */}

      <div className="card shadow-sm border-0 mt-4">

        <div className="card-body p-4">

          <h2 className="h6 fw-semibold">
            About the Prediction
          </h2>

          <p className="text-muted small mb-0 mt-2">
            This estimate is generated by the
            regression model trained on the housing
            dataset. The prediction is based on the
            property characteristics provided above
            and should be used as an estimate rather
            than a guaranteed market value.
          </p>

        </div>

      </div>

    </div>
  );
}