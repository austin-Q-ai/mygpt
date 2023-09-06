import { z } from "zod";

import { FULL_NAME_LENGTH_MAX_LIMIT } from "@calcom/lib/constants";
import { userMetadata } from "@calcom/prisma/zod-utils";

export const ZUploadProfileInputSchema = z.object({
  username: z.string().optional(),
  name: z.string().max(FULL_NAME_LENGTH_MAX_LIMIT).optional(),
  email: z.string().optional(),
  position: z.string().optional(),
  address: z.string().optional(),
  experiences: z.array(
    z.object({
      position: z.string(),
      company: z.string(),
      address: z.string().optional(),
      startMonth: z.number().optional(),
      startYear: z.number().optional(),
      endMonth: z.number().optional(),
      endYear: z.number().optional(),
      avatar: z.nullable(z.string()),
    })
  ).optional(),
  educations: z.array(
    z.object({
      school: z.string(),
      major: z.string().optional(),
      degree: z.string().optional(),
      startMonth: z.number().optional(),
      startYear: z.number().optional(),
      endMonth: z.number().optional(),
      endYear: z.number().optional(),
      avatar: z.nullable(z.string()),
    })
  ).optional(),
  skills: z.array(z.string()).optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  metadata: userMetadata.optional(),
});

export type TUploadProfileInputSchema = z.infer<typeof ZUploadProfileInputSchema>;
