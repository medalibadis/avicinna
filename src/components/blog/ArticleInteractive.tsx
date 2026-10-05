'use client';

import React, { useState } from 'react';
import { Copy, Check, ChevronLeft, HelpCircle } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

export function ArticleFaqAccordion({ faqs, title }: { faqs: FaqItem[]; title: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mt-10 pt-8 border-t border-slate-200/80 space-y-4">
      <div className="flex items-center gap-2 text-slate-900 font-bold text-lg sm:text-xl">
        <HelpCircle className="w-5 h-5 text-sky-600" />
        <h2>{title}</h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="border border-slate-200/80 rounded-2xl overflow-hidden transition-all bg-slate-50/50"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full text-right rtl:text-right ltr:text-left px-5 py-4 font-bold text-xs sm:text-sm text-slate-800 flex items-center justify-between gap-3 hover:text-sky-600 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronLeft
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    isOpen ? '-rotate-90' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100/80 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function CopyArticleButton({ text, copiedText }: { text: string; copiedText: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1 text-slate-500 hover:text-sky-600 transition-colors cursor-pointer bg-slate-100 hover:bg-sky-50 px-2.5 py-1 rounded-lg"
      title={text}
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
      <span>{copied ? copiedText : text}</span>
    </button>
  );
}
