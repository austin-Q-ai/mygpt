import classNames from "classnames";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { ScrollableArea } from "@calcom/ui";

type benifitType = {
  id: number;
  name: string;
  subBenifits: string[];
};
const mainBenifits = [
  {
    id: 1,
    name: "Confiance Client et Fidélisation avec Ergonomie Exclusive",
    subBenifits: [
      "Connaissance à jour : Restez toujours au fait des dernières informations grâce aux suggestions automatisées de l'IA.",
      "Gestion automatisée : Simplifiez la gestion de vos informations et partagez-les plus efficacement grâce à l'IA.",
      "Gagnez du temps : L'IA vous permet de répondre plus rapidement à vos clients, vous laissant plus de temps pour d'autres tâches essentielles.",
      "Réduction des erreurs : L'IA contribue à éviter les erreurs humaines, garantissant une qualité de service constante.",
      "Suggestions automatisées : L'IA vous propose des suggestions pour réponses, analyses et rapports, augmentant votre efficacité.",
      "Gestion centralisée : L'IA simplifie la gestion en regroupant et en organisant les informations clés de manière intelligente.",
    ],
  },
  {
    id: 2,
    name: "Accroissement de Productivité au sein de l'Organisation",
    subBenifits: [
      "Réponses rapides : Notre IA génère des réponses instantanées, réduisant ainsi les délais d'attente pour vos clients.",
      "Connaissance à jour : Restez toujours au fait des dernières informations grâce aux suggestions automatisées de l'IA.",
      "Gestion automatisée : Simplifiez la gestion de vos informations et partagez-les plus efficacement grâce à l'IA.",
      "Gagnez du temps : L'IA vous permet de répondre plus rapidement à vos clients, vous laissant plus de temps pour d'autres tâches essentielles.",
      "Réduction des erreurs : L'IA contribue à éviter les erreurs humaines, garantissant une qualité de service constante.",
      "Suggestions automatisées : L'IA vous propose des suggestions pour réponses, analyses et rapports, augmentant votre efficacité.",
      "Gestion centralisée : L'IA simplifie la gestion en regroupant et en organisant les informations clés de manière intelligente.",
    ],
  },
  {
    id: 3,
    name: "Marketing Vis-à-Vis de l'Extérieur et Veille Technique",
    subBenifits: [
      "Réponses rapides : Notre IA génère des réponses instantanées, réduisant ainsi les délais d'attente pour vos clients.",
      "Connaissance à jour : Restez toujours au fait des dernières informations grâce aux suggestions automatisées de l'IA.",
      "Gestion automatisée : Simplifiez la gestion de vos informations et partagez-les plus efficacement grâce à l'IA.",
      "Gagnez du temps : L'IA vous permet de répondre plus rapidement à vos clients, vous laissant plus de temps pour d'autres tâches essentielles.",
      "Réduction des erreurs : L'IA contribue à éviter les erreurs humaines, garantissant une qualité de service constante.",
      "Gestion centralisée : L'IA simplifie la gestion en regroupant et en organisant les informations clés de manière intelligente.",
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
export default function Benifits() {
  const { t } = useLocale();
  const [benifitSelected, setBenifit] = useState<number>(2);
  const [subBenifit, setSubBenifits] = useState<string[] | null>(null);

  const handleSetBenifit = (item: benifitType) => {
    if (benifitSelected === item.id) {
      return;
    }
    setBenifit(item.id);
    setSubBenifits(item.subBenifits);
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
    const selectedBenifit: benifitType[] = mainBenifits.filter((item) => item.id === benifitSelected);
    const valueToBeSet =
      selectedBenifit[0].subBenifits !== undefined && selectedBenifit[0].subBenifits.length > 0
        ? selectedBenifit[0].subBenifits
        : null;
    setSubBenifits(valueToBeSet);
    if (scrollableArea.current) {
      console.log(scrollableArea.current.children[0].scrollTop);
      scrollableArea.current.children[0].scrollTop = 0;
      reachedBottom = false;
      reachedTop = false;
    }
  }, [benifitSelected]);
  return (
    <div className="grid grid-cols-1 md:h-[600px] md:grid-cols-3">
      <div className="col-span-1 mx-4 flex">
        <div className="flex h-full flex-col justify-center md:mr-4 md:px-2 ">
          <div className="flex-row">
            <span className="font-sans text-2xl font-bold md:text-3xl">{t("what_benifit_will_you_get")}</span>
          </div>
          <div className=" my-4 flex flex-row">
            <div className="flex-col">
              {mainBenifits.map((benifit) => {
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
          <div className="flex  md:-space-x-6 ">
            {members.map((member) => {
              return (
                <Image
                  key={member.id}
                  src={"/app-members/" + member.id + ".svg"}
                  width={90}
                  height={90}
                  alt={member.alt}
                  className="inline-block !h-full !w-full !overflow-hidden rounded-full ring-8 ring-[#E9E2EF] md:ring-gray-100"
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
