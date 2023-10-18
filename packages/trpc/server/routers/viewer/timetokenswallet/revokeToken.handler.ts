import { prisma } from "@calcom/prisma";

import type { TrpcSessionUser } from "../../../trpc";
import { TRPCError } from "@trpc/server";

type RevokeTokensOptions = {
    ctx: {
        user: NonNullable<TrpcSessionUser>;
    };
};

export const revokeTokenHandler = async ({ ctx }: RevokeTokensOptions) => {
    const { user } = ctx;

    const currentTokensQuery = await prisma?.user.findFirst({
        where: {
            id: user.id,
        },
        select: {
            tokens: true,
        },
    });

    const currentTokens = currentTokensQuery?.tokens;

    if (!currentTokens) throw new TRPCError({ code: "NOT_FOUND", message: "MISSING_TOKENS" })

    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            tokens: 0
        }
    })
};
