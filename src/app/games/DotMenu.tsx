"use client";
import { deleteGame } from "@/actions/game";
import { closeMenu } from "@/utils/func";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { MoreVertical } from "react-feather";

const DotMenu = ({ id }: { id: string }) => {
  const router = useRouter();
  return (
    <form className="dropdown max-mobile-lg:dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-circle btn-ghost btn-xs text-info"
      >
        <MoreVertical height={16} />
      </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content z-[1]  w-28 rounded border border-[rgb(218,220,224)] bg-black/65 p-2 text-base-content shadow"
      >
        <li>
          <Link href={`/game/${id}`}>Open</Link>
        </li>
        <li>
          <a
            className="w-full cursor-pointer"
            onClick={() => {
              deleteGame(id);
              router.refresh();
              closeMenu();
            }}
          >
            Delete
          </a>
        </li>
      </ul>
    </form>
  );
};

export default DotMenu;
