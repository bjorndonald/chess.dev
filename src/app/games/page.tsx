import { getGames } from "@/actions/game";
import { auth } from "@/auth";
import { closeMenu } from "@/utils/func";
import Link from "next/link";
import React from "react";
import GameComponent from "./Game";

interface Props {
  searchParams: { [key: string]: string | undefined };
}

const GamesPage = async ({ searchParams }: Props) => {
  const filter = searchParams["filter"];
  const sortBy = searchParams["sort"];
  const session = await auth();
  const games = await getGames(session.user.email, sortBy, filter);
  console.log(games);
  return (
    <main className="relative w-full">
      <div className="max-w-desktop mx-auto px-4">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">
            {sortBy ?? ""} {filter ?? ""} Games
          </h1>
          <div className="flex gap-4">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-outline m-1 h-9 min-h-9 rounded border-base-300 font-normal text-primary hover:bg-primary/10 hover:text-primary"
              >
                {sortBy ?? "Sort By"}
              </div>
              <ul
                tabIndex={0}
                className="menu dropdown-content  z-[1] w-52 rounded border border-base-300 bg-base-100 p-2 shadow"
              >
                <li>
                  <Link
                    title="Recent"
                    href={`/games?filter=${filter ?? ""}&sort=recent`}
                  >
                    Recent
                  </Link>
                </li>

                <li>
                  <Link
                    title="Moves"
                    href={`/games?filter=${filter ?? ""}&sort=moves`}
                  >
                    Moves played
                  </Link>
                </li>
              </ul>
            </div>

            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-outline m-1 h-9 min-h-9 rounded border-base-300 font-normal text-primary hover:bg-primary/10 hover:text-primary"
              >
                {filter ?? "Filter By"}
              </div>
              <ul
                tabIndex={0}
                className="menu dropdown-content  z-[1] w-52 rounded border border-base-300 bg-base-100 p-2 shadow"
              >
                <li>
                  <Link
                    title="Games won"
                    href={`/games?filter=won&sort=${sortBy ?? ""}`}
                  >
                    Won
                  </Link>
                </li>
                <li>
                  <Link
                    title="Games lost"
                    href={`/games?filter=lost&sort=${sortBy ?? ""}`}
                  >
                    Lost
                  </Link>
                </li>
                <li>
                  <Link
                    title="Games drawn"
                    href={`/games?filter=drawn&sort=${sortBy ?? ""}`}
                  >
                    Drawn
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 pt-5">
          {games.map((x, i) => (
            <GameComponent key={i} game={x} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default GamesPage;
