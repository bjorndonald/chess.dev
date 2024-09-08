import { getGameById } from "@/actions/game";
import ChessGame from "@/components/molecules/chess";

interface Props {
  params: { id: string };
}

export default async function Game({ params: { id } }: Props) {
  const game = await getGameById(id);

  return (
    <main className="relative w-full">
      <ChessGame initialGame={game} />
    </main>
  );
}
