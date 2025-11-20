import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "teacher",
      name: "Teacher Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password harus diisi");
        }

        // Auto-create teacher in development (optional)
        let teacher = await prisma.teacher.findUnique({
          where: { email: credentials.email },
        });

        if (!teacher && process.env.NODE_ENV === "development") {
          const hashedPassword = await bcrypt.hash(credentials.password, 10);
          teacher = await prisma.teacher.create({
            data: {
              email: credentials.email,
              password: hashedPassword,
              name: credentials.email.split("@")[0],
              subject: "General",
              role: "teacher",
            },
          });
        }

        if (!teacher) {
          throw new Error("Email atau password salah");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          teacher.password
        );
        if (!isValid) {
          throw new Error("Email atau password salah");
        }

        return {
          id: teacher.id.toString(),
          email: teacher.email,
          name: teacher.name,
          role: "teacher",
        };
      },
    }),
    CredentialsProvider({
      id: "admin",
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username dan password harus diisi");
        }

        const admin = await prisma.admin.findUnique({
          where: { username: credentials.username },
        });

        if (!admin) {
          throw new Error("Username atau password salah");
        }

        // CEK jika password belum hash
        if (!admin.password.startsWith("$2")) {
          console.error("❌ PASSWORD ADMIN BELUM DI-HASH!");
          throw new Error("Password admin belum dienkripsi bcrypt");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          admin.password
        );

        if (!isValid) {
          throw new Error("Username atau password salah");
        }

        return {
          id: admin.id.toString(),
          name: admin.name,
          username: admin.username,
          role: "admin",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        // Simpan username hanya untuk admin
        if ((user as any).username) {
          token.username = (user as any).username;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        // Tambahkan username ke session jika ada (untuk admin)
        if (token.username) {
          (session.user as any).username = token.username;
        }
        // Untuk guru, `email` tetap ada
        if (token.email) {
          session.user.email = token.email as string;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
