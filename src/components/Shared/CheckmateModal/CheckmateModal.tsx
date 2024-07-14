"use client";
import Modal from "@/components/Common/Modal";
import React from "react";
import { Chess } from "chess.js";

const CheckmateModal = ({ pgnString }: { pgnString: string }) => {
  const chess = new Chess();
  chess.loadPgn(pgnString);
  return (
    <Modal show onClose={() => {}}>
      <div className="flex items-center justify-center">
        <p className="text-xl font-bold">Checkmate</p>
      </div>

      <div className="my-4">
        <h1 className="text-2xl">
          {chess.turn() === "b" ? "White" : "Black"} wins by checkmate
        </h1>
      </div>
    </Modal>
  );
};

export default CheckmateModal;
