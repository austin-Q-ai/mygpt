import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useState } from "react";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { localStorage } from "@calcom/lib/webstorage";
import { Card } from "@calcom/ui";

export const tips = [
  {
    id: 1,
    thumbnailUrl: "https://img.youtube.com/vi/60HJt8DOVNo/0.jpg",
    mediaLink: "https://go.mygpt.fi/dynamic-video",
    title: "Dynamic booking links",
    description: "Booking link that allows people to quickly schedule meetings.",
    href: "https://mygpt.fi/blog/cal-v-1-9",
  },
  {
    id: 2,
    thumbnailUrl: "https://img.youtube.com/vi/EAc46SPL6iA/0.jpg",
    mediaLink: "https://go.mygpt.fi/teams-video",
    title: "How to set up Teams",
    description: "Learn how to use round-robin and collective events.",
    href: "https://mygpt.fi/docs/enterprise-features/teams",
  },
  {
    id: 3,
    thumbnailUrl: "https://img.youtube.com/vi/c7ZKFuLy1fg/0.jpg",
    mediaLink: "https://go.mygpt.fi/routing-video",
    title: "Routing Forms, Workflows",
    description: "Ask screening questions of potential bookers to connect them with the right person",
    href: "https://mygpt.fi/blog/cal-v-1-8",
  },
  {
    id: 4,
    thumbnailUrl: "https://img.youtube.com/vi/zGr_s-fG84k/0.jpg",
    mediaLink: "https://go.mygpt.fi/confirmation-video",
    title: "Requires Confirmation",
    description: "Learn how to be in charge of your bookings",
    href: "https://mygpt.fi/resources/feature/opt-in",
  },
  {
    id: 5,
    thumbnailUrl: "https://img.youtube.com/vi/0v_nQtpxC_4/0.jpg",
    mediaLink: "https://go.mygpt.fi/payments-video",
    title: "Accept Payments",
    description: "Charge for your time with MyGPT.fi's Stripe App",
    href: "https://mygpt.fi/apps/stripe",
  },
  {
    id: 6,
    thumbnailUrl: "https://img.youtube.com/vi/yGiZo1Ry5-8/0.jpg",
    mediaLink: "https://go.mygpt.fi/recurring-video",
    title: "Recurring Bookings",
    description: "Learn how to create a recurring schedule",
    href: "https://go.mygpt.fi/recurring-video",
  },
  {
    id: 7,
    thumbnailUrl: "https://img.youtube.com/vi/UVXgo12cY4g/0.jpg",
    mediaLink: "https://go.mygpt.fi/routing-forms",
    title: "Routing Forms",
    description: "Ask questions and route to the correct person",
    href: "https://go.mygpt.fi/routing-forms",
  },
  {
    id: 8,
    thumbnailUrl: "https://img.youtube.com/vi/piKlAiibAFo/0.jpg",
    mediaLink: "https://go.mygpt.fi/workflows",
    title: "Automate Workflows",
    description: "Make time work for you and automate tasks",
    href: "https://go.mygpt.fi/workflows",
  },
  {
    id: 9,
    thumbnailUrl: "https://img.youtube.com/vi/93iOmzHieCU/0.jpg",
    mediaLink: "https://go.mygpt.fi/round-robin",
    title: "Round-Robin",
    description: "Create advanced group meetings with round-robin",
    href: "https://go.mygpt.fi/round-robin",
  },
  {
    id: 10,
    thumbnailUrl: "https://img.youtube.com/vi/jvaBafzVUQc/0.jpg",
    mediaLink: "https://go.mygpt.fi/video",
    title: "Cal Video",
    description: "Free video conferencing with recording",
    href: "https://go.mygpt.fi/video",
  },
  {
    id: 11,
    thumbnailUrl: "https://img.youtube.com/vi/KTg_qzA9NEc/0.jpg",
    mediaLink: "https://go.mygpt.fi/insights",
    title: "Insights",
    description: "Get a better understanding of your business",
    href: "https://go.mygpt.fi/insights",
  },
];

const reversedTips = tips.slice(0).reverse();

export default function Tips() {
  const [animationRef] = useAutoAnimate<HTMLDivElement>();

  const { t } = useLocale();

  const [list, setList] = useState<typeof tips>(() => {
    if (typeof window === "undefined") {
      return reversedTips;
    }
    try {
      const removedTipsString = localStorage.getItem("removedTipsIds");
      if (removedTipsString !== null) {
        const removedTipsIds = removedTipsString.split(",").map((id) => parseInt(id, 10));
        const filteredTips = reversedTips.filter((tip) => removedTipsIds.indexOf(tip.id) === -1);
        return filteredTips;
      } else {
        return reversedTips;
      }
    } catch {
      return reversedTips;
    }
  });

  const handleRemoveItem = (id: number) => {
    setList((currentItems) => {
      const items = localStorage.getItem("removedTipsIds") || "";
      const itemToRemoveIndex = currentItems.findIndex((item) => item.id === id);

      localStorage.setItem(
        "removedTipsIds",
        `${currentItems[itemToRemoveIndex].id.toString()}${items.length > 0 ? `,${items.split(",")}` : ""}`
      );
      currentItems.splice(itemToRemoveIndex, 1);
      return [...currentItems];
    });
  };

  const baseOriginalList = list.slice(0).reverse();
  return (
    <div
      className="hidden pb-4 pt-8 lg:grid"
      /* ref={animationRef} */
      style={{
        gridTemplateColumns: "1fr",
      }}>
      {list.map((tip) => {
        return (
          <div
            className="relative"
            style={{
              gridRowStart: 1,
              gridColumnStart: 1,
            }}
            key={tip.id}>
            <div
              className="relative"
              style={{
                transform: `scale(${1 - baseOriginalList.indexOf(tip) / 20})`,
                top: -baseOriginalList.indexOf(tip) * 10,
                opacity: `${1 - baseOriginalList.indexOf(tip) / 7}`,
              }}>
              <Card
                variant="SidebarCard"
                thumbnailUrl={tip.thumbnailUrl}
                mediaLink={tip.mediaLink}
                title={tip.title}
                description={tip.description}
                learnMore={{ href: tip.href, text: t("learn_more") }}
                actionButton={{ onClick: () => handleRemoveItem(tip.id), child: t("dismiss") }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
