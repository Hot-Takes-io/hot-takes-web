import { PrismaAdapter } from "@auth/prisma-adapter";

import {
  type Profile,
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";

import EmailProvider from "next-auth/providers/email";
import GitHubProvider from "next-auth/providers/github";

import { db } from "~/server/db";
import sendEmail, {
  EmailGroupID,
  EmailSender,
  EmailTemplate,
} from "./utils/sendEmail";
import { secondsToHours } from "date-fns";
import { env } from "~/env";
import Logger from "./utils/logger";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      handle?: string;
      isSuperAdmin?: boolean;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    handle?: string;
    isSuperAdmin?: boolean;
    //   // ...other properties
    //   // role: UserRole;
  }
}

interface ExtendedProfile extends Profile {
  login: string;
  bio: string;
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  theme: {
    logo: "/logos/hot-takes.png",
  },
  events: {
    signIn: async ({ user }) => {
      Logger("info", "User signed in", user);
      if (!user.email) {
        return;
      }
      await db.user.update({
        where: { email: user.email },
        data: {
          lastLogin: new Date(),
        },
      });
    },
  },
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        handle: user.handle,
        isSuperAdmin: user.isSuperAdmin,
      },
    }),
    signIn: async ({ user, account, profile }) => {
      if (!user.email) {
        return false;
      }
      if (account?.provider === "github") {
        const githubProfile = profile as ExtendedProfile;
        const dbUser = await db.user.findFirst({
          where: { email: user.email },
        });

        if (!dbUser) {
          const isHandleTaken = await db.user.findFirst({
            where: { handle: githubProfile.login },
          });

          const userData = {
            email: user.email,
            name: user.name,
            image: user.image,
            githubLogin: githubProfile.login,
            handle: !isHandleTaken ? githubProfile.login : null,
            bio: {
              type: "doc",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: "left" },
                  content: [
                    { text: `${githubProfile.bio ?? ""}`, type: "text" },
                  ],
                },
              ],
            },
          };
          await db.user.create({
            data: userData,
          });
        }
      }
      const invitation = await db.userInvitation.findUnique({
        where: { email: user.email },
      });
      if (invitation) {
        if (!invitation.accepted) {
          await db.userInvitation.update({
            where: { email: user.email },
            data: { accepted: true },
          });
        }
        return true;
      }
      return true;
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    EmailProvider({
      sendVerificationRequest: async (params) => {
        await sendEmail({
          sender: EmailSender.AUTHENTICATION,
          recipient: params.identifier,
          template: EmailTemplate.GENERAL,
          data: {
            Email_Subject: "Your Hot-Takes.io Login Email",
            Email_Preheader: "Login to Hot-Takes.io",
            Email_Title: "Login to Hot-Takes.io",
            Email_Body: `Click the button below to login to Hot-Takes.io. If you didn't request this email, you can safely ignore it. This link is valid for ${secondsToHours(
              params.provider.maxAge
            )} hours (${new Date(params.expires).toUTCString()}).
            `,
            Button_Body: "Login",
            Button_URL: params.url,
            Email_Signature: `The Hot Takes Team`,
          },
          emailGroupId: EmailGroupID.NONE,
        });
      },
    }),
    GitHubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
