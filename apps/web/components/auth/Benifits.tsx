import classNames from "classnames";
import Image from "next/image";
import { useEffect, useState } from "react";

import { useLocale } from "@calcom/lib/hooks/useLocale";

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

  const handleSetBenifit = (item: any) => {
    if (benifitSelected === item.id) {
      return;
    }
    setBenifit(item.id);
    setSubBenifits(item.subBenifit);
  };

  const handleScrollEvent = (e: any) => {
    console.log(e);
  };

  useEffect(() => {
    const selectedBenifit: any = mainBenifits.filter((item) => item.id === benifitSelected);
    const valueToBeSet =
      selectedBenifit[0].subBenifits !== undefined && selectedBenifit[0].subBenifits.length > 0
        ? selectedBenifit[0].subBenifits
        : null;
    setSubBenifits(valueToBeSet);
  }, [benifitSelected]);
  return (
    <div className="grid !h-[600px] grid-cols-3">
      <div className="col-span-1 mx-4 flex">
        <div className="mr-4 flex h-full flex-col justify-center px-2 ">
          <div className="flex-row">
            <span className="font-sans text-3xl font-bold ">{t("what_benifit_will_you_get")}</span>
          </div>
          <div className=" my-4 flex flex-row" onScroll={(e) => handleScrollEvent(e)}>
            <div className="flex-col">
              {mainBenifits.map((benifit) => {
                return (
                  <div
                    key={benifit.id}
                    className={classNames(
                      benifit.id === benifitSelected && "text-pink font-bold",
                      "text-muted cursor-pointer py-3"
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
          <div className="flex -space-x-6 !overflow-hidden ">
            {members.map((member) => {
              return (
                <Image
                  key={member.id}
                  src={"/app-members/" + member.id + ".svg"}
                  width={100}
                  height={100}
                  alt={member.alt}
                  className="inline-block h-full w-full !overflow-hidden rounded-full ring-8 ring-white"
                />
              );
            })}
          </div>
        </div>
        <div className="mt-6 flex h-5/6 flex-row">
          <div className="flex flex-col">
            {subBenifit && subBenifit !== undefined && subBenifit.length > 0
              ? subBenifit.map((item, index) => {
                  return (
                    <li key={index} className="text-pink flex-row py-2">
                      {item}
                    </li>
                  );
                })
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}
