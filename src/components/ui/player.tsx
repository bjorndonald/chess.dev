"use client";
import React, { useState } from "react";
import { User } from "react-feather";
import { useRouter } from "next/navigation";
import Modal from "../atoms/modal";

const PlayerModal = ({ id }: { id: string }) => {
  const navigate = useRouter();
  const [playerCode, setPlayerCode] = useState("");
  return (
    <Modal show onClose={() => navigate.push(`/game/${id}`)}>
      <div className="flex items-center justify-center">
        <p className="text-xl font-bold">Input your player code</p>
      </div>

      <form
        onSubmit={e => {
          e.preventDefault();
          navigate.replace(`/game/${id}?player=${playerCode}`);
          navigate.refresh();
        }}
        className="my-4"
      >
        <p className="text-sm">
          This will be the code designated to you as a player for this
          particular game
        </p>
        <div className="border-gray-200 my-4 flex items-center justify-between gap-2 rounded-box border px-2 py-2">
          <User />

          <input
            required
            minLength={6}
            className="w-full overflow-x-hidden text-ellipsis whitespace-nowrap bg-transparent outline-none"
            type="text"
            placeholder="Code"
            value={playerCode}
            onChange={e => setPlayerCode(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary btn-sm">
          Submit
        </button>
      </form>
    </Modal>
  );
};

export default PlayerModal;
