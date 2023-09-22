import { default as Header } from "../header";

export const CoordonneesPage = () => {
  return (
    <div className="flex w-full flex-col">
      <Header title="Hugo Libes" description="hugo.myGPT.fi" hasCalendar />
      <div className="max-h-[75vh] px-8 py-5">
        <div className="text-gray flex flex-col gap-4 text-sm text-black/50">
          <div className="flex flex-col gap-3">
            <p className="font-bold text-black">Contact Information</p>
            <p>Full Name : Hugo Libes</p>
            <p>Speciality : Real estate transaction advisor</p>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-bold text-black">Phone</p>
            <p>+33 6 30 30 30 30</p>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-bold text-black">Address</p>
            <p>Lyon, Auvergne-Rhône-Alpes, France</p>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-bold text-black">LinkedIn</p>
            <p>www.linkedin.com/hugo-libes</p>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-bold text-black">Subscribed</p>
            <p>21 August 2023</p>
          </div>
        </div>
        <div className="pt-5" />
      </div>
    </div>
  );
};
