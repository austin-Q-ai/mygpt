import type { TrpcSessionUser } from "../../../trpc";

type ListOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
};

export const getAddedExpertsHandler = async ({ ctx }: ListOptions) => {
  const { user } = ctx;

  const users = await prisma.timeTokensWallet.findMany({
    where: {
      ownerId: user.id,
    },
    select: {
      emitter: {
        select: {
          id: true,
          avatar: true,
          name: true,
        },
      },
      amount: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  return {
    users: users,
  };
};
