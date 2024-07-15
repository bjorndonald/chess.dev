"use client";
import React, { useState } from "react";

import { motion } from "framer-motion";
import KingIcon from "./King.icon";

const SiteLogo = () => {
  const [hover, setHover] = useState(false);
  const [position, setPosition] = useState(Math.random() < 0.5);

  return (
    <div
      onMouseLeave={() => setHover(false)}
      onMouseEnter={() => {
        setPosition(Math.random() < 0.5);
        setHover(true);
      }}
      className="btn btn-sm tablet-md:btn-md btn-ghost flex"
    >
      <motion.div
        animate={
          hover
            ? {
                scale: 1.2,
                ...(position ? { rotate: "-90deg" } : {}),
              }
            : {
                scale: 1,
                ...(position ? { rotate: "0deg" } : {}),
              }
        }
        transition={{
          bounce: false,
        }}
      >
        <KingIcon innerColor="black" outerColor="white" />
      </motion.div>
      <h1 className="font-queen text-xl tablet-md:text-4xl text-white">Quick Chess</h1>
      <motion.div
        animate={
          hover
            ? {
                scale: 1.2,
                ...(!position ? { rotate: "90deg" } : {}),
              }
            : {
                scale: 1,
                ...(!position ? { rotate: "0deg" } : {}),
              }
        }
        transition={{
          bounce: false,
        }}
      >
        <KingIcon innerColor="white" outerColor="black" />
      </motion.div>
    </div>
  );
};

export default SiteLogo;
