import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  providers: [
    // 1. Login Social (Google) - Igual ao original
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // 2. Login Credenciais (Conectado ao seu NestJS)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // AQUI ESTÁ A MUDANÇA: Batendo no seu NestJS
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
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 24 * 60 * 60, // 24 horas
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        // Se o NestJS mandar role, adicione aqui: token.role = user.role
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  }
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);