import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

// Validação das variáveis de ambiente do Google
const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim()
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim()

// Verifica se as credenciais do Google estão configuradas e não são placeholders
const isGoogleConfigured = !!(
  googleClientId &&
  googleClientSecret &&
  googleClientId !== "" &&
  googleClientSecret !== "" &&
  googleClientId !== "seu_client_id_google" &&
  googleClientSecret !== "seu_client_secret_google" &&
  !googleClientId.includes("seu_") &&
  !googleClientSecret.includes("seu_")
)

// Log para debug (apenas em desenvolvimento)
if (process.env.NODE_ENV === "development") {
  if (isGoogleConfigured) {
    console.log("✅ Google OAuth configurado e pronto para uso");
  } else {
    console.warn("⚠️ Google OAuth NÃO configurado. Configure GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET no .env.local");
  }
}

export const authOptions = {
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "temporary-secret-for-development-change-in-production",
  providers: [
    // 1. Login Social (Google) - Só adiciona se as credenciais estiverem configuradas
    ...(isGoogleConfigured
      ? [
        GoogleProvider({
          clientId: googleClientId!,
          clientSecret: googleClientSecret!,
        }),
      ]
      : []),
    // 2. Login Credenciais (Conectado ao NestJS)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // AQUI ESTÁ A MUDANÇA: Batendo no NestJS para login
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" }
          });

          const user = await res.json();

          // Se o NestJS devolver o usuário, autoriza o login
          if (res.ok && user) {
            return user;
          }
          return null;
        } catch (e) {
          console.error("Erro ao conectar no NestJS:", e);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login', // Redireciona para a tela que vamos copiar abaixo
    error: '/login?error=AuthError', // Em caso de erro, volta para login com parâmetro de erro
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 24 * 60 * 60, // 24 horas
  },
  callbacks: {
    async signIn(params: any) {
      const { user, account, profile } = params;

      // Restringe login apenas para emails @assessorialpha.com
      if (account?.provider === "google") {
        // Tenta capturar o email de múltiplas fontes
        const email = user?.email || profile?.email || (profile as any)?.email_verified || user?.email_verified;

        // Log para debug (apenas em desenvolvimento)
        if (process.env.NODE_ENV === "development") {
          console.log("[NextAuth signIn] Email capturado:", email);
          console.log("[NextAuth signIn] User:", { email: user?.email, name: user?.name });
          console.log("[NextAuth signIn] Profile:", { email: profile?.email });
        }

        if (!email) {
          console.error("[NextAuth signIn] Email não encontrado no perfil do Google");
          return false; // Bloqueia se não encontrar email
        }

        if (!email.endsWith("@assessorialpha.com")) {
          console.warn(`[NextAuth signIn] Email ${email} não autorizado (deve ser @assessorialpha.com)`);
          return false; // Bloqueia o login
        }

        console.log(`[NextAuth signIn] Login autorizado para: ${email}`);
      }

      return true;
    },
    async redirect(params: any) {
      const { url, baseUrl } = params;

      // Se a URL é relativa e não é /login ou /api/auth, usa ela
      if (url.startsWith("/") && url !== "/login" && !url.startsWith("/api/auth")) {
        return `${baseUrl}${url}`;
      }

      // Se a URL é do mesmo domínio e não é /login ou /api/auth, usa ela
      try {
        const urlObj = new URL(url);
        if (urlObj.origin === baseUrl && urlObj.pathname !== "/login" && !urlObj.pathname.startsWith("/api/auth")) {
          return url;
        }
      } catch {
        // Se não conseguir fazer parse, continua
      }

      // Por padrão, redireciona para /dashboard após login bem-sucedido
      return `${baseUrl}/dashboard`;
    },
    async jwt({ token, user, account }: any) {
      // Quando o usuário faz login pela primeira vez
      if (user) {
        token.id = user.id || user.email;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        // Se o NestJS mandar role, adicione aqui: token.role = user.role
      }

      // Log para debug (apenas em desenvolvimento)
      if (process.env.NODE_ENV === "development" && user) {
        console.log("[NextAuth jwt] Token atualizado com user:", { id: token.id, email: token.email });
      }

      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = (token.id || token.email) as string;
        // Garante que email e name estejam presentes
        if (token.email && !session.user.email) {
          session.user.email = token.email as string;
        }
        if (token.name && !session.user.name) {
          session.user.name = token.name as string;
        }
        if (token.picture && !session.user.image) {
          session.user.image = token.picture as string;
        }
      }

      // Log para debug (apenas em desenvolvimento)
      if (process.env.NODE_ENV === "development") {
        console.log("[NextAuth session] Sessão criada:", { id: session.user?.id, email: session.user?.email });
      }

      return session;
    }
  }
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);