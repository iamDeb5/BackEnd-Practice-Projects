import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MessageContent = ({ content, role }) => {
  if (role === "user") {
    return <p className="whitespace-pre-wrap leading-relaxed">{content}</p>;
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Headings
        h1: ({ children }) => (
          <h1 className="mb-3 mt-5 text-xl font-bold text-white first:mt-0">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="mb-2 mt-4 text-lg font-semibold text-white first:mt-0">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="mb-2 mt-3 text-base font-semibold text-white/90 first:mt-0">{children}</h3>
        ),

        // Paragraph
        p: ({ children }) => (
          <p className="mb-3 leading-7 text-white/85 last:mb-0">{children}</p>
        ),

        // Lists
        ul: ({ children }) => (
          <ul className="mb-3 ml-4 space-y-1 last:mb-0">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-3 ml-4 list-decimal space-y-1 last:mb-0">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="flex gap-2 text-white/85 leading-6">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#31b8c6]" />
            <span>{children}</span>
          </li>
        ),

        // Inline code
        code: ({ inline, className, children, ...props }) => {
          if (inline) {
            return (
              <code
                className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sm text-[#7dd3fc]"
                {...props}
              >
                {children}
              </code>
            );
          }
          return (
            <div className="my-3 overflow-hidden rounded-xl border border-white/10">
              <div className="flex items-center justify-between bg-white/5 px-4 py-2">
                <span className="text-xs font-medium text-white/40 uppercase tracking-wider">
                  {className?.replace("language-", "") || "code"}
                </span>
              </div>
              <pre className="overflow-x-auto bg-[#060810] p-4">
                <code className="font-mono text-sm text-[#a5f3fc] leading-6" {...props}>
                  {children}
                </code>
              </pre>
            </div>
          );
        },

        // Blockquote
        blockquote: ({ children }) => (
          <blockquote className="my-3 border-l-2 border-[#31b8c6]/60 pl-4 text-white/60 italic">
            {children}
          </blockquote>
        ),

        // Horizontal rule
        hr: () => <hr className="my-4 border-white/10" />,

        // Links
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#31b8c6] underline underline-offset-2 hover:text-[#7dd3fc] transition-colors"
          >
            {children}
          </a>
        ),

        // Strong / Bold
        strong: ({ children }) => (
          <strong className="font-semibold text-white">{children}</strong>
        ),

        // Emphasis / Italic
        em: ({ children }) => (
          <em className="italic text-white/75">{children}</em>
        ),

        // Table
        table: ({ children }) => (
          <div className="my-3 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-white/5 text-white/60 uppercase text-xs tracking-wider">
            {children}
          </thead>
        ),
        tbody: ({ children }) => (
          <tbody className="divide-y divide-white/5">{children}</tbody>
        ),
        tr: ({ children }) => <tr>{children}</tr>,
        th: ({ children }) => (
          <th className="px-4 py-2 text-left font-medium">{children}</th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-2 text-white/80">{children}</td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MessageContent;
