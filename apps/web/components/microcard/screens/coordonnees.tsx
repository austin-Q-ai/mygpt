import React from "react";

import { default as Header } from "../header";

export const CoordonneesPage = React.forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div className="flex w-full flex-col bg-white" ref={ref}>
      <Header title="Hugo Libes" description="hugo.myGPT.fi" hasCalendar />
      <div className="flex flex-col gap-6 px-8 py-6">
        <div className="flex flex-col gap-4 text-sm text-black/50">
          <div className="flex flex-col gap-2">
            <p className="font-bold text-black">Contact Information</p>
            <p>Full Name : Hugo Libes</p>
            <p>Speciality : Real estate transaction advisor</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-bold text-black">Phone</p>
            <p>+33 6 30 30 30 30</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-bold text-black">Address</p>
            <p>Lyon, Auvergne-Rhône-Alpes, France</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-bold text-black">LinkedIn</p>
            <p>www.linkedin.com/hugo-libes</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-bold text-black">Subscribed</p>
            <p>21 August 2023</p>
          </div>
        </div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d178269.37518564396!2d4.8172773167968685!3d45.72188930600805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47f4ea516ae88797%3A0x408ab2ae4bb21f0!2sLyon%2C%20France!5e0!3m2!1sen!2sus!4v1695368080856!5m2!1sen!2sus"
          style={{ border: 0 } as React.CSSProperties}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          height="200px"
        />
      </div>
    </div>
  );
});

CoordonneesPage.displayName = "CoordonneesPage";
