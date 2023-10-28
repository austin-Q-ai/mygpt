import type { ReactNode } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { UseFormReturn } from "react-hook-form";
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
});

export const MinimalBrainEntity = z.object({
  id: z.string(),
  name: z.string(),
  isDefault: z.boolean().optional(),
});

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
});

export const PersonalityEntityInput = z.object({
  feelingAnxious: z.string().default("0"),
  taskAccuracy: z.string().default("0"),
  criticism: z.string().default("0"),
  forgetful: z.string().default("0"),
  procrastinate: z.string().default("0"),
  socialSettings: z.string().default("0"),
  carryingoutTask: z.string().default("0"),
  interactingPeople: z.string().default("0"),
  remainingCalm: z.string().default("0"),
  setDefault: z.boolean().default(false),
});

export interface IBotInfoForm {
  form: UseFormReturn<any, any>;
  nextAvailable: boolean;
  setNextAvailable: Dispatch<SetStateAction<boolean>>;
}

export interface IPersonalityBasicForm {
  children: ReactNode;
}

export interface IPersonalityForm {
  form: UseFormReturn<any, any>;
  formItems: { value: string; label: string }[];
  isLast?: boolean;
}
