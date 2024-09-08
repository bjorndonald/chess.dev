import { Session } from "next-auth";
import { signOut } from "@/auth";
import Image from "next/image";
import React from "react";
import Link from "next/link";

interface Props {
  session: Session;
}

const ProfileMenu = ({ session }: Props) => {
  return (
    <form
      action={async () => {
        "use server";

        await signOut();
      }}
      className="dropdown dropdown-end"
    >
      <div
        tabIndex={0}
        role="button"
        className=" btn-ghost overflow-hidden rounded-md p-1"
      >
        <div className="flex flex-row items-center justify-center gap-2 text-xs">
          <Image
            className="pointer-events-none h-8 w-8 rounded-full object-cover object-center"
            width={"48"}
            height={"28"}
            src={session.user.image}
            alt="Bjorn-Donald Bassey"
          />
          <div className="flex flex-col text-left font-queen text-lg leading-3">
            {/* <span>By</span> */}
            <span className="mt-1 bg-gradient-to-br from-blue-300 to-blue-600 bg-clip-text font-extrabold text-transparent underline">
              {session.user.name.split(" ")[0]}
            </span>
          </div>
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content z-[1] mt-3 w-52 rounded-box border bg-base-200/85 p-2 shadow"
      >
        <li>
          <Link className="w-full cursor-pointer" href={"/games"}>
            Games
          </Link>
        </li>
        <li>
          <button type="submit" className="w-full cursor-pointer">
            Log out
          </button>
        </li>
      </ul>
    </form>
  );
};

export default ProfileMenu;
