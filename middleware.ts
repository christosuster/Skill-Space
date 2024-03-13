import { auth } from "./auth";

const protectedRoutes = ["/enrolled", "/created", "/addCourse"];
const publicRoutes = ["/signin", "/signup", "/", "/courses", "/courses/[id]"];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  if (nextUrl.pathname.startsWith("/api")) {
    return;
  }

  for (const route of protectedRoutes) {
    if (nextUrl.pathname.startsWith(route) && !isLoggedIn) {
      return Response.redirect(new URL("/signin", nextUrl));
    }
  }

  return;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
