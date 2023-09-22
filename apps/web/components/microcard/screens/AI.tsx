import { default as Header } from "../header";

export const AIPage = () => {
  return (
    <div className="flex w-full flex-col">
      <Header title="Hugo AI" description="hugo.myGPT.fi" isAI />
      <p>AI Page</p>
    </div>
  );
};
