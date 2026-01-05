"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCounterStore } from "@/store/counter.store";
import { ApiTest } from "@/components/api-test";

export default function Home() {
  const { count, increment, decrement } = useCounterStore();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="p-8">
        <h1 className="text-4xl font-bold mb-8">Meu Boilerplate</h1>

        <div className="flex flex-col items-center gap-4">
          <p className="text-2xl">Contador: {count}</p>

          <div className="flex gap-4">
            <Button onClick={decrement}>-</Button>
            <Button onClick={increment}>+</Button>
          </div>
        </div>

        <p className="mt-8 text-sm text-gray-500">Frontend rodando com Next.js + Zustand + shadcn/ui</p>
        <ApiTest />
      </Card>
    </main>
  );
}
