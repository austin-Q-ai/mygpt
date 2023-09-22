import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Button, Dialog, HeadSeo, DialogContent, DialogTrigger } from "@calcom/ui";
import { ArrowLeft, ArrowRight, LogOut, MessageSquare, Share2, X } from "@calcom/ui/components/icon";

import Loader from "@components/Loader";
import Footer from "@components/auth/Footer";
import PriceListItem from "@components/prices/PriceListItem";

interface Props {
  title: string;
  description: string;
  footerText?: React.ReactNode | string;
  showLogo?: boolean;
  heading?: string;
  loading?: boolean;
}

const footerLinks = [
  {
    name: "Benfits",
    url: "/",
  },
  {
    name: "Features",
    url: "/",
  },
  {
    name: "How does it work",
    url: "/",
  },
  {
    name: "Use Cases",
    url: "/",
  },
  {
    name: "Terms and conditions",
    url: "/",
  },
  {
    name: "France AI",
    url: "/",
    picture: "/france-ai.svg",
  },
  {
    name: "Share",
    url: "/",
    Icon: <Share2 />,
  },
  {
    name: "Comments",
    url: "/",
    Icon: <MessageSquare />,
    sideLabel: "9 comments",
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
];

const pricesList = [
  {
    name: "Freemium",
    features: [
      "Accès à des fonctionnalités de base",
      "Limite de 500 messages/mois",
      "Support par e-mail avec réponse sous 48h",
      "Stockage de données limité à 1 Go",
      "1 bot actif",
    ],
    ipDevice: "",
    password: "",
  },
  {
    name: " 29 €/mois",
    features: [
      "Accès à des fonctionnalités avancées",
      "Limite de 5 000 messages/mois",
      "Support par e-mail avec réponse sous 24h",
      "Stockage de données jusqu'à 10 Go",
      "Jusqu'à 3 bots actifs",
    ],
    ipDevice: "",
    password: "",
  },
  {
    name: " 59 €/mois",
    features: [
      "Accès à toutes les fonctionnalités premium",
      "Limite de 20 000 messages/mois",
      "Support prioritaire par e-mail et chat",
      "Stockage de données jusqu'à 50 Go",
      "Jusqu'à 10 bots actifs",
      "Intégrations avancées avec d'autres plateformes",
      "Accès à des analyses et rapports détaillés",
    ],
    ipDevice: "",
    password: "",
  },
  {
    name: " 99 €/mois",
    features: [
      "Accès illimité à toutes les fonctionnalités",
      "Limite de 100 000 messages/mois",
      "Support prioritaire 24/7",
      "Stockage de données illimité",
      "Nombre illimité de bots actifs",
      "Intégrations personnalisées",
      "Formation et webinaires exclusifs",
    ],
    ipDevice: "",
    password: "",
  },
  {
    name: "Prix spécifique",
    features: [
      "Volume de messages personnalisé",
      "Stockage de données personnalisé",
      "Nombre de bots actifs personnalisé",
      "intégrations spécifiques ou des développements sur mesure",
      "Accès à des analyses et rapports détaillés personnalisé",
    ],
    ipDevice: "",
    password: "",
  },
];

export default function AuthContainer(props: React.PropsWithChildren<Props>) {
  const { t } = useLocale();

  return (
    <>
      <div className="flex flex-row">
        <div className="mx-6 flex flex-1 flex-col justify-center bg-[#f3f4f6] py-4 sm:px-6 lg:px-4">
          <HeadSeo title={props.title} description={props.description} />
          <div className=" mb-auto flex justify-between">
            <div className="flex-col">
              {props.showLogo && (
                <Image src="/my-gpt-logo.svg" width={178} height={30} className="left-0" alt="logo" />
              )}
            </div>
            <div className="text-pink flex-col">
              <div className="flex flex-row gap-8">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="icon"
                      size="lg"
                      color="secondary"
                      aria-label={t("delete")}
                      className="p-none text-pink mr-1 hidden border-0 bg-transparent sm:inline">
                      Prices
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-pink/30" size="xl" Icon={X} title={t("")}>
                    <div className="mt-5 flex flex-row gap-5">
                      {pricesList.map((priceItem, index) => {
                        return <PriceListItem key={index} priceItem={priceItem} />;
                      })}
                    </div>
                  </DialogContent>
                </Dialog>
                <div className="flex flex-col">
                  <div className="flex flex-row gap-1">
                    <LogOut className="h-8 w-6 flex-col" />
                    <div className="flex flex-col">
                      <Link href="/auth/login" className="flex-row text-xs">
                        Sign in
                      </Link>
                      <Link href="/signup" className="flex-row text-xs">
                        Sign up
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex max-h-screen flex-row  flex-wrap">
        <div className=" mt-12 flex flex-col justify-center  bg-[#f3f4f8] py-1 pt-4 sm:mx-2  md:mx-4 lg:mx-8 lg:flex-1 lg:px-4">
          <div className="">
            <div className={classNames(props.showLogo ? "" : "", "flex-row sm:mx-2 sm:w-full sm:max-w-md")}>
              {props.heading && (
                <h2 className="text-emphasis line-height-2  font-sans text-4xl font-medium leading-normal">
                  {t("empower_with_ai_reveal")}
                </h2>
              )}
            </div>
            {props.loading && (
              <div className=" absolute z-50 flex h-screen w-full items-center">
                <Loader />
              </div>
            )}
            <div className="mb-auto mt-8 sm:mx-1 sm:w-full sm:max-w-md lg:w-[70%] lg:max-w-[70%]">
              <div className="mx-2 px-2 py-10 sm:px-2">{props.children}</div>
              {/* <div className="text-default mt-8 text-center text-sm">{props.footerText}</div> */}
            </div>
            <div className="mt-5">
              <Image src="/standing-auth.svg" width={423} height={175} alt="standing_auth" />
              <p className="text-muted mx-3 mt-5 break-words sm:w-full sm:max-w-md lg:w-[80%] lg:max-w-[80%]">
                {t("your_artifitial_footer")}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col  justify-start sm:px-6 lg:px-8">
          <div className="mx-auto flex-row">
            <Image src="/qube-side-pic.svg" width={320} height={575} alt="standing_auth" />
          </div>
          <div className="mx-auto mt-5 flex flex-row gap-4">
            <div className="my-auto cursor-pointer flex-col">
              <ArrowLeft />
            </div>
            {members.map((member) => {
              return (
                <div
                  key={member.id}
                  data-testid={`app-store-member-${member.id}`}
                  className="relative flex-col content-center rounded-md">
                  <Image
                    src={"/app-members/" + member.id + ".svg"}
                    width={100}
                    height={100}
                    alt={member.alt}
                    className="h-fit w-fit rounded-full"
                  />
                </div>
              );
            })}
            <div className="my-auto cursor-pointer flex-col">
              <ArrowRight />
            </div>
          </div>
          <div className="flew-row text-muted mt-2 text-center font-sans">
            {t("more_than_25k_experts_use_myqpt")}
          </div>
        </div>
      </div>
      <div className="bottom-0 flex flex-row">
        <Footer items={footerLinks} />
      </div>
    </>
  );
}
