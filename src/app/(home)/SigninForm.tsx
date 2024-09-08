"use client";
import React, { useState } from "react";
import { ArrowRight, Eye, EyeOff } from "react-feather";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { LoginUserInput, loginUserSchema } from "@/lib/user-schema";
import toast from "react-hot-toast";
import cx from "classnames";
import GoogleIcon from "@/components/icons/Google.icon";

const SigninForm = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const methods = useForm<LoginUserInput>({
    resolver: zodResolver(loginUserSchema),
  });
  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const onSubmitHandler: SubmitHandler<LoginUserInput> = async values => {
    try {
      setSubmitting(true);

      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        redirectTo: callbackUrl,
      });

      setSubmitting(false);

      if (!res?.error) {
        toast.success("successfully logged in");
        router.push(callbackUrl);
      } else {
        reset({ password: "" });
        const message = "invalid email or password";
        toast.error(message);
        setError(message);
      }
    } catch (error: any) {
      toast.error(error.message);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-base-content/30 p-8">
      <button
        aria-label="Sign up with Google"
        onClick={() => signIn("google", { callbackUrl })}
        className="btn btn-block  mb-3 bg-white text-black hover:bg-primary hover:text-white"
      >
        <GoogleIcon /> Sign in with Google
      </button>

      <div className="divider">
        <span className="opacity-75">OR</span>
      </div>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        {error && (
          <p className="bg-red-300 mb-6 rounded py-4 text-center">{error}</p>
        )}
        <div className="form-group">
          <label htmlFor="email" className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            {...register("email")}
            name="email"
            inputMode="email"
            autoComplete="username"
            autoCapitalize="none"
            placeholder="vote@vote.com"
            className="form-control input input-bordered  w-full"
          />
          {errors["email"] && (
            <span className="text-red-500 block pt-1 text-xs">
              {errors["email"]?.message as string}
            </span>
          )}
        </div>
        <div className="form-group">
          <div className="label">
            <span className="label-text">Password</span>
            <a href="/forgot-password" className="label-text-alt">
              Forgotten password?
            </a>
          </div>
          <label
            htmlFor="password"
            className="input input-bordered flex w-full items-center gap-2"
          >
            <input
              name="password"
              {...register("password")}
              type={passwordVisible ? "text" : "password"}
              autoComplete="current-password"
              className=" grow"
              value=""
            />
            <span
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="password-toggle-icon btn btn-circle btn-ghost p-2"
            >
              {passwordVisible ? <Eye /> : <EyeOff />}
            </span>
          </label>
          {errors["password"] && (
            <span className="text-red-500 block pt-1 text-xs">
              {errors["password"]?.message as string}
            </span>
          )}
        </div>
        <div className="form-group pt-4">
          <button
            type="submit"
            className={cx(
              "btn inline-flex w-full  items-center gap-2 rounded bg-primary px-7 text-sm font-medium uppercase leading-snug text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg",
              submitting && "!bg-gray-500",
            )}
            disabled={submitting}
          >
            {submitting ? (
              "loading..."
            ) : (
              <>
                Sign in
                <ArrowRight size={10} />
              </>
            )}
          </button>
        </div>
      </form>
      <div className="mt-6 text-center text-xs font-normal opacity-75">
        Don&apos;t have an account?{" "}
        <a className="link" href="/register">
          Register here
        </a>
      </div>
    </div>
  );
};

export default SigninForm;
