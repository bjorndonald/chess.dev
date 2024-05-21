import React, { useState } from "react";
import CaretIcon from "./Caret.icon";
import { Variants, motion } from "framer-motion";

const listVariants: Variants = {
  open: {
    opacity: 1,
    scale: 1,
  },
  close: {
    opacity: 0,
    scale: 0,
  },
};

const caretVariants: Variants = {
  open: {
    rotate: "180deg",
  },
  close: {
    rotate: "0deg",
  },
};

interface ISelectProps {
  placeholder: string;
  onChange: (str: string) => void;
  list: {
    value: string;
    input?: boolean;
  }[];
}

const Select = ({ onChange, list, placeholder }: ISelectProps) => {
  const [showList, setShowList] = useState(false);
  const [value, setValue] = useState("");
  const [inputBool, setInputBool] = useState(false);
  return (
    <div
      onClick={() => {
        if (!inputBool) setShowList(!showList);
      }}
      className="relative flex grow cursor-pointer"
    >
      <div className="flex h-16 w-full items-center rounded-xl border-2 border-opacity-[0.2] bg-[hsl(0_0%_13%)] px-6 capitalize">
        {!inputBool && (
          <>
            {!value && (
              <span className="grow text-lg text-white placeholder:opacity-60">
                {placeholder}
              </span>
            )}
            {!!value && (
              <span className="grow text-lg text-white">{value}</span>
            )}
          </>
        )}

        {!!inputBool && (
          <input
            className="flex h-full grow border-none bg-transparent text-lg text-white outline-none placeholder:opacity-60"
            type="text"
            placeholder={"Enter email"}
          />
        )}

        <motion.a
          onClick={() => setShowList(!showList)}
          initial
          animate={showList ? "open" : "close"}
          variants={caretVariants}
          className="cursor-pointer"
        >
          <CaretIcon />
        </motion.a>
      </div>

      <motion.ul
        variants={listVariants}
        animate={showList ? "open" : "close"}
        className="absolute top-[104%] flex w-full flex-col rounded-lg border border-white  bg-black py-2"
      >
        {list.map((x, i) => (
          <li
            key={i}
            onClick={() => {
              setInputBool(!!x.input);
              if (x.input) setValue("");
              else setValue(x.value);
              onChange(x.value);
              setShowList(false);
            }}
            className="w-full cursor-pointer px-4 py-5 text-lg text-gray-200 hover:bg-gray-900 "
          >
            {x.value}
          </li>
        ))}
      </motion.ul>
    </div>
  );
};

export default Select;
