import React, { useEffect, useState } from "react";

const Countdown = ({ done }: { done: () => void }) => {
  const [seconds, setSeconds] = useState(3);
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => {
        if (s === 0) done();
        return s - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-black/50 font-pistilli text-5xl font-bold text-white ">
      {seconds}
    </div>
  );
};

export default Countdown;
