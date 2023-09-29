import React from "react";

import { trpc } from "@calcom/trpc/react";
import { Button } from "@calcom/ui";
import { Instagram, Facebook, Linkedin } from "@calcom/ui/components/icon";

import { default as Header } from "../header";

interface CoordonneesPageProps {
  userId: number;
}

export const CoordonneesPage = React.forwardRef<HTMLDivElement, CoordonneesPageProps>(
  (props: CoordonneesPageProps, ref) => {
    // you need to replace userId with props.id
    const { data: user, isLoading } = trpc.viewer.microcard.user.useQuery({ userId: props.userId });

    return (
      <div className="flex h-[900px] w-[500px] flex-col bg-white" ref={ref}>
        {user && !isLoading && (
          <>
            <Header title={user.name} description={user.username} hasCalendar />
            <div className="flex h-[75%] flex-col gap-6 px-8 py-6">
              <div className="mb-[40px] flex flex-col gap-4 text-sm text-black/50">
                <div className="flex flex-col gap-2">
                  <p className="font-bold text-black">Contact Information</p>
                  <p>Full Name : {user.name}</p>
                  {/* {user.position && <p>Speciality : {user.position}</p>} */}
                  <p>Speciality : {user.position || "Real estate transaction advisor"}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-bold text-black">Phone</p>
                  <p>+336 30 30 30 30</p>
                </div>
                {/* {user.address && ( */}
                <div className="flex flex-col gap-2">
                  <p className="font-bold text-black">Address</p>
                  <p>{user.address || "Lyon, Auvergne-Rhône-Alpes, France"}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div>
                      <Button
                        color="secondary"
                        className="rounded-full border-gray-700 bg-transparent md:rounded-full"
                        variant="icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="1em"
                          viewBox="0 0 496 512"
                          style={{ fill: "gray" }}>
                          <path d="M248,8C111.033,8,0,119.033,0,256S111.033,504,248,504,496,392.967,496,256,384.967,8,248,8ZM362.952,176.66c-3.732,39.215-19.881,134.378-28.1,178.3-3.476,18.584-10.322,24.816-16.948,25.425-14.4,1.326-25.338-9.517-39.287-18.661-21.827-14.308-34.158-23.215-55.346-37.177-24.485-16.135-8.612-25,5.342-39.5,3.652-3.793,67.107-61.51,68.335-66.746.153-.655.3-3.1-1.154-4.384s-3.59-.849-5.135-.5q-3.283.746-104.608,69.142-14.845,10.194-26.894,9.934c-8.855-.191-25.888-5.006-38.551-9.123-15.531-5.048-27.875-7.717-26.8-16.291q.84-6.7,18.45-13.7,108.446-47.248,144.628-62.3c68.872-28.647,83.183-33.623,92.511-33.789,2.052-.034,6.639.474,9.61,2.885a10.452,10.452,0,0,1,3.53,6.716A43.765,43.765,0,0,1,362.952,176.66Z" />
                        </svg>
                      </Button>
                    </div>
                    <div>
                      <Button
                        color="secondary"
                        StartIcon={Facebook}
                        className="rounded-full border-gray-700 bg-transparent md:rounded-full"
                        variant="icon"
                      />
                    </div>
                    <div>
                      <Button
                        color="secondary"
                        className="rounded-full border-gray-700 bg-transparent md:rounded-full"
                        variant="icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="1em"
                          viewBox="0 0 640 512"
                          style={{ fill: "gray" }}>
                          <path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z" />
                        </svg>
                      </Button>
                    </div>
                    <div>
                      <Button
                        color="secondary"
                        StartIcon={Instagram}
                        className="rounded-full border-gray-700 bg-transparent md:rounded-full"
                        variant="icon"
                      />
                    </div>
                    <div>
                      <Button
                        color="secondary"
                        StartIcon={Linkedin}
                        className="rounded-full border-gray-700 bg-transparent md:rounded-full"
                        variant="icon"
                      />
                    </div>
                  </div>
                </div>
                {/* )} */}
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
                height="250px"
              />
            </div>
          </>
        )}
      </div>
    );
  }
);

CoordonneesPage.displayName = "CoordonneesPage";
