import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise, { dbName } from "@/lib/db"

const adminEmails = ['khadijag993@gmail.com'];

const authOptions = {
  adapter: MongoDBAdapter(clientPromise, { databaseName: dbName }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log('signIn', { user, account, profile, email, credentials });
      const isAllowedToSignIn = adminEmails.includes(user.email);
      if (isAllowedToSignIn) {
        return true
      } else {
        return false
      }
    },
  }
}

export default NextAuth(authOptions)


export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!adminEmails.includes(session?.user?.email)) {
    res.status(401);
    res.end();
    throw 'not an admin';
  }
}
