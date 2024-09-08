"use client";
import Link from "next/link";

const ErrorComponent = () => {
  return (
    <div
      id="error"
      className="flex min-h-screen flex-col items-center justify-center gap-5 py-[65px]"
    >
      <h1 className={"text-red-500 mb-3 text-3xl"}>Something went wrong</h1>
      <p>
        <span className="font-medium">Whoops!</span> Unfortunately an unexpected
        error occured.
      </p>
      <p className="-mt-2 text-center">
        Please{" "}
        <Link
          title="Create issue on Github"
          href={"https://twitter.com/elackbjorn"}
        >
          share the details
        </Link>{" "}
        of this issue, so I can fix it for you.
      </p>
      <Link href={"/"} title="Home page" className="mx-auto mt-3">
        Go back home
      </Link>

      <img
        src={"/site/error.gif"}
        alt={"Error Stickers https://tenor.com/view/error-gif-27338366"}
        loading={"lazy"}
        decoding={"async"}
        className={"mt-3"}
        style={{ maxWidth: 425 }}
      />
    </div>
  );
};

export default ErrorComponent;
