"use client";
import Modal from "@/components/Common/Modal";
import React from "react";
import { Facebook, Link as LinkIcon, Twitter } from "react-feather";
import WhatsappIcon from "./Whatsapp.icon";
import TelegramIcon from "./Telegram.icon";
import useGame from "@/store/game";
import { doCopyText } from "@/utils/copy";
import Link from "next/link";

const ShareModal = () => {
  const shareModal = useGame(s => s.shareModal);
  const showShareModal = useGame(s => s.showShareModal);
  const shareLink = `${process.env.NEXT_PUBLIC_DOMAIN_URI}/game/${shareModal.id}?player=${shareModal.black || shareModal.white}`;

  return (
    <Modal show={!!shareModal} onClose={() => showShareModal(undefined)}>
      <div className="flex items-center justify-center">
        <p className="text-xl font-bold">Share Modal</p>
      </div>

      <div className="my-4">
        <p className="text-sm">Share this link via</p>

        <div className="my-4 flex justify-around">
          <Link
            target="_blank"
            href={`https://www.facebook.com/share.php?u=Here's the game\n${shareLink}`}
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-blue-200 fill-[#1877f2] shadow-xl hover:bg-[#1877f2] hover:fill-white hover:shadow-blue-500/50"
          >
            <Facebook />
          </Link>

          <Link
            target="_blank"
            href={`https://twitter.com/intent/tweet?text=Here's the game! \n${shareLink}`}
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-blue-200 fill-[#1d9bf0] shadow-xl hover:bg-[#1d9bf0] hover:fill-white hover:shadow-sky-500/50"
          >
            <Twitter />
          </Link>

          <Link
            target="_blank"
            href={`whatsapp://send?text=Here's the game \n${shareLink}`}
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-green-200 fill-[#25D366] shadow-xl hover:bg-[#25D366] hover:fill-white hover:shadow-green-500/50"
          >
            <WhatsappIcon />
          </Link>

          <Link
            target="_blank"
            href={`https://telegram.me/share/url?url=${shareLink}&text=${"Here's the game!"}`}
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-sky-200 fill-[#229ED9] shadow-xl hover:bg-[#229ED9] hover:fill-white hover:shadow-sky-500/50"
          >
            <TelegramIcon />
          </Link>
        </div>

        <p className="text-sm">Or copy link</p>
        <div className="mt-4 flex items-center justify-between gap-2 rounded-box border border-gray-200 px-2 py-2">
          <LinkIcon />

          <input
            className="w-full overflow-x-hidden text-ellipsis whitespace-nowrap bg-transparent outline-none"
            type="text"
            disabled
            placeholder="link"
            value={shareLink}
          />

          <button
            onClick={() => doCopyText(shareLink)}
            className="btn btn-primary btn-sm"
          >
            Copy
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ShareModal;
