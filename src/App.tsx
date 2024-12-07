import { useState } from "react";
import Canvas from "./components/Canvas";

function App() {
  const [started, setStarted] = useState(false);
  return started ? (
    <Canvas />
  ) : (
    <>
      <div className="w-full min-h-screen flex items-center justify-center">
        <button
          onClick={() => {
            setStarted(true);
          }}
        >
          start
        </button>
      </div>
    </>
  );
}

export default App;
