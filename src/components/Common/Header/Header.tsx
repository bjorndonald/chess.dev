import React from "react";
import Speaker from "./Speaker";
import Image from "next/image";
import Link from "next/link";
import SiteLogo from "./SiteLogo";

const Header = () => {
  return (
    <nav className="navbar justify-center bg-base-300">
      <div className="navbar-start">
        <Speaker />
      </div>
      <div className="navbar-center">
        <SiteLogo />
      </div>

      <div className="navbar-end flex justify-end gap-2">
        <Link className="btn btn-ghost px-1" href={"https://6lackbjorn.dev"}>
          <div className="flex flex-row items-center justify-center gap-2 text-xs">
            <div className="h-8 w-8 overflow-hidden rounded-full">
              <Image
                className="pointer-events-none h-full w-full object-cover object-center"
                width={"48"}
                height={"28"}
                src={
                  "https://res.cloudinary.com/b-bassey/image/upload/v1715690176/brand/bjorn_donald_dp.jpg"
                }
                alt="Bjorn-Donald Bassey"
              />
            </div>
            <div className="flex flex-col text-left font-queen text-lg leading-3">
              <span>By</span>
              <span className="mt-1 bg-gradient-to-br from-blue-300 to-blue-600 bg-clip-text font-extrabold text-transparent underline">
                Bjorn
              </span>
            </div>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Header;
