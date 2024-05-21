import React from "react";

interface Props {
  moves: string[];
}

const Moves = ({ moves }: Props) => {
  return (
    <div className="absolute left-0 top-0 z-10 h-full w-full overflow-auto bg-[#262421]/70 pt-4">
      <h1 className="text-center font-pistilli text-4xl">Moves</h1>
      <div id="moves" className="vstack w-full">
        {moves
          .filter((x, i) => i % 2 === 0)
          .map((x, i) => (
            <div key={i} className="hstack h-8 w-full border-b border-[#ccc]">
              <div className="center h-full flex-[0.13] border-r border-[#404040] bg-[#302e2c] text-sm text-[#fff]">
                {i + 1}
              </div>
              <div className="hstack h-full flex-[0.435] border-[#404040] pl-2 text-sm text-[#f6f6f6]">
                {x}
              </div>
              {!!moves[i * 2 + 1] && (
                <div className="hstack h-full flex-[0.435] border-r border-[#404040] pl-2 text-sm text-[#bababa]">
                  {moves[i * 2 + 1]}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Moves;
