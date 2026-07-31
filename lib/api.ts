const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function predictProperty(data: unknown) {
  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Prediction request failed");
  }

  return response.json();
}

export async function getModelInfo() {
  const response = await fetch(`${API_URL}/model-info`);

  if (!response.ok) {
    throw new Error("Failed to fetch model information");
  }

  return response.json();
}

export async function getHealth() {
  const response = await fetch(`${API_URL}/health`);

  if (!response.ok) {
    throw new Error("API health check failed");
  }

  return response.json();
}