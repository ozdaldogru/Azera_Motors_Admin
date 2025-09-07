import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token, // Only allow if token exists
  },
});

export const config = {
  matcher: [
    "/((?!_next|api|favicon.ico|sign-in|sign-up).*)", // Protect everything except /sign-in and /sign-up
  ],
};