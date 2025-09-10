import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: [
    "/((?!_next|api|favicon.ico|sign-in|sign-up|forgot-password|reset-password).*)", // Exclude reset-password
  ],
};