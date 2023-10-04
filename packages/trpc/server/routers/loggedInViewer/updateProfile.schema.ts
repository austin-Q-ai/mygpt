import { z } from "zod";

import { FULL_NAME_LENGTH_MAX_LIMIT } from "@calcom/lib/constants";
import { userMetadata } from "@calcom/prisma/zod-utils";

export const ZUpdateProfileInputSchema = z.object({
  username: z.string().optional(),
  name: z.string().max(FULL_NAME_LENGTH_MAX_LIMIT).optional(),
  price: z.number().min(0).optional(),
  email: z.string().optional(),
  position: z.string().optional(),
  address: z.string().optional(),
  currency: z.string().optional(),
  experiences: z
    .array(
      z.object({
        id: z.number().optional(),
        key: z.string().optional(),
        position: z.string(),
        company: z.string(),
        address: z.string().optional(),
        startMonth: z.number().optional(),
        startYear: z.number().optional(),
        endMonth: z.number().optional(),
        endYear: z.number().optional(),
        avatar: z.nullable(z.string()),
        userId: z.number().optional(),
        delete: z.boolean().optional(),
      })
    )
    .optional(),
  educations: z
    .array(
      z.object({
        id: z.number().optional(),
        key: z.string().optional(),
        school: z.string(),
        major: z.string().optional(),
        degree: z.string().optional(),
        startMonth: z.number().optional(),
        startYear: z.number().optional(),
        endMonth: z.number().optional(),
        endYear: z.number().optional(),
        avatar: z.nullable(z.string()),
        userId: z.number().optional(),
        delete: z.boolean().optional(),
      })
    )
    .optional(),
  skills: z.array(z.string()).optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  timeZone: z.string().optional(),
  weekStart: z.string().optional(),
  hideBranding: z.boolean().optional(),
  allowDynamicBooking: z.boolean().optional(),
  brandColor: z.string().optional(),
  darkBrandColor: z.string().optional(),
  theme: z.string().optional().nullable(),
  completedOnboarding: z.boolean().optional(),
  locale: z.string().optional(),
  timeFormat: z.number().optional(),
  disableImpersonation: z.boolean().optional(),
  metadata: userMetadata.optional(),
  social: z
    .object({
      telegram: z.string().optional(),
      facebook: z.string().optional(),
      discord: z.string().optional(),
      instagram: z.string().optional(),
      linkedin: z.string().optional(),
    })
    .optional(),
  aiAdvantage: z.array(z.string()).optional(),
  timeTokenAdvantage: z.array(z.string()).optional(),
  defaultValue: z.boolean().optional(),
});

export type TUpdateProfileInputSchema = z.infer<typeof ZUpdateProfileInputSchema>;
