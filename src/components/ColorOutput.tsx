interface Props {
  jsx: Array<string>;
}
const ColorOutput: React.FC<Props> = (props: Props) => {
  return (
    <div className="flex flex-col gap-4 my-auto">
      {props.jsx.map((el, i) => (
        <div key={i} className="flex flex-row gap-4">
          <div
            className="min-w-10 min-h-10 rounded"
            style={{ backgroundColor: el }}
          ></div>
          <h1 className="text-3xl">
            <span className="font-bold">{i + 1}:</span>&nbsp;{el}
          </h1>
        </div>
      ))}
    </div>
  );
};

export default ColorOutput;
