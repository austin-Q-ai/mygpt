import { CircleDotIcon, Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { ScrollableArea } from "@calcom/ui";

const useCases = [
  {
    title: "Find the best passive gains",
    description: "Example: Sarah, a working professional, wants to maximize her savings by...",
  },
  {
    title: "Finding the Best Trades",
    description: "Example: John, an active trader, is looking to capitalize on short-term ...",
  },
  {
    title: "Find the best investments",
    description: "Example: Lisa, a novice investor, wants to build a well-diversified investment ...",
  },
  {
    title: "Find the most stable positions",
    description: "Example: David, a conservative investor nearing retirement, prioritizes...",
  },
  {
    title: "Risk assessment for financial decisions",
    description: "Example: Sarah is considering investing in a specific...",
  },
  {
    title: "Identifying and capitalizing",
    description: "Example: Mark is interested in real estate investment...",
  },
];

const jobsFirst = [
  {
    title: "Lawyer",
    url: "/",
  },
  {
    title: "Real estate",
    url: "/",
  },
  {
    title: "Expert",
    url: "/",
  },
  {
    title: "Nurse",
    url: "/",
  },
  {
    title: "Surveyor",
    url: "/",
  },
];
const jobsSecond = [
  {
    title: "Mechanic",
    url: "/",
  },
  {
    title: "Financial",
    url: "/",
  },
  {
    title: "Management",
    url: "/",
  },
  {
    title: "Artist",
    url: "/",
  },
  {
    title: "Other",
    url: "/",
  },
];
interface socialLinksType {
  image: string;
  url: string;
}
const socialLinks: socialLinksType[] = [
  {
    image: "telegram",
    url: "/",
  },
  {
    image: "facebook",
    url: "/",
  },
  {
    image: "discord",
    url: "/",
  },
  {
    image: "instagram",
    url: "/",
  },
  {
    image: "linkedin-in",
    url: "/",
  },
];
export default function UseCases() {
  const [year, setYear] = useState<number>(0);
  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    setYear(year);
  }, []);
  const { t } = useLocale();
  return (
    <div className="!md:h-[650px] flex flex-col justify-center">
      <div className="flex-row justify-center text-center font-sans text-2xl font-bold">{t("use_cases")}</div>
      <ScrollableArea className="mx-0 my-3 grid h-[90px] gap-3 bg-transparent md:mx-10 md:my-12 md:h-full md:grid-cols-6 md:gap-2">
        {useCases.map((item, index) => {
          return (
            <div
              className="bg-emphasis col-span-1 grid grid-cols-6 rounded-md border p-2 text-sm"
              key={index}>
              <div className="col-span-1">
                <Image src="/app-use-cases/sheild.svg" width={18} height={18} alt="" />
              </div>
              <div className="text-pink col-span-5 text-xs">
                <div className="font-bold">{item.title}</div>
                <div className="overflow-hidden pt-1 font-light">{item.description}</div>
              </div>
            </div>
          );
        })}
      </ScrollableArea>
      <div className="text-pink grid grid-cols-2 flex-row  justify-items-center text-sm md:mx-10 md:mt-8 md:grid-cols-5 md:justify-items-start md:text-base">
        <div className="col-span-2 md:col-span-1">
          <Image src="/my-gpt-logo.svg" width={100} height={50} alt="logo" />
        </div>
        <div className=" my-2 flex flex-col gap-2">
          <span className="font-bold">Jobs</span>
          {jobsFirst.map((job, index) => {
            return (
              <Link href={job.url} key={index} className="flex-row hover:underline">
                {job.title}
              </Link>
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-bold">Jobs</span>
          {jobsSecond.map((job, index) => {
            return (
              <Link href={job.url} key={index} className="flex-row hover:underline">
                {job.title}
              </Link>
            );
          })}
        </div>
        <div className="col-span-2 flex flex-col gap-2 md:col-span-1 ">
          <span className="font-bold">Contact</span>
          <p className="flex-row">
            C-Kapital sas <br />
            Headquarters : 250 bis
            <br />
            boulevard Saint <br />
            Germain 75007 Paris <br />
            France <br />
            <Link className="hover:underline" href="tel:+33672941282" target="_blank">
              +33 6 72 94 12 82
            </Link>
          </p>
        </div>
        <div className="col-span-2 flex  flex-col gap-2 pt-2 md:col-span-1 md:mt-0 md:gap-5">
          <div className="flex flex-row gap-2">
            <span className="font-medium">MyGPT</span> <CircleDotIcon fill="#6D278E" width={10} />{" "}
            <Heart fill="#6D278E" /> <Star fill="#00B67A" color="#ffffff100" />{" "}
            <span className="font-medium">Trustpilot</span>
          </div>
          <Link href="/" className="text-md flex-row font-bold hover:underline">
            {t("join_us")}
          </Link>
          <div className="flex flex-row justify-between">
            {socialLinks.map((item, index) => {
              return (
                <Link className="fill-pink flex-col" href={item.url} key={index} target="_blank">
                  <Image
                    alt={item.image}
                    src={"/app-social/" + item.image + ".svg"}
                    className="text-pink border-pink round !fill-pink  rounded-full border p-2 hover:bg-gray-100"
                    width={35}
                    height={35}
                  />
                </Link>
              );
            })}
          </div>
          <div className="grid grid-cols-5 flex-row">
            <div className="col-span-2 my-auto text-[0.6rem] font-medium">{t("active_member")}</div>
            <div className="col-span-3">
              <Image src="/france-ai.svg" width={130} height={70} alt="france-ai-icon" />
            </div>
          </div>
        </div>
      </div>
      <div className="text-pink mt-3 flex-row text-center text-sm font-bold">
        <sup> &copy;</sup>
        <span className="pr-2">{year}</span>
        {t("all_rights_reserved_by_mygpt")}
      </div>
    </div>
  );
}
