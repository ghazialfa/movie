
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";
import { initGoogleButton, loginGoogleWithToken } from "@/lib/google";
import type { LoginResponse } from "@/types/user";
import type { AxiosError } from "axios";
import { useAuthStore } from "@/store/auth";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [dataInput, setDataInput] = useState({
    emailOrUsername: "",
    password: "",
  });

  useEffect(() => {
    initGoogleButton({
      clientId: "793591115286-vhlm035ql80pai5q5dhuh8v450jnc6cu.apps.googleusercontent.com",
      buttonId: "googleLoginButton",
      callback: async ({ credential }) => {
        try {
          const data = await loginGoogleWithToken(credential);
          localStorage.setItem("token", data.access_token);
          localStorage.setItem("userId", String(data.user.id));
          document.cookie = `token=${data.access_token}; path=/`;
          document.cookie = `userId=${String(data.user.id)}; path=/`;
          setAuth(data.access_token, String(data.user.id));
          router.push("/movie");
        } catch (error: unknown) {
          const errMsg = (error as { message?: string })?.message || "Login gagal";
          alert(errMsg);
        }
      },
    });
  }, [router, setAuth]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDataInput({ ...dataInput, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await api.post<LoginResponse>("/login", dataInput);

      setDataInput({ emailOrUsername: "", password: "" });

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("userId", String(data.user.id));
      document.cookie = `token=${data.access_token}; path=/`;
      document.cookie = `userId=${String(data.user.id)}; path=/`;
      setAuth(data.access_token, String(data.user.id));
      router.push("/movie");
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      const errMsg = err.response?.data?.message || "Something went wrong";
      alert(errMsg);
    }
  };

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start max-w-6xl px-4 mx-auto py-6">
        <div className="rounded-lg overflow-hidden">
          <Image
            alt="Login Image"
            className="aspect-2/3 object-cover"
            height={600}
            src="https://image.tmdb.org/t/p/w500/z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg"
            width={400}
          />
        </div>
        <div className="mx-auto max-w-md space-y-6 py-12">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Enter your credentials to access your account.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emailOrUsername">Email</Label>
              <Input
                id="emailOrUsername"
                value={dataInput.emailOrUsername}
                onChange={handleChange}
                name="emailOrUsername"
                placeholder="Enter your email or username address"
                required
                type="text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                value={dataInput.password}
                onChange={handleChange}
                name="password"
                placeholder="Enter your password"
                required
                type="password"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button className="w-full" type="submit">
                Login
              </Button>
              <Button className="w-full" variant="outline" type="button">
                <div id="googleLoginButton"></div>
              </Button>
            </div>
            <div className="text-center text-sm">
              Don&apos;t have an account?
              <Link href="/register" className="underline">
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}