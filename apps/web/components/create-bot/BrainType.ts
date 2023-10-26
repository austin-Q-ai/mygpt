import { z } from "zod";

export const BrainEntity = z.object({
    brain_id: z.string(),
    name: z.string().min(1),
    description: z.string().optional(),
    prompt_id: z.string().optional(),
    linkedin: z.string().optional(),
    extraversion: z.number().optional(),
    neuroticism: z.number().optional(),
    conscientiousness: z.number().optional(),
})

export const MinimalBrainEntity = z.object({
    id: z.string(),
    name: z.string(),
    isDefault: z.boolean().optional(),
})

export const BrainEntityInput = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    linkedin: z.string().optional(),
    promptTitle: z.string().optional(),
    promptContent: z.string().optional(),
    logo: z.string().optional(),
    extraversion: z.number().optional(),
    neuroticism: z.number().optional(),
    conscientiousness: z.number().optional(),
})