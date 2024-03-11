import Link from "next/link";
import { Button } from "./ui/button";
import { auth, signIn, signOut } from "@/auth";

const Navbar = async () => {
  const session = await auth();
  const links = [
    { href: "/courses", text: "Courses" },
    { href: "/myCourses", text: "My Courses" },
    { href: "/addCourse", text: "Add Course" },
  ];
  return (
    <nav className="flex justify-between items-center p-4">
      <Link href="/" className="text-2xl font-bold">
        Skill Space
      </Link>
      <div className="flex gap-4">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="hover:font-bold">
            {link.text}
          </Link>
        ))}
      </div>
      <div className="flex gap-4">
        {/* <Button>
          <Link href="/login">Login</Link>
        </Button>
        <Button>
          <Link href="/signup">Sign Up</Link>
        </Button> */}

        {session && session.user ? (
          <div className="flex gap-4">
            <p className="font-bold">{session.user.name}</p>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <Button>Sign Out</Button>
            </form>
          </div>
        ) : (
          <div className="flex gap-4">
            <form
              action={async () => {
                "use server";
                await signIn();
              }}
            >
              <Button>Sign In</Button>
            </form>
            <Button>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
