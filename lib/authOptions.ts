// authOptions.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "@/lib/mongoDB";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectToDB();
        const user = await User.findOne({ username: credentials?.username });
        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials!.password,
          user.password
        );
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          name: user.username,
          email: user.email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt", // Enable JWT sessions
    maxAge: 60 * 60, // 1 hour in seconds
    updateAge: 60 * 5, // Optional: update session every 5 minutes
  },
  jwt: {
    secret: process.env.JWT_SECRET, // Use your JWT_SECRET from .env
    maxAge: 60 * 60, // 1 hour in seconds
  },
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async jwt({ token, user }) {
      // Optionally add custom fields to the token
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Optionally add custom fields to the session
      if (token) {
        if (!session.user) {
          session.user = {} as any;
        }
        // Ensure session.user is defined before assigning properties
        (session.user as any).id = token.id;
        (session.user as any).email = token.email;
      }
      return session;
    },
  },
};