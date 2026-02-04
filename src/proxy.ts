import { auth } from "./auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnDashboard = req.nextUrl.pathname.startsWith("/");
  const isLoginPage = req.nextUrl.pathname.startsWith("/login");

  if (isOnDashboard && !isLoginPage && !isLoggedIn) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }

  if (isLoginPage && isLoggedIn) {
    return Response.redirect(new URL("/", req.nextUrl));
  }

  return null;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
