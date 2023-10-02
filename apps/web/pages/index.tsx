import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React from "react";

import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import Shell from "@calcom/features/shell/Shell";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";

import PageWrapper from "@components/PageWrapper";
import { CubeMenu } from "@components/cubemenu";

const HomePage = () => {
  const { t } = useLocale();
  const router = useRouter();
  const { data: user, isLoading } = trpc.viewer.me.useQuery();

  return (
    <Shell>
      <div className="flex h-full w-full flex-col items-center">
        <CubeMenu />
        <div className="flex w-full flex-col items-center justify-center">
          <div className="text-secondary text-lg font-bold">{t("navigate_between_menu_using_cube")}</div>
          <div className="text-muted text-sm">{t("rotate_cube")}</div>
        </div>
      </div>
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
