import axios from "axios";
import { useEffect } from "react";

import { getLayout } from "@calcom/features/settings/layouts/SettingsLayout";
import { trpc } from "@calcom/trpc/react";

import PageWrapper from "@components/PageWrapper";

const ExpertView = () => {
  const { data: user } = trpc.viewer.me.useQuery();
  const mutation = trpc.viewer.updateProfile.useMutation();
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BRAIN_SERVICE}/brains/default/`, {
        headers: {
          Authorization: `Bearer ${user?.apiKey}`,
        },
      })
      .then((data) => {
        mutation.mutate({
          expertId: data.data.id,
        });
      });
  }, []);
  return <></>;
};

ExpertView.getLayout = getLayout;
ExpertView.PageWrapper = PageWrapper;

export default ExpertView;
