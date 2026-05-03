import NextAuth from "next-auth";
import { getLocale } from "next-intlayer/server";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt-ts-edge";
import { cookies } from "next/headers";

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
        if (trigger === "signIn" || trigger === "signUp") {
          const cookieObject = await cookies();
          const sessionCartId = cookieObject.get("sessionCartId")?.value;

          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: { sessionCartId: sessionCartId },
            });
            if (sessionCart) {
              // update the cart based on the latest sessionCart
              await prisma.cart.update({
                where: { id: sessionCart.id },
                data: { userId: user.id },
              });
              // find the old carts to delete and keep only the cart with the latest session
              const oldCarts = await prisma.cart.findMany({
                where: { userId: user.id },
              });
              const cartsToDelete = oldCarts.filter(
                (item) => item.id !== sessionCart.id,
              );
              //Extract just the IDs into an array
              const idsToDelete = cartsToDelete.map((item) => item.id);

              // 3. Pass that array to prisma
              await prisma.cart.deleteMany({
                where: {
                  id: { in: idsToDelete },
                },
              });
              console.log(`Deleted ${idsToDelete.length} old carts.`);
            }
          }
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
      //console.log(token);
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string; // This ensures the new name shows up
        //console.log(token);
      }
      return session;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async authorized({ request, auth }: any) {
      // Logged in users are authenticated, otherwise redirect to login page
      const protectedPaths = [
        /^\/(en|ar)\/shipping-address/,
        /^\/(en|ar)\/payment-method/,
        /^\/(en|ar)\/place-order/,
        /^\/(en|ar)\/profile/,
        /^\/(en|ar)\/user\/(.*)/,
        /^\/(en|ar)\/order\/(.*)/,
        /^\/(en|ar)\/admin/,
      ];

      const { pathname } = request.nextUrl;

      const isProtected = protectedPaths.some((p) => p.test(pathname));

      if (!auth && isProtected) {
        const locale = pathname.split("/")[1] || "en";

        return Response.redirect(
          new URL(`/${locale}/sign-in`, request.nextUrl),
        );
      }

      return true;
    },
  },
});
