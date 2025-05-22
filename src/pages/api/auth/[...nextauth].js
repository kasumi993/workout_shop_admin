import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

// Configure the API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL;


export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // Make a call to the NestJS backend for authentication
          const response = await axios.post(`${API_URL}/auth/login`, {
            email: credentials.email,
            password: credentials.password
          });
          
          const { user, access_token } = response.data;
          
          if (user && access_token) {
            // Return the user with token for session
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
              isAdmin: user.isAdmin,
              accessToken: access_token
            };
          }
          
          return null;
        } catch (error) {
          console.error('Auth Error:', error.response?.data || error.message);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.accessToken = user.accessToken;
        token.isAdmin = user.isAdmin;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken;
      session.user.isAdmin = token.isAdmin;
      session.user.id = token.id;
      return session;
    },
    async signIn({ user, account, profile }) {
      // For Google authentication, verify if user is an admin
      if (account.provider === 'google') {
        return user.isAdmin;
      }
      
      // For credentials, the authorization logic is already handled
      return true;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
};

export default NextAuth(authOptions);

// Helper function to be used in API routes to verify admin status
export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);
  console.log('Session:', session);
  
  if (!session?.user?.isAdmin) {
    res.status(401).json({ message: 'Unauthorized - Admin access required' });
    return false;
  }
  
  return true;
}