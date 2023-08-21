import type { TrpcSessionUser } from "../../../trpc";
import type { TAddExpertSchema } from "./addExpert.handler.schema";

type AddExpertOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TAddExpertSchema;
};

export const addExpertHandler = async ({ ctx, input }: AddExpertOptions) => {
  // const users = await prisma.User.findMany({
  //   where: {
  //     name: { contains: input.username },
  //   },
  //   select: {
  //     name: true,
  //     email: true,
  //     avatar: true,
  //   },
  //   orderBy: {
  //     id: "asc",
  //   },
  // });

  return {
    user: ctx.user,
  };
};
