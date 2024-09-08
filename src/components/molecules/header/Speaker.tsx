"use client";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import SpeakerOnIcon from "./SpeakerOn.icon";
import SpeakerOffIcon from "./SpeakerOff.icon";
import { motion } from "framer-motion";

const Speaker = () => {
  const [speakerOn, setSpeakerOn] = useState(false);
  return (
    <AnimatePresence>
      {speakerOn && (
        <motion.button
          onClick={() => setSpeakerOn(!speakerOn)}
          transition={{ type: "spring" }}
          whileHover={{ background: "bg-gray-800" }}
          className="btn btn-square btn-ghost"
        >
          <SpeakerOnIcon />
        </motion.button>
      )}
      {!speakerOn && (
        <motion.button
          onClick={() => setSpeakerOn(!speakerOn)}
          transition={{ type: "spring" }}
          whileHover={{ background: "bg-gray-800" }}
          className="btn btn-square btn-ghost"
        >
          <SpeakerOffIcon />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default Speaker;
