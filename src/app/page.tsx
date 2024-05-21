import Chess from "@/components/Chess";
import { ChessPiece } from "@/components/Shared/Piece";

export default function Home() {
  return (
    <main className="relative">
      <div className="container mx-auto flex max-w-xl flex-col items-center">
        <div className="my-8">
          <h1 className="my-8 text-center font-pistilli text-4xl font-bold md:text-5xl">
            Bored? Have a quick <br />
            Game of{" "}
            <span className="bg-gradient-to-br from-blue-300 to-blue-500 bg-clip-text text-transparent">
              Chess
            </span>
          </h1>
        </div>
        <Chess />
        <div className="mx-4 my-12 md:mx-0">
          <h2 className="mb-8 font-queen text-2xl">How to play?</h2>
          <div className="space-y-4 font-queen">
            <p>
              Here&apos;s a lightweight chess game to make your day a bit more
              fun
            </p>
            <p>
              On page load, you can click on the <ChessPiece /> and start
              playing for a local game of chess.
            </p>
            <div className="leading-none">
              <strong>The Chess Game</strong> is pretty easy to figure from
              there. For games against computer and other players, select from
              the options below the board and click start. <br />
              And also be sure to{" "}
              <span className="bg-gradient-to-br from-blue-300 to-blue-600 bg-clip-text text-transparent">
                have fun{" "}
              </span>
            </div>
            <p className="">
              If you have any feedback, please reach out on{" "}
              <a
                className="link hover:link-accent"
                href="https://twitter.com/6lackbjorn"
                target="_blank"
                rel="noreferrer"
              >
                Twitter
              </a>
              .
            </p>
            <p className="opacity-60">—Bjorn </p>
          </div>
        </div>
      </div>
    </main>
  );
}
