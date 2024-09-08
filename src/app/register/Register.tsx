"use client";
import React from "react";
import { Linkedin, Mail } from "react-feather";
import { signIn } from "next-auth/react";
import RegisterForm from "./RegisterForm";
import GoogleIcon from "@/components/icons/Google.icon";

const Register = () => {
  return (
    <main className="w-full">
      <div className="mx-auto w-full rounded-lg border border-base-300">
        <div className="flex w-full flex-col gap-4 p-4">
          <button
            aria-label="Sign up with Google"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="btn btn-block bg-white text-black hover:bg-primary hover:text-white "
          >
            <GoogleIcon /> Sign up with Google
          </button>

          <div className="divider py-4">
            <span className="opacity-74">OR</span>
          </div>
          <div className="relative">
            <input
              type="checkbox"
              name="isEmail"
              id="isEmail"
              className="peer absolute left-0 top-0 z-10 h-full w-full opacity-0"
            />
            <button
              className="btn btn-primary btn-block peer-checked:hidden"
              aria-label="Sign up with email"
            >
              <Mail />
              Sign up with email
            </button>
            <div className="relative hidden peer-checked:z-30 peer-checked:block">
              <RegisterForm />
            </div>
          </div>
          <div className="mt-3 text-center text-xs opacity-75">
            By signing up, you agree to our{" "}
            <a className="link" href="/tos">
              TOS
            </a>{" "}
            &{" "}
            <a className="link" href="/privacy-policy">
              Privacy Policy
            </a>{" "}
          </div>
        </div>
      </div>
      <div className="mt-6 text-center text-xs font-normal opacity-75">
        Already have an account?{" "}
        <a className="link" href="/">
          Log in
        </a>
      </div>
    </main>
  );
};

export default Register;
