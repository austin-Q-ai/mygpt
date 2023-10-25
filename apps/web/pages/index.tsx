import { MessageSquare } from "lucide-react";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import Shell from "@calcom/features/shell/Shell";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";
import { Button } from "@calcom/ui";

import PageWrapper from "@components/PageWrapper";
import Support from "@components/auth/Support";
import { CubeMenu } from "@components/cubemenu";

const HomePage = () => {
  const { t } = useLocale();
  const router = useRouter();
  const { data: user, isLoading } = trpc.viewer.me.useQuery();
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  return (
    <Shell>
      <div className="flex flex-col items-center w-full h-full">
        <CubeMenu />
        <div className="flex flex-col items-center justify-center w-full">
          <div className="text-lg font-bold text-secondary">{t("navigate_between_menu_using_cube")}</div>
          <div className="text-sm text-muted">{t("rotate_cube")}</div>
        </div>
      </div>
      <Button
        rounded
        onClick={() => setIsSupportOpen(true)}
        className={`fixed bottom-[42px] right-[75px] z-10 flex h-[52px] w-[52px] shrink-0 flex-col items-center justify-center bg-[#AF8AC2] text-white shadow-[0_2.97143px_2.97143px_0_rgba(109,39,142,0.50)] ${
          isSupportOpen ? "hidden" : ""
        }`}>
        <MessageSquare width="24px" height="24px" />
        <p className="text-center text-[8px] leading-[10.4px]">Support</p>
      </Button>
      <Support
        isOpen={isSupportOpen}
        setIsOpen={setIsSupportOpen}
        username={user?.name}
        className="fixed bottom-[38.8px] right-[36px] z-10"
      />
    </Shell>
  );
};

export async function getServerSideProps({ req, res }: GetServerSidePropsContext) {
  const session = await getServerSession({ req, res });
  if (!session?.user?.id) {
    return { redirect: { permanent: false, destination: "/auth/login" } };
  }
  return { props: {} };
}

HomePage.PageWrapper = PageWrapper;

export default HomePage;
