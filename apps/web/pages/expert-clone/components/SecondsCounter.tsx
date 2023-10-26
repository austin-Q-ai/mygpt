import React, { useState, useEffect } from "react";

function SecondsCounter() {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((oldCounter) => oldCounter + 1);
    }, 10); // update every 10 ms, or 0.01 second

    return () => clearInterval(interval); // cleanup on unmount
  }, []); // run effect only once, on mount

  const seconds = Math.floor(counter / 100); // convert counter to seconds
  const milliseconds = counter % 100; // get leftover milliseconds

  return (
    <div className="text-md mt-3 w-8 animate-pulse items-center font-bold text-red-500">
      {seconds < 10 ? "0" + seconds : seconds}:{milliseconds < 10 ? "0" + milliseconds : milliseconds}
    </div>
  );
}

export default SecondsCounter;
