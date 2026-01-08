"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import LogoutButton from "@/components/LogoutButton";

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Bem-vindo, {session.user?.name || session.user?.email}!
            </p>
          </div>
          <LogoutButton />
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-2">Visão Geral</h2>
            <p className="text-muted-foreground">
              Seu dashboard está pronto para ser personalizado.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-2">Estatísticas</h2>
            <p className="text-muted-foreground">
              Adicione seus gráficos e métricas aqui.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-2">Atividades</h2>
            <p className="text-muted-foreground">
              Monitore suas atividades recentes.
            </p>
          </Card>
        </div>

        {/* User Info Card */}
        <Card className="p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Informações da Conta</h2>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-muted-foreground">Nome:</span>
              <p className="font-medium">{session.user?.name || "Não informado"}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Email:</span>
              <p className="font-medium">{session.user?.email || "Não informado"}</p>
            </div>
            {session.user?.image && (
              <div>
                <span className="text-sm text-muted-foreground">Foto:</span>
                <img
                  src={session.user.image}
                  alt={session.user.name || "Avatar"}
                  className="w-16 h-16 rounded-full mt-2"
                />
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
