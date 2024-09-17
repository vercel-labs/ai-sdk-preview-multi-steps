"use client";

import { motion } from "framer-motion";
import { BotIcon, UserIcon } from "./icons";
import { ReactNode } from "react";
import { StreamableValue, useStreamableValue } from "ai/rsc";
import { Markdown } from "./markdown";
import { Message as TMessage, ToolInvocation } from "ai";
import { ReasoningStep } from "./reasoning-step";

export const TextStreamMessage = ({
  content,
}: {
  content: StreamableValue;
}) => {
  const [text] = useStreamableValue(content);

  return (
    <motion.div
      className={`flex flex-row gap-4 px-4 w-full md:w-[500px] md:px-0 first-of-type:pt-20`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
        <BotIcon />
      </div>

      <div className="flex flex-col gap-1 w-full">
        <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
          <Markdown>{text}</Markdown>
        </div>
      </div>
    </motion.div>
  );
};

export const Message = ({
  role,
  content,
  toolInvocations,
  reasoningMessages,
}: {
  role: string;
  content: string | ReactNode;
  toolInvocations: Array<ToolInvocation> | undefined;
  reasoningMessages: Array<TMessage>;
}) => {
  const usingTool = toolInvocations ?? false;
  const loading = content === "" && toolInvocations === undefined;
  return (
    <motion.div
      className={`flex flex-row gap-4 px-4 w-full md:w-[500px] md:px-0 first-of-type:pt-20`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      {usingTool ? null : (
        <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
          {role === "assistant" ? <BotIcon /> : <UserIcon />}
        </div>
      )}

      <div className="flex flex-col gap-6 w-full">
        {reasoningMessages.length > 0 ? (
          <div className="flex flex-col gap-6 w-full">
            {reasoningMessages.map((message, i) => {
              const { content, toolInvocations } = message;
              if (
                toolInvocations &&
                toolInvocations.length > 0 &&
                toolInvocations[0]
              ) {
                return (
                  // @ts-ignore
                  <ReasoningStep step={toolInvocations[0].result} key={i} />
                );
              }
            })}
          </div>
        ) : null}
        {content && (
          <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
            <Markdown>{content as string}</Markdown>
          </div>
        )}

        {toolInvocations && (
          <div className="flex flex-col gap-4">
            {toolInvocations.map((toolInvocation) => {
              const { toolName, toolCallId, state } = toolInvocation;

              if (state === "result") {
                const { result } = toolInvocation;

                return (
                  <div key={toolCallId}>
                    {toolName === "addAReasoningStep" ? (
                      <ReasoningStep step={result} />
                    ) : null}
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};
