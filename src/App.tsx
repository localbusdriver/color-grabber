import "./App.css";
import HeaderBar from "./components/HeaderBar";
import MouseTracker from "./components/MouseTracker";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Button } from "./components/ui/button";
import ColorOutput from "./components/ColorOutput";

import { useState, useRef, useEffect } from "react";

function App() {
  const [outputHex, setOutputHex] = useState<Array<string>>(["#ffffff"]);
  const [imageUrl, setImageUrl] = useState<string>("https://picsum.photos/200");
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleGetColorsHelper = async (src: string): Promise<Set<string>> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const top5Colors = new Set<string>();

      img.onload = () => {
        const colors = new Map<string, number>();
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (context) {
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);
          const imageData = context.getImageData(0, 0, img.width, img.height);
          const data = imageData.data;
          // console.log("data" + data)

          for (let i = 0; i < data.length; i += 4) {
            const [r, g, b] = data.slice(i, i + 3);
            const rgb = `#${r.toString(16).padStart(2, "0")}${g
              .toString(16)
              .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

            colors.set(rgb, (colors.get(rgb) || 0) + 1);
          }

          const sortedColors = new Map(
            [...colors.entries()].sort((a, b) => b[1] - a[1])
          );

          let i = 0;
          for (const [color, _] of sortedColors) {
            top5Colors.add(color);
            i++;
            if (i === 5) break;
          }
        }

        resolve(top5Colors);
      };
      img.onerror = reject;
      img.crossOrigin = "Anonymous";
      img.src = src;
    });
  };

  const getTopColors = async (src: string): Promise<Set<string>> => {
    const colors = await handleGetColorsHelper(src);
    return colors;
  };

  const handleGetColors = () => {
    const file = uploadInputRef.current?.files?.[0];
    const url = urlInputRef.current?.value;

    if (file) {
      console.log(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target === null || typeof e.target.result !== "string") return;
        const colors = getTopColors(e.target.result);
      };
      reader.readAsDataURL(file);
    } else if (url) {
      console.log(url);
      setImageUrl(url);
      const colors = handleGetColorsHelper(url);
    } else {
      console.error("No file or url provided");
      const url = "https://picsum.photos/200";
      imageRef.current!.src = url;
      console.log("Using default image: " + url);
      const colors = getTopColors(url);
      colors.then((colors): void => {
        // const newColorDivs = Array(...colors).map((el, i) => {
        //   return <ColorOutput key={i} color={el} index={i} />;
        // });
        // setOutputDivs(newColorDivs);
      });
    }
  };

  useEffect(() => {
    console.log("Initial getColors");
    getTopColors("https://picsum.photos/200")
      .then((colors): void => {
        setOutputHex(Array(...colors));
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  return (
    <>
      <MouseTracker color={outputHex[0]} />
      <HeaderBar color={outputHex[0]} />
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
                src={imageUrl}
                alt="missing"
                ref={imageRef}
                height={"658px"}
                width={"658px"}
              />
            </div>
          </div>
          <ColorOutput jsx={outputHex} />
        </div>
      </main>
    </>
  );
}

export default App;
