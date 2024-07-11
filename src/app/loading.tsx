import cx from "@/utils/cx";
import React from "react";

const Loading = (props: { sm?: boolean }) => {
  return (
    <div
      className={cx(
        "flex w-full flex-1 flex-col items-center justify-center p-4",
        !props.sm ? "min-h-screen" : "h-full",
      )}
    >
      <div className="loading loading-spinner"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loading;
