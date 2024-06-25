import { useEffect, useRef } from "react";
import { componentToRGB } from "../lib/utils";

interface Props {
  color: string;
}

const MouseTracker: React.FC<Props> = ({ color }) => {
  const targetCoords = useRef({ x: 0, y: 0 });
  const currCoords = useRef({ x: 0, y: 0 });
  const interBubbleRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: MouseEvent) => {
    targetCoords.current = { x: event.clientX, y: event.clientY };
  };

  const move = () => {
    const { x: tgX, y: tgY } = targetCoords.current;
    const { x: currX, y: currY } = currCoords.current;
    const newX = currX + (tgX - currX) / 20;
    const newY = currY + (tgY - currY) / 20;

    currCoords.current = { x: newX, y: newY };

    if (interBubbleRef.current) {
      interBubbleRef.current.style.transform = `translate(${Math.round(
        currX
      )}px, ${Math.round(currY)}px)`;
    }

    requestAnimationFrame(move);
  };

  useEffect(() => {
    requestAnimationFrame(move);
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  });

  useEffect(() => {
    if (interBubbleRef.current) {
      const colorRGB = componentToRGB(color);
      if (colorRGB) {
        const { r, g, b } = colorRGB;
        document.documentElement.style.setProperty(
          "--color-interactive",
          `${r} ${g}, ${b}`
        );
      }
    }
  }, [color]);

  return (
    <div className="gradient-bg">
      <div className="gradients-container">
        <div className="interactive" ref={interBubbleRef}></div>
      </div>
    </div>
  );
};

export default MouseTracker;
