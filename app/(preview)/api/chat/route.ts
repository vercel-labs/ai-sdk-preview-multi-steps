import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";
import { z } from "zod";

export async function POST(request: Request) {
  const { messages } = await request.json();

  const systemMessage = `You are an expert AI assistant that explains your reasoning step by step. For each step, provide a title that describes what you're doing in that step, along with the content. Decide if you need another step or if you're ready to give the final answer. USE AS MANY REASONING STEPS AS POSSIBLE. AT LEAST 3. BE AWARE OF YOUR LIMITATIONS AS AN LLM AND WHAT YOU CAN AND CANNOT DO. IN YOUR REASONING, INCLUDE EXPLORATION OF ALTERNATIVE ANSWERS. CONSIDER YOU MAY BE WRONG, AND IF YOU ARE WRONG IN YOUR REASONING, WHERE IT WOULD BE. FULLY TEST ALL OTHER POSSIBILITIES. YOU CAN BE WRONG. WHEN YOU SAY YOU ARE RE-EXAMINING, ACTUALLY RE-EXAMINE, AND USE ANOTHER APPROACH TO DO SO. DO NOT JUST SAY YOU ARE RE-EXAMINING. USE AT LEAST 4 METHODS TO DERIVE THE ANSWER. USE BEST PRACTICES. Use the addReasoningStep function for each step of your reasoning.`;

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    system: systemMessage,
    messages: convertToCoreMessages(messages),
    maxSteps: 10,
    experimental_toolCallStreaming: true,
    tools: {
      addAReasoningStep: {
        description: "Add a step to the reasoning process.",
        parameters: z.object({
          title: z.string().describe("The title of the reasoning step"),
          content: z.string().describe("The content of the reasoning step."),
          nextStep: z
            .enum(["continue", "finalAnswer"])
            .describe(
              "Whether to continue with another step or provide the final answer",
            ),
        }),
        execute: async (params) => params,
      },
    },
  });

  return result.toDataStreamResponse();
}
