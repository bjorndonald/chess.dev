import Chess from "@/components/molecules/chess";
const GameType = {
  Local: "Local",
  Computer: "Computer",
};
export default function Home() {
  return (
    <main className="relative w-full">
      <Chess
        initialGame={{
          pgnstring: "",
          undohistory: "[]",
          type: GameType.Local,
          id: "",
          created_at: new Date().toString(),
          updated_at: new Date().toString(),
        }}
      />
    </main>
  );
}
