import { auth } from "@/auth";

import { redirect } from "next/navigation";
import SigninForm from "./SigninForm";

export default async function Home() {
  const session = await auth();
  if (session?.user) redirect("/game");
  return (
    <main className="relative w-full">
      <SigninForm />
    </main>
  );
}
