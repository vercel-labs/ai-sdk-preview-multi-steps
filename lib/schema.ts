import { z } from "zod";

export const reasoningStepSchema = z.object({
  title: z.string().describe("The title of the reasoning step"),
  content: z.string().describe("The content of the reasoning step."),
  nextStep: z
    .enum(["continue", "finalAnswer"])
    .describe(
      "Whether to continue with another step or provide the final answer",
    ),
});

export type ReasoningStep = z.infer<typeof reasoningStepSchema>;
