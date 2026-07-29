const ESTIMATOR_API_URL =
  process.env.NEXT_PUBLIC_ESTIMATOR_API_URL ||
  "http://localhost:8001";


const MARKET_API_URL =
  process.env.NEXT_PUBLIC_MARKET_API_URL ||
  "http://localhost:8002";


export async function predictProperty(
  property: Record<string, unknown>
) {

  const response = await fetch(
    `${ESTIMATOR_API_URL}/predict`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(property),
    }
  );


  if (!response.ok) {

    throw new Error(
      "Failed to generate prediction."
    );

  }


  return response.json();
}


export async function getMarketSummary(
  filters?: {
    minBedrooms?: number;
    maxBedrooms?: number;
    minPrice?: number;
    maxPrice?: number;
  }
) {

  const params =
    new URLSearchParams();


  if (
    filters?.minBedrooms !== undefined
  ) {

    params.set(
      "min_bedrooms",
      filters.minBedrooms.toString()
    );

  }


  if (
    filters?.maxBedrooms !== undefined
  ) {

    params.set(
      "max_bedrooms",
      filters.maxBedrooms.toString()
    );

  }


  if (
    filters?.minPrice !== undefined
  ) {

    params.set(
      "min_price",
      filters.minPrice.toString()
    );

  }


  if (
    filters?.maxPrice !== undefined
  ) {

    params.set(
      "max_price",
      filters.maxPrice.toString()
    );

  }


  const response = await fetch(
    `${MARKET_API_URL}/api/market/summary?${params.toString()}`,
    {
      cache: "no-store",
    }
  );


  if (!response.ok) {

    throw new Error(
      "Failed to load market summary."
    );

  }


  return response.json();
}


export async function getMarketProperties() {

  const response = await fetch(
    `${MARKET_API_URL}/api/market/properties`,
    {
      cache: "no-store",
    }
  );


  if (!response.ok) {

    throw new Error(
      "Failed to load market properties."
    );

  }


  return response.json();
}