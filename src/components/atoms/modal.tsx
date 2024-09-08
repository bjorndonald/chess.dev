"use client";
import cx from "@/utils/cx";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
  show: boolean;
  onClose: () => void;
}

const Modal = ({ children, show, onClose }: Props) => {
  return (
    <dialog id="my_modal_3" className={cx("modal", show && "modal-open")}>
      <div className="bg-background modal-box w-11/12 max-w-lg">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button
            onClick={onClose}
            className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
          >
            ✕
          </button>
        </form>
        {children}
      </div>
    </dialog>
  );
};

export default Modal;
