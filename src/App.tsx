import "./App.css";
import HeaderBar from "./components/HeaderBar";
import MouseTracker from "./components/MouseTracker";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Button } from "./components/ui/button";

import { useState, useRef } from "react";

function App() {
  const [topColors, setTopColors] = useState<string>("#ffffff");
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleGetColorsHelper = async (src: string): Promise<Set<string>> => {
    const img = new Image();
    const colors = new Set<string>();
    img.crossOrigin = "Anonymous";
    img.src = src;

    img.onload = (e) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
        const imageData = context.getImageData(0, 0, img.width, img.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const [r, g, b] = data.slice(i, i + 3);
          colors.add(
            `#${r.toString(16).padStart(2, "0")}, 
            ${g.toString(16).padStart(2, "0")},
            ${b.toString(16).padStart(2, "0")}`
          );
        }
      }
    };

    return colors;
  };

  const getTopColors = async (src: string): Promise<Set<string>> => { 
    const colors = await handleGetColorsHelper(src);
    return colors;
  }

  const handleGetColors = () => {
    const file = uploadInputRef.current?.files?.[0];
    const url = urlInputRef.current?.value;

    if (file) {
      console.log(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target === null || typeof e.target.result !== "string") return;
        const colors = getTopColors(e.target.result);
        console.log(colors);
      };
      reader.readAsDataURL(file);
    } else if (url) {
      console.log(url);
      const colors = handleGetColorsHelper(url);
      console.log(colors);
    } else {
      console.error("No file or url provided");
      const url = "https://picsum.photos/200";
      console.log("Using default image: " + url);
      const colors = getTopColors(url).then((set) => { console.log(set) });
    }
  };

  return (
    <>
      <MouseTracker color={topColors} />
      <HeaderBar color={topColors} />
      <main className="mt-12 md:px-32 px-8">
        <div className="md:flex md:justify-between">
          <div className="flex flex-col gap-8">
            <div className="grid grid-rows-2 grid-cols-3 gap-x-4 gap-y-1 max-w-max">
              <Label
                htmlFor="upload"
                className="text-lg text-secondary font-thin"
                style={{ gridRow: 1, gridColumn: 1 }}
              >
                Upload Image:
              </Label>
              <Input
                id="upload"
                type="file"
                ref={uploadInputRef}
                className="border-none text-secondary-foreground bg-secondary"
                style={{ gridRow: 2, gridColumn: 1 }}
              />
              <Label
                htmlFor="url-link"
                className="text-lg text-secondary font-thin"
                style={{ gridRow: 1, gridColumn: 2 }}
              >
                Link to image:
              </Label>
              <Input
                id="url-link"
                type="text"
                ref={urlInputRef}
                className="border-none text-secondary-foreground bg-secondary"
                placeholder="https://picsum.photos/200"
                style={{ gridRow: 2, gridColumn: 2 }}
              />
              <Button
                variant={"secondary"}
                className="max-w-max"
                style={{ gridRow: 2, gridColumn: 3 }}
                onClick={handleGetColors}
              >
                Grab
              </Button>
            </div>
            <div className="border max-w-[658px] rounded">
              <img
                src="https://picsum.photos/200"
                alt="missing"
                ref={imageRef}
                height={"658px"}
                width={"658px"}
              />
            </div>
          </div>
          <div id="output"></div>
        </div>
      </main>
    </>
  );
}

export default App;
