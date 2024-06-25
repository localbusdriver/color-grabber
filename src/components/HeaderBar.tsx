import { useEffect, useRef } from "react";
import { componentToRGB } from "../lib/utils";


interface Props {
  color: string;
}
const HeaderBar: React.FC<Props> = ({ color }) => {
  const colorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (colorRef.current) {
      const colorRGB = componentToRGB(color);
      if (colorRGB) {
        const { r, g, b } = colorRGB;
        colorRef.current.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.2)`;
      }
    }
  }, [color]);

  return (
    <div className="header-bar" ref={colorRef}>
      <a className="text-3xl font-thin hover:italic hover:underline" href="/">
        Color Grabber
      </a>
      <div>
        <button className="bg-secondary-foreground px-4 py-2 rounded text-xl font-thin min-w-max">
          Click me
        </button>
      </div>
    </div>
  );
};

export default HeaderBar;
