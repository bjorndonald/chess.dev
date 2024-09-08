import React, { useState } from "react";

import { Variants, motion } from "framer-motion";
import { ChevronDown } from "react-feather";

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

const Select = ({
  onChange,

  list,
  placeholder,
}: ISelectProps) => {
  const [showList, setShowList] = useState(false);
  const [value, setValue] = useState("");
  return (
    <div
      onClick={() => {
        setShowList(!showList);
      }}
      className="relative flex grow cursor-pointer"
    >
      <div className="flex h-16 w-full items-center rounded-xl border-2 border-opacity-[0.2] bg-[hsl(0_0%_13%)] px-6 capitalize">
        <>
          {!value && (
            <span className="grow text-lg text-white placeholder:opacity-60">
              {placeholder}
            </span>
          )}
          {!!value && <span className="grow text-lg text-white">{value}</span>}
        </>

        <motion.a
          onClick={() => setShowList(!showList)}
          initial
          animate={showList ? "open" : "close"}
          variants={caretVariants}
          className="cursor-pointer"
        >
          <ChevronDown />
        </motion.a>
      </div>

      <motion.ul
        variants={listVariants}
        initial="close"
        animate={showList ? "open" : "close"}
        className="absolute top-[104%] flex w-full flex-col rounded-lg border border-white  bg-black py-2"
      >
        {list.map((x, i) => (
          <li
            key={i}
            onClick={() => {
              if (x.input) setValue("");
              else setValue(x.value);
              onChange(x.value);
              setShowList(false);
            }}
            className="text-gray-200 hover:bg-gray-900 w-full cursor-pointer px-4 py-5 text-lg "
          >
            {x.value}
          </li>
        ))}
      </motion.ul>
    </div>
  );
};

export default Select;
