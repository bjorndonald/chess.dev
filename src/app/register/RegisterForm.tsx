"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { CreateUserInput, createUserSchema } from "@/lib/user-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { ArrowRight, Eye, EyeOff } from "react-feather";
import cx from "classnames";

const RegisterForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const methods = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const onSubmitHandler: SubmitHandler<CreateUserInput> = async values => {
    try {
      setSubmitting(true);
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();

        if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          errorData.errors.forEach((error: any) => {
            toast.error(error.message);
          });

          return;
        }

        toast.error(errorData.message);
        return;
      }

      signIn(undefined, { callbackUrl: "/" });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="form-group">
          <label htmlFor="name" className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            type="name"
            {...register("name")}
            name="name"
            autoComplete="name"
            autoCapitalize="none"
            placeholder="Your name"
            className="form-control input input-bordered w-full"
          />
          {errors["name"] && (
            <span className="text-red-500 block pt-1 text-xs">
              {errors["name"]?.message as string}
            </span>
          )}
        </div>
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
            className="form-control input input-bordered w-full"
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
        <div className="form-group">
          <div className="label">
            <span className="label-text">Confirm Password</span>
          </div>
          <label
            htmlFor="password"
            className="input input-bordered flex w-full items-center gap-2"
          >
            <input
              name="passwordConfirm"
              {...register("passwordConfirm")}
              type={passwordVisible ? "text" : "password"}
              className=" grow"
              value=""
            />
            <span
              onClick={() => setConfirmVisible(!confirmVisible)}
              className="password-toggle-icon btn btn-circle btn-ghost p-2"
            >
              {confirmVisible ? <Eye /> : <EyeOff />}
            </span>
          </label>
          {errors["passwordConfirm"] && (
            <span className="text-red-500 block pt-1 text-xs">
              {errors["passwordConfirm"]?.message as string}
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
                Sign up
                <ArrowRight />
              </>
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default RegisterForm;
