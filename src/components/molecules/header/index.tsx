import React from "react";
import Speaker from "./Speaker";
import SiteLogo from "./SiteLogo";
import { auth } from "@/auth";
import ProfileMenu from "./ProfileMenu";

const Header = async () => {
  const session = await auth();
  return (
    <nav className="navbar absolute top-0 w-screen h-fit z-10 justify-center bg-base-200">
      <div className="navbar-start">
        <Speaker />
      </div>
      <div className="navbar-center">
        <SiteLogo />
      </div>

      <div className="navbar-end flex justify-end gap-2">
        {session?.user && <ProfileMenu session={session} />}
      </div>
    </nav>
  );
};

export default Header;
