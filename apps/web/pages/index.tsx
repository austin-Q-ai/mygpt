// import type { GetServerSidePropsContext } from "next";
// import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
// function RedirectPage() {
//   return;
// }
// export async function getServerSideProps({ req, res }: GetServerSidePropsContext) {
//   const session = await getServerSession({ req, res });
//   if (!session?.user?.id) {
//     return { redirect: { permanent: false, destination: "/auth/login" } };
//   }
//   return { redirect: { permanent: false, destination: "/event-types" } };
// }
// export default RedirectPage;
import { useRouter } from "next/router";
import React from "react";

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
          <div className="text-pink text-lg font-bold">Navigate between menus using the cube</div>
          <div className="text-muted text-sm">Rotate the cube and explore the navigation menus</div>
        </div>
      </div>
    </Shell>
  );
};

HomePage.PageWrapper = PageWrapper;

export default HomePage;
