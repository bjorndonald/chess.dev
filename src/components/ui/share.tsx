"use client";
import React from "react";
import { Facebook, Link as LinkIcon, Twitter } from "react-feather";
import useGame from "@/store/game";
import { doCopyText } from "@/utils/copy";
import Link from "next/link";
import WhatsappIcon from "../icons/Whatsapp.icon";
import TelegramIcon from "../icons/Telegram.icon";
import Modal from "../atoms/modal";

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
            className="hover:shadow-sky-500/50 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-blue-200 fill-[#1d9bf0] shadow-xl hover:bg-[#1d9bf0] hover:fill-white"
          >
            <Twitter />
          </Link>

          <Link
            target="_blank"
            href={`whatsapp://send?text=Here's the game \n${shareLink}`}
            className="border-green-200 hover:shadow-green-500/50 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border fill-[#25D366] shadow-xl hover:bg-[#25D366] hover:fill-white"
          >
            <WhatsappIcon />
          </Link>

          <Link
            target="_blank"
            href={`https://telegram.me/share/url?url=${shareLink}&text=${"Here's the game!"}`}
            className="border-sky-200 hover:shadow-sky-500/50 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border fill-[#229ED9] shadow-xl hover:bg-[#229ED9] hover:fill-white"
          >
            <TelegramIcon />
          </Link>
        </div>

        <p className="text-sm">Or copy link</p>
        <div className="border-gray-200 mt-4 flex items-center justify-between gap-2 rounded-box border px-2 py-2">
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
        <div className="mt-4 flex justify-center">
          <Link href={shareLink} passHref>
            <a
              target="_blank"
              className="btn btn-primary btn-sm"
              onClick={() => showShareModal(undefined)}
            >
              Open Game
            </a>
          </Link>
        </div>
      </div>
    </Modal>
  );
};

export default ShareModal;
