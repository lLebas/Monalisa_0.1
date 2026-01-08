"use client";

import AuthButtons from "@/components/AuthButtons";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const dynamic = 'force-dynamic';
export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verifica se há erro na URL
    const errorParam = searchParams.get("error");
    if (errorParam) {
      if (errorParam === "AccessDenied") {
        setError("Acesso negado: apenas emails @assessorialpha.com podem fazer login.");
      } else if (errorParam === "Configuration") {
        setError("Erro de configuração. Entre em contato com o administrador.");
      } else {
        setError("Erro ao fazer login. Tente novamente.");
      }
    }

    // Se o usuário está autenticado, redireciona para dashboard
    if (status === "authenticated" && session) {
      const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
      // Limpa o parâmetro de erro antes de redirecionar
      const cleanUrl = callbackUrl.split("?")[0];
      router.push(cleanUrl);
    }
  }, [status, session, router, searchParams]);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black relative overflow-hidden">
      <div className="absolute inset-0 z-0" style={{
        background: 'radial-gradient(circle at 50% 35%, rgba(255, 200, 0, 0.18) 0%, rgba(0,0,0,0.95) 70%)'
      }} />
      <div className="relative z-10 flex flex-col items-center w-full max-w-md">
        <Image
          src="https://izmzxqzcsnaykofpcjjh.supabase.co/storage/v1/object/public/alpha//Logomarca%20da%20Alpha.png"
          alt="Assessoria Alpha"
          className="w-40 sm:w-48 md:w-56 h-auto mb-8 drop-shadow-[0_2px_16px_rgba(255,200,0,0.4)]"
          width={500}
          height={500}
          sizes="(max-width: 640px) 10rem, (max-width: 768px) 12rem, 14rem"
          quality={100}
          priority
        />
        <p className="text-gray-300 text-center mb-8 text-base md:text-lg">
          Faça login com sua conta Google da Assessoria Alpha para continuar.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        <AuthButtons />
        <div className="w-full text-center text-gray-500 text-xs mt-8">
          Copyright © 2026 Assessoria Alpha
        </div>
      </div>
    </div>
  );
}
