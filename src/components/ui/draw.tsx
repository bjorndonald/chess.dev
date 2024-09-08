import { Chess } from "chess.js";
import React from "react";
import Modal from "../atoms/modal";

const DrawModal = ({ pgnString }: { pgnString: string }) => {
  const chess = new Chess();
  chess.loadPgn(pgnString);
  return (
    <Modal show onClose={() => {}}>
      <div className="flex items-center justify-center">
        <p className="text-xl font-bold">It's a draw</p>
      </div>

      <div className="my-4">
        <h1 className="text-2xl">Game has been drawn</h1>
      </div>
    </Modal>
  );
};

export default DrawModal;
