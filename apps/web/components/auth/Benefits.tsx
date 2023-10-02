import classNames from "classnames";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { ScrollableArea } from "@calcom/ui";

type benifitType = {
  id: number;
  name: string;
  subBenefits: string[];
};
const mainBenefits = [
  {
    id: 1,
    name: "Customer Trust and Loyalty with Exclusive Ergonomics",
    subBenefits: [
      "Strengthened Relationships: Exclusive ergonomics fosters customer trust and loyalty by enhancing user interactions and experiences, establishing a more harmonious relationship with customers.",
      "Enhanced User Experience: Exclusive ergonomics ensures that users have a seamless and intuitive experience, keeping them satisfied and more likely to return.",
      "Positive Brand Perception: A focus on user-friendly design and functionality contributes to a positive brand image, encouraging customer loyalty and trust.",
      "Increased Customer Retention: With improved ergonomics, customers are more likely to continue using the service/product, contributing to long-term success.",
      "Reduced User Frustration: By prioritizing user-centered design, the instances of user frustration and dissatisfaction are minimized, fostering a more trusting relationship.",
      "Personalized Interactions: Exclusive ergonomics enables more personalized and user-focused interactions, making customers feel valued and understood.",
      "Consistent User Interface: A uniform and consistent interface assures users of the quality and reliability of the service, solidifying their trust and loyalty.",
    ],
  },
  {
    id: 2,
    name: "Increase in Productivity within the Organization",
    subBenefits: [
      "Quick Responses: Our AI generates instant responses, thereby reducing waiting times for your customers.",
      `Up-to-Date Knowledge: Always stay informed of the latest information thanks to the AI’s automated suggestions.`,
      "Automated Management: Simplify the management of your information and share it more efficiently thanks to AI.",
      "Save Time: AI allows you to respond to your customers more quickly, freeing up more time for other essential tasks.",
      "Reduction of Errors: AI helps to avoid human errors, ensuring consistent quality of service.",
      "Automated Suggestions: AI offers suggestions for responses, analyses, and reports, increasing your efficiency.",
      "Centralized Management: AI simplifies management by compiling and organizing key information intelligently.",
    ],
  },
  {
    id: 3,
    name: "External Facing Marketing and Technical Monitoring",
    subBenefits: [
      "Brand Visibility: External facing marketing elevates the presence and visibility of your brand to the broader public, attracting potential customers and partnerships.",
      "Targeted Outreach: With external facing marketing, reach your target audience more effectively by tailoring your messaging to suit their preferences and needs, optimizing engagement.",
      "Competitive Edge: Technical monitoring enables the identification of market trends and the activities of competitors, allowing for strategic positioning and advantage.",
      "Enhanced Reputation: By showcasing innovations, achievements, and advancements, external marketing enhances the overall reputation and perceived value of the organization.",
      "Risk Mitigation: Technical monitoring allows for the early detection of potential issues or vulnerabilities, enabling proactive resolutions and mitigating risks.",
      "Informed Decision-Making: The insights gained from technical monitoring inform strategic decisions, aligning operations with market demands and trends.",
      "Real-time Adjustments: The constant flow of data from technical monitoring allows for real-time adjustments and optimizations, ensuring the relevancy and effectiveness of strategies.",
    ],
  },
];

