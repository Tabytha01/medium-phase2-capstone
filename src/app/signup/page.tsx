"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupInput } from "@/lib/validations/auth";
import axios from "axios";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupInput) => {
    setIsLoading(true);
    setError("");

    try {
      await axios.post("/api/auth/signup", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      router.push("/login?signup=success");
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Register</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block mb-2 font-medium">
            Name
          </label>
          <input
            {...register("name")}
            type="text"
            id="name"
            className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-[#4A7FA7] dark:bg-gray-800 dark:border-gray-700"
            placeholder="Your Name"
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block mb-2 font-medium">
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            id="email"
            className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring- xxxxcvb dark:bg-gray-800 dark:border-gray-700"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block mb-2 font-medium">
            Password
          </label>
          <input
            {...register("password")}
            type="password"
            id="password"
            className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-[#4A7FA7] dark:bg-gray-800 dark:border-gray-700"
            placeholder=""
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block mb-2 font-medium">
            Confirm Password
          </label>
          <input
            {...register("confirmPassword")}
            type="password"
            id="confirmPassword"
            className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-[#4A7FA7] dark:bg-gray-800 dark:border-gray-700"
            placeholder=""
          />
          {errors.confirmPassword && (
            <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#4A7FA7] dark:bg-white text-white dark:text-[#4A7FA7] py-3 rounded-full font-medium hover:opacity-80 disabled:opacity-50"
        >
          {isLoading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
        Already have an account?{" "}
        <Link href="/login" className="text-[#4A7FA7] dark:text-white font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
