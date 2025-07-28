import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Message } from "../types";

const CodeBlock = ({
  inline,
  className,
  children,
  ...props
}: {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}) => {
  const match = /language-(\w+)/.exec(className || "");
  return !inline && match ? (
    <SyntaxHighlighter
      style={oneDark}
      language={match[1]}
      PreTag="div"
      className="rounded-lg my-4"
      showLineNumbers
      {...props}
    >
      {String(children ?? "").replace(/\n$/, "")}
    </SyntaxHighlighter>
  ) : (
    <code
      className="bg-gray-800 text-emerald-400 px-1.5 py-0.5 rounded text-sm"
      {...props}
    >
      {children}
    </code>
  );
};

interface ChatWindowProps {
  messages: Message[];
  loading: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  loading,
}) => (
  <section className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto px-3 sm:px-6 py-8 space-y-8">
    {messages.map((msg, idx) => (
      <article
        key={idx}
        className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`relative max-w-[85%] ${msg.role === "user" ? "max-w-[75%]" : "max-w-[90%]"}`}
        >
          <div
            className={`relative rounded-2xl px-4 py-3 ${
              msg.role === "user"
                ? "bg-blue-500/15 border border-blue-500/20 text-gray-100"
                : "bg-[#131f24] border border-gray-700 text-gray-200"
            }`}
          >
            {msg.role === "user" ? (
              // User messages: clean, personal tone
              <div className="text-base leading-7 font-normal">
                <div className="prose prose-blue prose-invert max-w-none [&>p]:mb-2 [&>p:last-child]:mb-0">
                  <ReactMarkdown
                    components={{
                      code: CodeBlock,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            ) : (
              // AI messages: optimized for reading long-form content
              <div className="prose prose-invert max-w-none text-base leading-relaxed">
                <div
                  className="[&>h1]:text-lg [&>h1]:font-semibold [&>h1]:mb-3 [&>h1]:text-gray-100
                           [&>h2]:text-base [&>h2]:font-medium [&>h2]:mb-3 [&>h2]:text-gray-200
                           [&>h3]:text-sm [&>h3]:font-medium [&>h3]:mb-2 [&>h3]:text-gray-300
                           [&>p]:mb-3 [&>p:last-child]:mb-0 [&>p]:text-gray-200
                           [&>ul]:mb-3 [&>ul]:space-y-1 [&>ul>li]:text-gray-200 [&>ul>li]:leading-6
                           [&>ol]:mb-3 [&>ol]:space-y-1 [&>ol>li]:text-gray-200 [&>ol>li]:leading-6
                           [&>blockquote]:border-l-2 [&>blockquote]:border-emerald-400 [&>blockquote]:pl-3 [&>blockquote]:text-gray-300
                           [&>pre]:bg-gray-800 [&>pre]:border [&>pre]:border-gray-700 [&>pre]:rounded-lg [&>pre]:p-3 [&>pre]:mb-3
                           [&>code]:bg-gray-800 [&>code]:text-emerald-400 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-sm
                           [&_strong]:text-gray-100 [&_strong]:font-semibold"
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]} // GFM first, math second
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      code: CodeBlock,
                      table: ({ ...props }) => (
                        <div className="my-4 overflow-x-auto rounded-lg bg-gray-800 border border-gray-700 shadow-sm">
                          <table
                            className="w-full text-sm table-auto border-collapse"
                            {...props}
                          />
                        </div>
                      ),

                      thead: (props) => (
                        <thead
                          className="bg-gray-800 text-gray-100 border-b border-gray-700"
                          {...props}
                        />
                      ),
                      th: (props) => (
                        <th
                          className="px-3 py-2 font-medium text-left"
                          {...props}
                        />
                      ),
                      td: (props) => (
                        <td
                          className="px-3 py-2 text-gray-200 border-b border-gray-700"
                          {...props}
                        />
                      ),
                      tr: ({ ...props }) => (
                        <tr
                          className="even:bg-gray-800/40 hover:bg-gray-700/30"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    ))}

    {loading && (
      <div className="flex justify-start w-full">
        <div className="relative max-w-[90%]">
          <div className="bg-[#131f24] border border-gray-700 rounded-2xl px-4 py-3">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <div
                  className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
              <span className="text-sm text-gray-400">Thinking...</span>
            </div>
          </div>
        </div>
      </div>
    )}
  </section>
);
