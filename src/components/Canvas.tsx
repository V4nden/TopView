import { useEffect, useRef } from "react";
import init from "../game/init";

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    init(canvasRef.current);

    return () => {};
  }, [canvasRef]);

  return <canvas ref={canvasRef}></canvas>;
};

export default Canvas;
