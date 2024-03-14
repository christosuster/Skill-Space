"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// import {signIn} from "next-auth/react"
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import { signIn } from "@/auth";
import { signInWithCredentials } from "@/lib/actions";
import { loginSchema } from "@/lib/schema";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const LoginPage = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setError("");
    setLoading(true);
    signInWithCredentials(values)
      .then((res) => {
        console.log("res", res);

        if (res.error) {
          setError(res.error);
          setLoading(false);
        }
      })
      .catch((err) => {
        // setError("An error occurred");
        console.error(err);
      });
  }
  return (
    <div className="w-full max-w-xl mx-auto p-4 h-full">
      <h1 className="text-3xl text-center">Sign In</h1>
      <h1 className="text-center my-2 mb-10">
        Enter your username and password to sign in
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="******" {...field} type="password" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          {error && <p className="text-red-500 text-center">{error}</p>}

          {loading ? (
            <Button>
              <Loader2 className="animate-spin mr-2" />
              Submitting
            </Button>
          ) : (
            <Button type="submit">Submit</Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default LoginPage;