const members = [
  {
    alt: "member1",
    id: 1,
  },
  {
    alt: "member2",
    id: 2,
  },
  {
    alt: "member3",
    id: 3,
  },
  {
    alt: "member4",
    id: 4,
  },
  {
    alt: "member5",
    id: 5,
  },
  {
    alt: "member6",
    id: 6,
  },
];
export default function Benefits() {
  const { t } = useLocale();
  const [benifitSelected, setBenifit] = useState<number>(1);
  const [subBenifit, setSubBenefits] = useState<string[] | null>(null);

  const handleSetBenifit = (item: benifitType) => {
    if (benifitSelected === item.id) {
      return;
    }
    setBenifit(item.id);
    setSubBenefits(item.subBenefits);
  };
  const scrollableArea = useRef<HTMLDivElement>(null);
  let reachedBottom = false;
  let reachedTop = false;
  useEffect(() => {
    const observeBottomHandler = (ob: any) => {
      reachedBottom = false;
      ob.forEach((el: any) => {
        if (el?.isIntersecting) {
          reachedBottom = true;
        } else {
          reachedBottom = false;
        }
      });
    };
    const observeTopHandler = (ob: any) => {
      reachedTop = false;
      ob.forEach((el: any) => {
        if (el?.isIntersecting) {
          reachedTop = true;
        } else {
          reachedTop = false;
        }
      });
    };
    const buttomObserver = new IntersectionObserver(observeBottomHandler);
    const topObserver = new IntersectionObserver(observeTopHandler);

    const bottomEl = document.querySelectorAll("[data-observe-bottom]");

    bottomEl.forEach((el: any) => {
      buttomObserver.observe(el);
    });

    const topEl = document.querySelectorAll("[data-observe-top]");

    topEl.forEach((el: any) => {
      topObserver.observe(el);
    });

    const handelScrollEvent = (e: any) => {
      if (e.deltaY < 0) {
        if (benifitSelected <= 3 && benifitSelected !== 1 && reachedTop) {
          setBenifit(benifitSelected - 1);
        } else {
          setBenifit(3);
        }
      } else if (e.deltaY > 0) {
        if (benifitSelected >= 1 && benifitSelected !== 3 && reachedBottom) {
          setBenifit(benifitSelected + 1);
        } else if (benifitSelected >= 1 && !reachedBottom) {
        } else {
          setBenifit(1);
        }
      }
    };
    scrollableArea.current?.addEventListener("wheel", handelScrollEvent);

    return () => {
      scrollableArea.current?.removeEventListener("wheel", handelScrollEvent);
    };
  });

  useEffect(() => {
    const selectedBenifit: benifitType[] = mainBenefits.filter((item) => item.id === benifitSelected);
    const valueToBeSet =
      selectedBenifit[0].subBenefits !== undefined && selectedBenifit[0].subBenefits.length > 0
        ? selectedBenifit[0].subBenefits
        : null;
    setSubBenefits(valueToBeSet);
    if (scrollableArea.current) {
      console.log(scrollableArea.current.children[0].scrollTop);
      scrollableArea.current.children[0].scrollTop = 0;
      reachedBottom = false;
      reachedTop = false;
    }
  }, [benifitSelected]);
  return (
    <div className="grid grid-cols-1 md:h-[620px] md:grid-cols-3">
      <div className="col-span-1 mx-4 flex">
        <div className="flex h-full flex-col justify-center md:mr-4 md:px-2 ">
          <div className="flex-row">
            <span className="font-sans text-2xl font-bold md:text-3xl">{t("what_benifit_will_you_get")}</span>
          </div>
          <div className=" my-4 flex flex-row">
            <div className="flex-col">
              {mainBenefits.map((benifit) => {
                return (
                  <div
                    key={benifit.id}
                    className={classNames(
                      benifit.id === benifitSelected && "text-secondary font-medium",
                      "cursor-pointer py-3 text-gray-400 "
                    )}
                    onClick={() => handleSetBenifit(benifit)}>
                    {benifit.name}
                  </div>
                );
              })}
            </div>
            <div className="relative mx-3 flex h-full flex-col items-center justify-center">
              <div className=" h-[90%] w-1 bg-gray-400" />
              <div
                className={classNames(
                  "bg-pink absolute z-50 mx-auto h-5 w-3 rounded-md shadow",
                  benifitSelected === 1 && "top-0",
                  benifitSelected === 2 && "top-[45%]",
                  benifitSelected === 3 && "top-[86%]"
                )}>
                {null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-2 flex flex-col justify-center px-3">
        <div className="flex flex-row justify-center">
          <div className="flex  md:-space-x-6">
            {members.map((member) => {
              return (
                <Image
                  key={member.id}
                  src={"/app-members/" + member.id + ".svg"}
                  width={90}
                  height={90}
                  alt={member.alt}
                  className="inline-block !h-full !w-full !overflow-hidden rounded-full ring-4 ring-[#E9E2EF] md:ring-8 md:ring-[#F0EFF4]"
                />
              );
            })}
          </div>
        </div>
        <div className="mt-6 flex !h-5/6 flex-row">
          <div className="flex flex-col" ref={scrollableArea}>
            <ScrollableArea className="h-[200px] bg-transparent md:h-full">
              <div data-observe-top>
                <></>
              </div>
              {subBenifit && subBenifit !== undefined && subBenifit.length > 0
                ? subBenifit.map((item, index) => {
                    return (
                      <li key={index} className="text-secondary flex-row py-2">
                        {item}
                      </li>
                    );
                  })
                : null}
              <div data-observe-bottom>
                <></>
              </div>
            </ScrollableArea>
          </div>
        </div>
      </div>
    </div>
  );
}
