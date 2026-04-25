import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt-ts-edge";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/sign-in", // Redirects to your custom /app/login/page.tsx
    error: "/sign-in", // Custom error page
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials == null) return null;
        // 1. SELECT THE TABLE & FIELD
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }, // Change 'email' to 'username' if needed
        });
        // 2. VERIFY
        if (!user || !user.password) return null;
        const isValid = await compare(
          credentials.password as string,
          user.password,
        );

        // return isValid ? user : null; //if we want every field of the user to be available in the session, we can return the whole user object, otherwise we can return a custom object with only the fields we want to be available in the session
        return isValid
          ? {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            }
          : null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 1. Initial Login: Put the ID into the token
      if (user) {
        token.id = user.id;
        token.role = user.role; // created folder called next-auth.d.ts in the root of the project and added a declaration file to extend the default session and user types to include the role field, this way we can access the role field in the session object without TypeScript errors

        // if user has no name but has an email, usually from OAuth providers, we can set the name to the email before the @ symbol
        if ((!user.name || user.name === "NO NAME") && user.email) {
          const generatedName = user.email.split("@")[0];
          token.name = generatedName;
          // Sync the database so it's not "NO NAME" next time
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        } else {
          token.name = user.name;
        }
      }

      // 2. THE MISSING PART: Update the token when the name changes
      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }

      return token;
    },
    async session({ session, token }) {
      // 3. Keep the UI in sync with the token
      console.log(token);
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string; 
        session.user.name = token.name as string; // This ensures the new name shows up
        console.log(token);
      }
      return session;
    },
  },
});
