import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import connectDB from "../../../../../config/connectDB";
import userModel from "../../../../../models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();

        const user = await userModel.findOne({
          email: credentials.email.toLowerCase(),
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage || null,
          bio: user.bio || null,
          title: user.title || null,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") return true;

      try {
        await connectDB();

        const email = user.email.toLowerCase();

        let dbUser = await userModel.findOne({ email });

        if (!dbUser) {
          dbUser = await userModel.create({
            name: user.name,
            email,
            profileImage: user.image,
            role: "none",
          });
        }

        user.id = dbUser._id.toString();
        user.role = dbUser.role;
        user.profileImage = dbUser.profileImage;
        user.bio = dbUser.bio || null;
        user.title = dbUser.title || null;

        return true;
      } catch (err) {
        console.error("Google sign-in error:", err);
        return false;
      }

    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.profileImage = user.profileImage || null;
        token.bio = user.bio || null;
        token.title = user.title || null;
      }


      if (trigger === "update" && session?.user) {
        token.name = session.user.name;
        token.profileImage = session.user.profileImage;
        token.bio = session.user.bio;
        token.title = session.user.title;
      }

      return token;
    }
    ,

    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        role: token.role,
        profileImage: token.profileImage,
        bio: token.bio,
        title: token.title,
      };
      return session;
    },

  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
