"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import api from "@/lib/api";

export function ApiTest() {
  const [data, setData] = useState<{ status?: string; backend?: string; database?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/health")
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao conectar com a API:", error);
        setLoading(false);
      });
  }, []);

  return (
    <Card className="p-4 mt-4">
      <h2 className="font-bold mb-2">Status da API:</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : data ? (
        <div>
          <p>✅ Status: {data.status}</p>
          <p>Backend: {data.backend}</p>
          <p>Database: {data.database}</p>
        </div>
      ) : (
        <p>❌ Erro ao conectar com a API</p>
      )}
    </Card>
  );
}
