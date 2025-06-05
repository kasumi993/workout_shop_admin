import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import api from '@/lib/api';

// Configure the API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
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
          const response = await api.post(`${API_URL}/auth/login`, {
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
    async jwt({ token, user, account, profile }) {
      // Initial sign in
      if (account && user) {
        // For Google sign-in, verify with backend
        if (account.provider === 'google') {
          try {
            const response = await api.post(`${API_URL}/auth/google`, {
              email: profile.email,
              name: profile.name,
              image: profile.picture,
              googleId: profile.sub
            });
            
            const { user: backendUser, access_token } = response.data;
            
            if (backendUser && backendUser.isAdmin) {
              token.accessToken = access_token;
              token.isAdmin = backendUser.isAdmin;
              token.id = backendUser.id;
              token.email = backendUser.email;
              token.name = backendUser.name;
              token.image = backendUser.image;
              return token;
            } else {
              // User exists but is not admin
              return null;
            }
          } catch (error) {
            console.error('Google auth error:', error);
            return null;
          }
        } else {
          // For credentials provider
          token.accessToken = user.accessToken;
          token.isAdmin = user.isAdmin;
          token.id = user.id;
          token.email = user.email;
          token.name = user.name;
          token.image = user.image;
        }
      }
      
      // Return existing token if no new sign in
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        session.accessToken = token.accessToken;
        session.user.isAdmin = token.isAdmin;
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.image;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // For Google authentication, the verification is done in jwt callback
      if (account.provider === 'google') {
        return true; // Allow sign in, actual verification happens in jwt callback
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