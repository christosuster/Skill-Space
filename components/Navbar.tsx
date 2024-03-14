"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { LogOut, MenuIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  const links: { href: string; text: string }[] = useMemo(() => {
    if (session && session.user) {
      return [
        { href: "/courses", text: "All Courses" },
        { href: "/enrolled", text: "Enrolled" },
        { href: "/created", text: "Created" },
        { href: "/addCourse", text: "Add Course" },
      ];
    } else {
      return [{ href: "/courses", text: "All Courses" }];
    }
  }, [session]);

  const pathname = usePathname();

  return (
    <nav className="flex justify-between items-center mb-5">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]" side={"left"}>
          <SheetHeader className="flex flex-col  h-full">
            <SheetTitle className=" pb-10  text-center">
              <Link
                href="/"
                onClick={() => {
                  setOpen(false);
                }}
                className="text-5xl font-bold "
              >
                Skill Space
              </Link>
            </SheetTitle>

            <div className="pt-10 flex flex-col justify-center items-center gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-2xl hover:underline underline-offset-2  ${
                    pathname.startsWith(link.href)
                      ? "text-accent-foreground font-bold"
                      : ""
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.text}
                </Link>
              ))}
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <div className="flex gap-2 items-center">
        <Button
          variant={"ghost"}
          className="block md:hidden"
          onClick={() => setOpen(!open)}
        >
          <MenuIcon size={24} />
        </Button>
        <Link href="/" className="text-2xl font-bold">
          Skill Space
        </Link>
      </div>
      <div className="gap-4 hidden md:flex">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`hover:underline underline-offset-2  ${
              pathname.startsWith(link.href)
                ? "text-accent-foreground font-bold"
                : ""
            }`}
          >
            {link.text}
          </Link>
        ))}
      </div>

      <div className="flex gap-4">
        {session && session.user ? (
          <div className="flex gap-4 items-center">
            <p className="font-bold">Hello, {session.user.name}</p>

            <Button variant={"ghost"} onClick={() => signOut()}>
              <LogOut />
            </Button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Button>
              <Link href="/signin">Sign In</Link>
            </Button>
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
