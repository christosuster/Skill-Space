"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { auth } from "@/auth";
import { signIn, signOut } from "next-auth/react";
import { LogOut, MenuIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getSession, useSession } from "next-auth/react";
import { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  console.log(session?.user);

  const links = [
    { href: "/courses", text: "Courses" },
    { href: "/myCourses", text: "My Courses" },
    { href: "/addCourse", text: "Add Course" },
  ];
  return (
    <nav className="flex justify-between items-center p-4">
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
                  className="hover:font-bold text-2xl"
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
          <Link key={link.href} href={link.href} className="hover:font-bold">
            {link.text}
          </Link>
        ))}
      </div>

      <div className="flex gap-4">
        {session && session.user ? (
          <div className="flex gap-4 items-center">
            <p className="font-bold">Hello, {session.user.name}</p>

            {/* <Button onClick={async () => await signOut()}>Sign Out</Button> */}
            <Button variant={"ghost"} onClick={() => signOut()}>
              <LogOut />
            </Button>
          </div>
        ) : (
          <div className="flex gap-4">
            {/* <Button onClick={async () => await signIn()}>Sign In</Button> */}
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
