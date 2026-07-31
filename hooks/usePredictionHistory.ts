"use client";

import { useEffect, useState } from "react";

interface PropertyInput {
  square_footage: number;
  bedrooms: number;
  bathrooms: number;
  year_built: number;
  lot_size: number;
  distance_to_city_center: number;
  school_rating: number;
}

interface PredictionHistory {
  id: string;
  property: PropertyInput;
  predicted_price: number;
  created_at: string;
}

const STORAGE_KEY =
  "housing_prediction_history";

export function usePredictionHistory() {
  const [history, setHistory] =
    useState<PredictionHistory[]>([]);

  const [loaded, setLoaded] =
    useState(false);

  // Load history from localStorage

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (stored) {
        setHistory(
          JSON.parse(stored)
        );
      }
    } catch (error) {
      console.error(
        "Failed to load prediction history:",
        error
      );
    } finally {
      setLoaded(true);
    }
  }, []);

  // Save a prediction

  function addPrediction(
    property: PropertyInput,
    predicted_price: number
  ) {
    const newPrediction: PredictionHistory =
      {
        id: crypto.randomUUID(),

        property,

        predicted_price,

        created_at:
          new Date().toISOString(),
      };

    setHistory((previous) => {
      const updated = [
        newPrediction,
        ...previous,
      ];

      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updated)
        );
      } catch (error) {
        console.error(
          "Failed to save prediction history:",
          error
        );
      }

      return updated;
    });
  }

  // Delete one prediction

  function removePrediction(
    id: string
  ) {
    setHistory((previous) => {
      const updated =
        previous.filter(
          (item) =>
            item.id !== id
        );

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updated)
      );

      return updated;
    });
  }

  // Clear all history

  function clearHistory() {
    localStorage.removeItem(
      STORAGE_KEY
    );

    setHistory([]);
  }

  return {
    history,
    loaded,
    addPrediction,
    removePrediction,
    clearHistory,
  };
}