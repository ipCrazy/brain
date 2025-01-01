import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { username, password } = credentials || {};

        // Replace with your own validation logic
        if (username === "admin" && password === "password") {
          return { id: "1", name: "Admin", email: "admin@example.com" };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login", // Custom login page
  },
  session: {
    strategy: "jwt", // Explicitly set the correct type here
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is defined in your .env file
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
